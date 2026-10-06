/*
  Illustrations SVG des cellules de niveau 3.

  Chaque illustration est un SVG géométrique sans dépendance, qui reprend la
  couleur de son groupe via var(--accent) et l'encre via currentColor. Pour en
  ajouter une : écrire la fonction, l'inscrire dans ILLUSTRATIONS, puis mettre
  `"illustration": "<clé>"` sur une feuille de type "figure" dans le JSON.

  Pour une image fournie (PNG, SVG exporté, photo), ne pas passer par ici :
  utiliser `"image": { "src": "/illustrations/mon-fichier.svg", "alt": "…" }`
  sur la feuille, le fichier étant déposé dans public/illustrations/.
*/

type Illustration = () => JSX.Element;

const T = {
  trait: "var(--accent)",
  encre: "#1B2437",
  doux: "color-mix(in srgb, var(--accent) 14%, #fff)",
  gris: "#8D99AD",
};

const police = { fontFamily: "var(--police-titres)", fontSize: 11, fill: T.encre };
const petite = { ...police, fontSize: 9.5, fill: "#5A6478" };

/* ---------- C4 : quatre niveaux de zoom emboîtés ---------- */
function C4Zoom() {
  const cadres = [
    { x: 8, y: 10, w: 384, h: 150, label: "1 · Contexte" },
    { x: 40, y: 34, w: 320, h: 118, label: "2 · Conteneurs" },
    { x: 76, y: 58, w: 248, h: 86, label: "3 · Composants" },
    { x: 116, y: 82, w: 168, h: 54, label: "4 · Code" },
  ];
  return (
    <svg viewBox="0 0 400 180" role="img" aria-label="Les quatre niveaux emboîtés du modèle C4">
      {cadres.map((c, i) => (
        <g key={c.label}>
          <rect
            x={c.x}
            y={c.y}
            width={c.w}
            height={c.h}
            rx={10}
            fill={i === 3 ? T.doux : "none"}
            stroke={T.trait}
            strokeWidth={1.5}
            strokeOpacity={0.35 + i * 0.2}
          />
          <text x={c.x + 10} y={c.y + 16} style={petite}>
            {c.label}
          </text>
        </g>
      ))}
      <text x={200} y={116} textAnchor="middle" style={police}>
        zoom
      </text>
      <path d="M170 124 H230" stroke={T.trait} strokeWidth={1.5} markerEnd="url(#fl)" />
      <defs>
        <marker id="fl" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 z" fill={T.trait} />
        </marker>
      </defs>
    </svg>
  );
}

/* ---------- Architecture en couches ---------- */
function Couches() {
  const couches = [
    { y: 16, label: "Présentation", note: "interfaces, contrôleurs" },
    { y: 66, label: "Logique métier", note: "règles, cas d'utilisation" },
    { y: 116, label: "Accès aux données", note: "persistance" },
  ];
  return (
    <svg viewBox="0 0 400 180" role="img" aria-label="Trois couches superposées avec appels vers le bas">
      {couches.map((c, i) => (
        <g key={c.label}>
          <rect x={40} y={c.y} width={300} height={42} rx={8} fill={T.doux} stroke={T.trait} strokeWidth={1.4} />
          <text x={56} y={c.y + 24} style={police}>
            {c.label}
          </text>
          <text x={330} y={c.y + 24} textAnchor="end" style={petite}>
            {c.note}
          </text>
          {i < 2 && <path d={`M190 ${c.y + 42} V ${c.y + 50}`} stroke={T.trait} strokeWidth={1.6} markerEnd="url(#flc)" />}
        </g>
      ))}
      <text x={200} y={172} textAnchor="middle" style={petite}>
        chaque couche n'appelle que celle du dessous
      </text>
      <defs>
        <marker id="flc" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 z" fill={T.trait} />
        </marker>
      </defs>
    </svg>
  );
}

/* ---------- Hexagonale : ports et adaptateurs ---------- */
function Hexagonale() {
  const hex = "200,30 268,68 268,142 200,180 132,142 132,68";
  return (
    <svg viewBox="0 0 400 210" role="img" aria-label="Cœur métier hexagonal entouré de ses adaptateurs">
      <polygon points={hex} fill={T.doux} stroke={T.trait} strokeWidth={1.8} />
      <text x={200} y={100} textAnchor="middle" style={police}>
        Cœur métier
      </text>
      <text x={200} y={116} textAnchor="middle" style={petite}>
        aucune dépendance externe
      </text>

      {[
        { x: 16, y: 52, l: "Interface web", sens: "entrant" },
        { x: 16, y: 128, l: "Tests", sens: "entrant" },
        { x: 284, y: 52, l: "Base de données", sens: "sortant" },
        { x: 284, y: 128, l: "API tierce", sens: "sortant" },
      ].map((a) => (
        <g key={a.l}>
          <rect x={a.x} y={a.y} width={100} height={34} rx={7} fill="#fff" stroke={T.gris} strokeWidth={1.2} />
          <text x={a.x + 50} y={a.y + 21} textAnchor="middle" style={petite}>
            {a.l}
          </text>
        </g>
      ))}
      {/* ports : petits carrés sur la frontière */}
      {[
        [132, 76],
        [132, 138],
        [262, 76],
        [262, 138],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 5} y={y - 5} width={10} height={10} fill="#fff" stroke={T.trait} strokeWidth={1.6} />
      ))}
      <path d="M116 69 H127" stroke={T.gris} strokeWidth={1.4} />
      <path d="M116 145 H127" stroke={T.gris} strokeWidth={1.4} />
      <path d="M267 69 H284" stroke={T.gris} strokeWidth={1.4} />
      <path d="M267 145 H284" stroke={T.gris} strokeWidth={1.4} />
      <text x={200} y={200} textAnchor="middle" style={petite}>
        les carrés sont les ports, les boîtes les adaptateurs
      </text>
    </svg>
  );
}

/* ---------- Pipes et filtres ---------- */
function PipesFiltres() {
  const etapes = ["Lire", "Nettoyer", "Agréger", "Écrire"];
  return (
    <svg viewBox="0 0 400 120" role="img" aria-label="Chaîne de filtres reliés par des tuyaux">
      {etapes.map((e, i) => {
        const x = 14 + i * 96;
        return (
          <g key={e}>
            <rect x={x} y={38} width={72} height={40} rx={8} fill={T.doux} stroke={T.trait} strokeWidth={1.4} />
            <text x={x + 36} y={62} textAnchor="middle" style={police}>
              {e}
            </text>
            {i < etapes.length - 1 && (
              <path d={`M${x + 72} 58 H ${x + 92}`} stroke={T.gris} strokeWidth={1.6} markerEnd="url(#flp)" />
            )}
          </g>
        );
      })}
      <text x={200} y={100} textAnchor="middle" style={petite}>
        chaque filtre ignore ce qui précède et ce qui suit
      </text>
      <defs>
        <marker id="flp" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 z" fill={T.gris} />
        </marker>
      </defs>
    </svg>
  );
}

/* ---------- Publication / abonnement ---------- */
function Evenementiel() {
  return (
    <svg viewBox="0 0 400 170" role="img" aria-label="Un producteur publie sur un courtier, trois consommateurs s'abonnent">
      <rect x={14} y={62} width={92} height={40} rx={8} fill={T.doux} stroke={T.trait} strokeWidth={1.4} />
      <text x={60} y={86} textAnchor="middle" style={police}>
        Producteur
      </text>
      <path d="M108 82 H146" stroke={T.trait} strokeWidth={1.6} markerEnd="url(#fle)" />
      <rect x={148} y={44} width={70} height={76} rx={8} fill="#fff" stroke={T.trait} strokeWidth={1.8} />
      <text x={183} y={78} textAnchor="middle" style={police}>
        Courtier
      </text>
      <text x={183} y={94} textAnchor="middle" style={petite}>
        de messages
      </text>
      {["Facturation", "Courriel", "Statistiques"].map((c, i) => {
        const y = 20 + i * 50;
        return (
          <g key={c}>
            <path d={`M220 82 C 250 82, 250 ${y + 17}, 288 ${y + 17}`} fill="none" stroke={T.gris} strokeWidth={1.4} markerEnd="url(#fle2)" />
            <rect x={290} y={y} width={96} height={34} rx={7} fill="#fff" stroke={T.gris} strokeWidth={1.2} />
            <text x={338} y={y + 21} textAnchor="middle" style={petite}>
              {c}
            </text>
          </g>
        );
      })}
      <text x={183} y={148} textAnchor="middle" style={petite}>
        le producteur ignore qui consomme
      </text>
      <defs>
        <marker id="fle" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 z" fill={T.trait} />
        </marker>
        <marker id="fle2" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 z" fill={T.gris} />
        </marker>
      </defs>
    </svg>
  );
}

/* ---------- Échange REST ---------- */
function RestEchange() {
  return (
    <svg viewBox="0 0 400 160" role="img" aria-label="Requête et réponse HTTP entre un client et une API">
      <rect x={12} y={30} width={96} height={96} rx={10} fill={T.doux} stroke={T.trait} strokeWidth={1.4} />
      <text x={60} y={82} textAnchor="middle" style={police}>
        Client
      </text>
      <rect x={292} y={30} width={96} height={96} rx={10} fill={T.doux} stroke={T.trait} strokeWidth={1.4} />
      <text x={340} y={76} textAnchor="middle" style={police}>
        API
      </text>
      <text x={340} y={92} textAnchor="middle" style={petite}>
        ressources
      </text>

      <path d="M112 62 H288" stroke={T.trait} strokeWidth={1.6} markerEnd="url(#flr)" />
      <text x={200} y={54} textAnchor="middle" style={petite}>
        POST /api/reservations
      </text>
      <path d="M288 104 H112" stroke={T.gris} strokeWidth={1.6} markerEnd="url(#flr2)" />
      <text x={200} y={96} textAnchor="middle" style={petite}>
        201 Created · {"{ id: 4812 }"}
      </text>
      <text x={200} y={140} textAnchor="middle" style={petite}>
        sans état : chaque requête se suffit à elle-même
      </text>
      <defs>
        <marker id="flr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 z" fill={T.trait} />
        </marker>
        <marker id="flr2" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 z" fill={T.gris} />
        </marker>
      </defs>
    </svg>
  );
}

/* ---------- Mise à l'échelle horizontale ---------- */
function MiseEchelle() {
  return (
    <svg viewBox="0 0 400 180" role="img" aria-label="Un répartiteur de charge devant trois instances partageant une base de données">
      <rect x={140} y={10} width={120} height={34} rx={8} fill={T.doux} stroke={T.trait} strokeWidth={1.5} />
      <text x={200} y={32} textAnchor="middle" style={police}>
        Répartiteur
      </text>
      {[0, 1, 2].map((i) => {
        const x = 40 + i * 116;
        return (
          <g key={i}>
            <path d={`M200 46 C 200 66, ${x + 46} 60, ${x + 46} 78`} fill="none" stroke={T.gris} strokeWidth={1.3} markerEnd="url(#flm)" />
            <rect x={x} y={80} width={92} height={38} rx={8} fill="#fff" stroke={T.trait} strokeWidth={1.3} />
            <text x={x + 46} y={104} textAnchor="middle" style={petite}>
              Instance {i + 1}
            </text>
            <path d={`M${x + 46} 118 C ${x + 46} 136, 200 130, 200 140`} fill="none" stroke={T.gris} strokeWidth={1.2} />
          </g>
        );
      })}
      <rect x={140} y={140} width={120} height={30} rx={14} fill={T.doux} stroke={T.trait} strokeWidth={1.5} />
      <text x={200} y={160} textAnchor="middle" style={petite}>
        Base de données partagée
      </text>
      <defs>
        <marker id="flm" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 z" fill={T.gris} />
        </marker>
      </defs>
    </svg>
  );
}

/* ---------- Monolithe, modulaire, services ---------- */
function TroisDecoupages() {
  const bloc = (x: number, titre: string, cellules: number, separe: boolean) => (
    <g key={titre}>
      <text x={x + 56} y={16} textAnchor="middle" style={petite}>
        {titre}
      </text>
      {separe ? (
        Array.from({ length: cellules }).map((_, i) => (
          <rect
            key={i}
            x={x + (i % 2) * 60}
            y={26 + Math.floor(i / 2) * 44}
            width={52}
            height={36}
            rx={7}
            fill={T.doux}
            stroke={T.trait}
            strokeWidth={1.3}
          />
        ))
      ) : (
        <>
          <rect x={x} y={26} width={112} height={80} rx={9} fill={T.doux} stroke={T.trait} strokeWidth={1.5} />
          {cellules > 1 &&
            Array.from({ length: cellules }).map((_, i) => (
              <rect
                key={i}
                x={x + 8 + (i % 2) * 50}
                y={34 + Math.floor(i / 2) * 34}
                width={46}
                height={28}
                rx={5}
                fill="#fff"
                stroke={T.trait}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            ))}
        </>
      )}
    </g>
  );
  return (
    <svg viewBox="0 0 400 130" role="img" aria-label="Monolithe, monolithe modulaire et services séparés">
      {bloc(10, "Monolithe", 1, false)}
      {bloc(144, "Modulaire", 4, false)}
      {bloc(278, "Services", 4, true)}
      <text x={200} y={124} textAnchor="middle" style={petite}>
        même découpage logique, frontières de déploiement différentes
      </text>
    </svg>
  );
}

export const ILLUSTRATIONS: Record<string, Illustration> = {
  "c4-zoom": C4Zoom,
  couches: Couches,
  hexagonale: Hexagonale,
  "pipes-filtres": PipesFiltres,
  evenementiel: Evenementiel,
  "rest-echange": RestEchange,
  "mise-echelle": MiseEchelle,
  "trois-decoupages": TroisDecoupages,
};