import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ILLUSTRATIONS } from "./illustrations";
import "./cardExplorerStyle.css";

/* ---------- types ---------- */

export type FeuilleType =
  | "texte"
  | "code"
  | "comparaison"
  | "schema"
  | "video"
  | "lien"
  | "figure";

export interface Feuille {
  id: string;
  type: FeuilleType;
  titre: string;
  corps?: string;
  langue?: string;
  extrait?: string;
  pour?: string[];
  contre?: string[];
  youtube?: string;
  duree?: string;
  url?: string;
  source?: string;
  /** figure : clé de la bibliothèque d'illustrations, ou image fournie */
  illustration?: string;
  image?: { src: string; alt: string };
  legende?: string;
}

export interface Facette {
  id: string;
  titre: string;
  resume: string;
  points?: string[];
  enfants?: Feuille[];
}

export interface Notion {
  id: string;
  titre: string;
  resume: string;
  /** couleur du groupe; à défaut, la couleur du thème */
  accent?: string;
  etiquettes?: string[];
  facettes: Facette[];
}

export interface ThemeRef {
  id: string;
  label: string;
  color: string;
}

interface Props {
  theme: ThemeRef;
  notions: Notion[];
}

/* ---------- cellules : une liste plate, un seul niveau de grille ---------- */

type Base = { cle: string; parent: string | null; lignee: string[]; accent: string };
type Cellule =
  | (Base & { niveau: 0; notion: Notion })
  | (Base & { niveau: 1; facette: Facette; contexte: string })
  | (Base & { niveau: 2; feuille: Feuille; contexte: string });

/* largeur de chaque cellule, en colonnes de la grille de base */
function colonnes(cellule: Cellule): number {
  if (cellule.niveau === 0) return 2;
  if (cellule.niveau === 1) return 2;
  const t = cellule.feuille.type;
  if (t === "figure") return 4;
  if (t === "video" || t === "code" || t === "schema" || t === "comparaison") return 3;
  return 2;
}

function aplatir(notions: Notion[], ouvertes: Set<string>, defaut: string): Cellule[] {
  const sortie: Cellule[] = [];
  for (const notion of notions) {
    const accent = notion.accent ?? defaut;
    sortie.push({ cle: notion.id, niveau: 0, parent: null, lignee: [], accent, notion });
    if (!ouvertes.has(notion.id)) continue;
    for (const facette of notion.facettes) {
      const cle = `${notion.id}/${facette.id}`;
      sortie.push({
        cle,
        niveau: 1,
        parent: notion.id,
        lignee: [notion.id],
        accent,
        facette,
        contexte: notion.titre,
      });
      if (!ouvertes.has(cle)) continue;
      for (const feuille of facette.enfants ?? []) {
        sortie.push({
          cle: `${cle}/${feuille.id}`,
          niveau: 2,
          parent: cle,
          lignee: [notion.id, cle],
          accent,
          feuille,
          contexte: facette.titre,
        });
      }
    }
  }
  return sortie;
}

/* ---------- composant ---------- */

/* useLayoutEffect n'existe pas au rendu serveur : on retombe sur useEffect. */
const useEffetDeMiseEnPage =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const UNITE = 8; // hauteur d'une ligne de grille, en px
const ESPACE = 12; // gap, en px

export default function CardExplorer({ theme, notions }: Props) {
  const [ouvertes, setOuvertes] = useState<Set<string>>(new Set());
  const [filtre, setFiltre] = useState("");

  const grilleRef = useRef<HTMLDivElement>(null);
  const cellulesRef = useRef(new Map<string, HTMLElement>());
  const rectsRef = useRef(new Map<string, DOMRect>());
  const observerRef = useRef<ResizeObserver | null>(null);

  const requete = filtre.trim().toLowerCase();
  const notionsVisibles = useMemo(() => {
    if (!requete) return notions;
    const dans = (s?: string) => (s ?? "").toLowerCase().includes(requete);
    return notions.filter(
      (n) =>
        dans(n.titre) ||
        dans(n.resume) ||
        (n.etiquettes ?? []).some(dans) ||
        n.facettes.some(
          (f) =>
            dans(f.titre) ||
            dans(f.resume) ||
            (f.points ?? []).some(dans) ||
            (f.enfants ?? []).some((e) => dans(e.titre) || dans(e.corps)),
        ),
    );
  }, [notions, requete]);

  const cellules = useMemo(
    () => aplatir(notionsVisibles, ouvertes, theme.color),
    [notionsVisibles, ouvertes, theme.color],
  );

  /* --- mesure des positions avant changement, pour l'animation FLIP --- */
  const capturer = useCallback(() => {
    const rects = new Map<string, DOMRect>();
    cellulesRef.current.forEach((el, cle) => rects.set(cle, el.getBoundingClientRect()));
    rectsRef.current = rects;
  }, []);

  const bascule = useCallback(
    (cle: string) => {
      capturer();
      setOuvertes((prev) => {
        const suivant = new Set(prev);
        if (suivant.has(cle)) {
          for (const k of suivant) {
            if (k === cle || k.startsWith(`${cle}/`)) suivant.delete(k);
          }
        } else {
          suivant.add(cle);
        }
        return suivant;
      });
    },
    [capturer],
  );

  const toutReplier = () => {
    capturer();
    setOuvertes(new Set());
  };

  /* --- pavage : chaque cellule occupe le nombre de lignes que sa hauteur exige --- */
  const calerHauteur = useCallback((el: HTMLElement) => {
    const contenu = el.firstElementChild as HTMLElement | null;
    if (!contenu) return;
    const h = contenu.getBoundingClientRect().height;
    const lignes = Math.max(1, Math.ceil((h + ESPACE) / (UNITE + ESPACE)));
    el.style.gridRowEnd = `span ${lignes}`;
  }, []);

  const calerToutes = useCallback(() => {
    cellulesRef.current.forEach((el) => calerHauteur(el));
  }, [calerHauteur]);

  /* --- FLIP : les cellules glissent vers leur nouvelle place --- */
  useEffetDeMiseEnPage(() => {
    calerToutes();

    const reduit =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const precedents = rectsRef.current;

    cellulesRef.current.forEach((el, cle) => {
      const apres = el.getBoundingClientRect();
      const avant = precedents.get(cle);
      if (reduit) return;
      if (!avant) {
        el.animate(
          [
            { opacity: 0, transform: "scale(0.94)" },
            { opacity: 1, transform: "scale(1)" },
          ],
          { duration: 240, easing: "cubic-bezier(.2,.7,.3,1)" },
        );
        return;
      }
      const dx = avant.left - apres.left;
      const dy = avant.top - apres.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }],
        { duration: 320, easing: "cubic-bezier(.2,.7,.3,1)" },
      );
    });

    rectsRef.current = new Map();
  }, [cellules, calerToutes]);

  /* --- recalage quand le contenu change de hauteur (polices, iframes, resize) --- */
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const obs = new ResizeObserver((entrees) => {
      for (const entree of entrees) {
        const cellule = (entree.target as HTMLElement).parentElement;
        if (cellule) calerHauteur(cellule);
      }
    });
    observerRef.current = obs;
    cellulesRef.current.forEach((el) => {
      const contenu = el.firstElementChild;
      if (contenu) obs.observe(contenu);
    });
    return () => obs.disconnect();
  }, [cellules, calerHauteur]);

  useEffect(() => {
    const onResize = () => calerToutes();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [calerToutes]);

  /* --- échap referme le dernier niveau ouvert --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || ouvertes.size === 0) return;
      const plusProfonde = [...ouvertes].sort(
        (a, b) => b.split("/").length - a.split("/").length,
      )[0];
      bascule(plusProfonde);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ouvertes, bascule]);

  const refsRef = useRef(new Map<string, (el: HTMLElement | null) => void>());
  const enregistrer = useCallback((cle: string) => {
    let cb = refsRef.current.get(cle);
    if (!cb) {
      cb = (el: HTMLElement | null) => {
        if (el) {
          cellulesRef.current.set(cle, el);
          const contenu = el.firstElementChild;
          if (contenu) observerRef.current?.observe(contenu);
        } else {
          cellulesRef.current.delete(cle);
          refsRef.current.delete(cle);
        }
      };
      refsRef.current.set(cle, cb);
    }
    return cb;
  }, []);

  const quelquechoseOuvert = ouvertes.size > 0;

  return (
    <div className="ce-root" style={{ ["--theme" as string]: theme.color }}>
      <div className="ce-barre">
        <label className="ce-recherche">
          <span className="ce-cache">Filtrer les notions</span>
          <input
            type="search"
            value={filtre}
            placeholder="Filtrer…"
            onChange={(e) => {
              capturer();
              setFiltre(e.target.value);
            }}
          />
        </label>
        <p className="ce-etat" aria-live="polite">
          {cellules.length} cellule{cellules.length > 1 ? "s" : ""}
          {quelquechoseOuvert && " · échap referme"}
        </p>
        <button
          type="button"
          className="ce-replier"
          onClick={toutReplier}
          disabled={!quelquechoseOuvert}
        >
          Tout replier
        </button>
      </div>

      {cellules.length === 0 && <p className="ce-vide">Aucune notion ne correspond.</p>}

      <div className="ce-grille" ref={grilleRef}>
        {cellules.map((cellule) => {
          const ouverte = ouvertes.has(cellule.cle);
          const dansLaLignee =
            !quelquechoseOuvert ||
            ouverte ||
            cellule.lignee.some((a) => ouvertes.has(a)) ||
            cellule.niveau > 0;
          const classes = [
            "ce-cellule",
            `ce-n${cellule.niveau}`,
            ouverte ? "est-ouverte" : "",
            dansLaLignee ? "" : "est-en-retrait",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={cellule.cle}
              ref={enregistrer(cellule.cle)}
              className={classes}
              style={{
                ["--cols" as string]: colonnes(cellule),
                ["--accent" as string]: cellule.accent,
              }}
              id={cellule.niveau === 0 ? cellule.cle : undefined}
            >
              <div className="ce-contenu">
                {cellule.niveau === 0 && (
                  <CelluleNotion notion={cellule.notion} ouverte={ouverte} onOuvrir={bascule} />
                )}
                {cellule.niveau === 1 && (
                  <CelluleFacette
                    cle={cellule.cle}
                    facette={cellule.facette}
                    contexte={cellule.contexte}
                    ouverte={ouverte}
                    onOuvrir={bascule}
                  />
                )}
                {cellule.niveau === 2 && (
                  <CelluleFeuille feuille={cellule.feuille} contexte={cellule.contexte} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- cellules ---------- */

function CelluleNotion({
  notion,
  ouverte,
  onOuvrir,
}: {
  notion: Notion;
  ouverte: boolean;
  onOuvrir: (cle: string) => void;
}) {
  return (
    <>
      <span className="ce-bande" aria-hidden="true" />
      <button
        type="button"
        className="ce-tete"
        aria-expanded={ouverte}
        onClick={() => onOuvrir(notion.id)}
      >
        <span className="ce-titre">{notion.titre}</span>
        <span className="ce-pastille" aria-hidden="true">
          {ouverte ? "−" : notion.facettes.length}
        </span>
      </button>
      <p className="ce-resume">{notion.resume}</p>
      {notion.etiquettes && notion.etiquettes.length > 0 && (
        <ul className="ce-etiquettes">
          {notion.etiquettes.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </>
  );
}

function CelluleFacette({
  cle,
  facette,
  contexte,
  ouverte,
  onOuvrir,
}: {
  cle: string;
  facette: Facette;
  contexte: string;
  ouverte: boolean;
  onOuvrir: (cle: string) => void;
}) {
  const nb = (facette.enfants ?? []).length;
  const cliquable = nb > 0 || (facette.points ?? []).length > 0;
  return (
    <>
      <p className="ce-lignee">{contexte}</p>
      {cliquable ? (
        <button
          type="button"
          className="ce-tete"
          aria-expanded={ouverte}
          onClick={() => onOuvrir(cle)}
        >
          <span className="ce-titre">{facette.titre}</span>
          <span className="ce-pastille" aria-hidden="true">
            {ouverte ? "−" : "+"}
          </span>
        </button>
      ) : (
        <p className="ce-titre ce-titre--inerte">{facette.titre}</p>
      )}
      <p className="ce-resume">{facette.resume}</p>
      {ouverte && facette.points && facette.points.length > 0 && (
        <ul className="ce-points">
          {facette.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      )}
    </>
  );
}

function CelluleFeuille({ feuille, contexte }: { feuille: Feuille; contexte: string }) {
  return (
    <>
      <p className="ce-lignee">
        <span className="ce-genre">{genre(feuille.type)}</span>
        {contexte}
      </p>
      <p className="ce-titre ce-titre--feuille">{feuille.titre}</p>
      {feuille.corps && <p className="ce-resume">{feuille.corps}</p>}

      {(feuille.type === "code" || feuille.type === "schema") && feuille.extrait && (
        <pre className={`ce-code${feuille.type === "schema" ? " ce-code--schema" : ""}`}>
          <code>{feuille.extrait}</code>
        </pre>
      )}
      {feuille.type === "schema" && feuille.langue && (
        <p className="ce-note">Notation : {feuille.langue}.</p>
      )}

      {feuille.type === "comparaison" && (
        <div className="ce-comparaison">
          <div>
            <p>Points forts</p>
            <ul>
              {(feuille.pour ?? []).map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <p>Limites</p>
            <ul>
              {(feuille.contre ?? []).map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {feuille.type === "figure" && <Figure feuille={feuille} />}

      {feuille.type === "video" && feuille.youtube && (
        <div className="ce-video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${feuille.youtube}`}
            title={feuille.titre}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {(feuille.url || feuille.source) && (
        <p className="ce-source">
          {feuille.url ? (
            <a href={feuille.url} rel="external noopener" target="_blank">
              {feuille.source ?? feuille.url}
            </a>
          ) : (
            feuille.source
          )}
          {feuille.duree && <span className="ce-duree"> · {feuille.duree}</span>}
        </p>
      )}
    </>
  );
}

function Figure({ feuille }: { feuille: Feuille }) {
  const Dessin = feuille.illustration ? ILLUSTRATIONS[feuille.illustration] : undefined;
  return (
    <div className="ce-figure">
      {Dessin ? (
        <Dessin />
      ) : feuille.image ? (
        <img src={feuille.image.src} alt={feuille.image.alt} loading="lazy" />
      ) : (
        <p className="ce-figure-manquante">Illustration à venir.</p>
      )}
      {feuille.legende && <p className="ce-legende">{feuille.legende}</p>}
    </div>
  );
}

function genre(type: FeuilleType): string {
  switch (type) {
    case "code":
      return "Code";
    case "comparaison":
      return "Compromis";
    case "schema":
      return "Schéma";
    case "video":
      return "Vidéo";
    case "lien":
      return "Ressource";
    case "figure":
      return "Schéma";
    default:
      return "Exemple";
  }
}