import { useEffect, useMemo, useRef, useState } from "react";
import "./conceptGraph.css";

/* ---------- types mirroring src/data/concepts.json ---------- */

export interface Phase {
  id: string;
  num: number;
  label: string;
  detail: string;
  deadline?: string;
}
export interface Theme {
  id: string;
  label: string;
  color: string;
  summary: string;
  x: number;
  y: number;
  r: number;
}
export interface Notion {
  id: string;
  label: string;
  x: number;
  y: number;
  phases?: string[]; // optional override; inherits from parent concept otherwise
}
export interface Concept {
  id: string;
  theme: string;
  label: string;
  phases: string[];
  summary: string;
  x: number;
  y: number;
  notions: Notion[];
}
export interface Edge {
  source: string;
  target: string;
}
export interface GraphData {
  canvas: { width: number; height: number };
  phases: Phase[];
  themes: Theme[];
  concepts: Concept[];
  edges: Edge[];
}

interface Props {
  data: GraphData;
}

/* ---------- helpers ---------- */

interface Transform {
  x: number;
  y: number;
  k: number;
}

const CONCEPT_R = 17;
const NOTION_R = 8;
const MIN_Z = 0.85;
const MAX_Z = 6;

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type Selection =
  | { kind: "theme"; id: string }
  | { kind: "concept"; id: string }
  | { kind: "notion"; conceptId: string; id: string }
  | null;

/* ---------- component ---------- */

export default function ConceptGraph({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 1100, h: 600 });
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, k: 0.5 });
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [selection, setSelection] = useState<Selection>(null);

  const transformRef = useRef(transform);
  transformRef.current = transform;
  const interactedRef = useRef(false);
  const tweenRef = useRef<number | null>(null);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; k: number } | null>(null);
  const dragRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  const conceptById = useMemo(() => {
    const m = new Map<string, Concept>();
    data.concepts.forEach((c) => m.set(c.id, c));
    return m;
  }, [data]);
  const themeById = useMemo(() => {
    const m = new Map<string, Theme>();
    data.themes.forEach((t) => m.set(t.id, t));
    return m;
  }, [data]);
  const phaseById = useMemo(() => {
    const m = new Map<string, Phase>();
    data.phases.forEach((p) => m.set(p.id, p));
    return m;
  }, [data]);

  /* aggregated theme-level edges, derived from concept edges */
  const themeEdges = useMemo(() => {
    const seen = new Set<string>();
    const out: Array<[Theme, Theme]> = [];
    data.edges.forEach((e) => {
      const a = conceptById.get(e.source)!.theme;
      const b = conceptById.get(e.target)!.theme;
      if (a === b) return;
      const key = [a, b].sort().join("|");
      if (seen.has(key)) return;
      seen.add(key);
      out.push([themeById.get(a)!, themeById.get(b)!]);
    });
    return out;
  }, [data, conceptById, themeById]);

  const fitTransform = (w: number, h: number): Transform => {
    const k = Math.min(w / data.canvas.width, h / data.canvas.height) * 0.97;
    return {
      k,
      x: (w - data.canvas.width * k) / 2,
      y: (h - data.canvas.height * k) / 2,
    };
  };
  const fitK = Math.min(size.w / data.canvas.width, size.h / data.canvas.height) * 0.97;
  const z = transform.k / fitK; // relative zoom, 1 = whole map visible

  /* ---------- sizing ---------- */

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setSize({ w, h });
      if (!interactedRef.current) setTransform(fitTransform(w, h));
    });
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- zoom / pan ---------- */

  const clampZoom = (k: number) => Math.min(MAX_Z * fitK, Math.max(MIN_Z * fitK, k));

  const zoomAt = (px: number, py: number, factor: number) => {
    interactedRef.current = true;
    setTransform((t) => {
      const k = clampZoom(t.k * factor);
      const f = k / t.k;
      return { k, x: px - (px - t.x) * f, y: py - (py - t.y) * f };
    });
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.pow(1.0015, -e.deltaY));
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitK]);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 1) {
      dragRef.current = { x: e.clientX, y: e.clientY, moved: false };
    } else if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()];
      pinchRef.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), k: transformRef.current.k };
      dragRef.current = null;
    }
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 2 && pinchRef.current) {
      const [a, b] = [...pointersRef.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const rect = svgRef.current!.getBoundingClientRect();
      const cx = (a.x + b.x) / 2 - rect.left;
      const cy = (a.y + b.y) / 2 - rect.top;
      interactedRef.current = true;
      setTransform((t) => {
        const k = clampZoom(pinchRef.current!.k * (dist / pinchRef.current!.dist));
        const f = k / t.k;
        return { k, x: cx - (cx - t.x) * f, y: cy - (cy - t.y) * f };
      });
    } else if (dragRef.current) {
      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) dragRef.current.moved = true;
      if (dragRef.current.moved) {
        interactedRef.current = true;
        dragRef.current = { ...dragRef.current, x: e.clientX, y: e.clientY };
        setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
      }
    }
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (pointersRef.current.size === 0) dragRef.current = null;
  };

  const wasDrag = () => dragRef.current?.moved === true;

  /* ---------- animated navigation ---------- */

  const tweenTo = (target: Transform) => {
    if (tweenRef.current) cancelAnimationFrame(tweenRef.current);
    interactedRef.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTransform(target);
      return;
    }
    const from = { ...transformRef.current };
    const t0 = performance.now();
    const dur = 420;
    const step = (now: number) => {
      const p = easeInOutCubic(Math.min(1, (now - t0) / dur));
      setTransform({
        x: from.x + (target.x - from.x) * p,
        y: from.y + (target.y - from.y) * p,
        k: from.k + (target.k - from.k) * p,
      });
      if (p < 1) tweenRef.current = requestAnimationFrame(step);
    };
    tweenRef.current = requestAnimationFrame(step);
  };

  const zoomToTheme = (theme: Theme, targetZ = 2) => {
    const k = targetZ * fitK;
    tweenTo({ k, x: size.w / 2 - theme.x * k, y: size.h / 2 - theme.y * k });
  };

  const resetView = () => {
    setActivePhase(null);
    setSelection(null);
    tweenTo(fitTransform(size.w, size.h));
  };

  /* ---------- semantic-zoom opacities ---------- */

  const d1 = smoothstep(1.15, 1.6, z); // concepts + concept edges
  const d2 = smoothstep(2.4, 3.1, z); // fine-grained notions
  const themeEdgeOpacity = 1 - d1;
  const themeFillOpacity = 0.16 - 0.1 * smoothstep(1.4, 2.2, z);
  const themeLabelOpacity = 1 - 0.6 * smoothstep(2.4, 3.2, z);
  const themeFont = Math.max(20, 42 / Math.pow(z, 0.85));

  /* ---------- phase highlighting ---------- */

  const conceptMatches = (c: Concept) => !activePhase || c.phases.includes(activePhase);
  const notionMatches = (c: Concept, n: Notion) =>
    !activePhase || (n.phases ?? c.phases).includes(activePhase);
  const themeMatches = (t: Theme) =>
    !activePhase || data.concepts.some((c) => c.theme === t.id && conceptMatches(c));
  const DIM = 0.22;

  /* ---------- selection panel content ---------- */

  const renderPanel = () => {
    if (!selection) return null;
    if (selection.kind === "theme") {
      const t = themeById.get(selection.id)!;
      const list = data.concepts.filter((c) => c.theme === t.id);
      return (
        <PanelShell color={t.color} title={t.label} onClose={() => setSelection(null)}>
          <p>{t.summary}</p>
          <ul className="cg-panel-list">
            {list.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => setSelection({ kind: "concept", id: c.id })}>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </PanelShell>
      );
    }
    if (selection.kind === "concept") {
      const c = conceptById.get(selection.id)!;
      const t = themeById.get(c.theme)!;
      return (
        <PanelShell
          color={t.color}
          kicker={t.label}
          title={c.label}
          phases={c.phases.map((p) => phaseById.get(p)!)}
          onClose={() => setSelection(null)}
        >
          <p>{c.summary}</p>
          {c.notions.length > 0 && (
            <p className="cg-panel-notions">
              Notions abordées : {c.notions.map((n) => n.label).join(", ")}.
            </p>
          )}
        </PanelShell>
      );
    }
    const c = conceptById.get(selection.conceptId)!;
    const n = c.notions.find((x) => x.id === selection.id)!;
    const t = themeById.get(c.theme)!;
    return (
      <PanelShell
        color={t.color}
        kicker={`${t.label} › ${c.label}`}
        title={n.label}
        phases={(n.phases ?? c.phases).map((p) => phaseById.get(p)!)}
        onClose={() => setSelection(null)}
      >
        <p>{c.summary}</p>
      </PanelShell>
    );
  };

  /* ---------- render ---------- */

  return (
    <div className="cg-root">
      <div className="cg-toolbar">
        <div className="cg-legend" role="list" aria-label="Thèmes du cours">
          {data.themes.map((t) => (
            <button
              key={t.id}
              type="button"
              role="listitem"
              className="cg-chip"
              style={{ opacity: themeMatches(t) ? 1 : 0.35 }}
              onClick={() => {
                setSelection({ kind: "theme", id: t.id });
                zoomToTheme(t);
              }}
            >
              <span className="cg-chip-dot" style={{ background: t.color }} />
              {t.label}
            </button>
          ))}
        </div>
        <div className="cg-zoom">
          <button type="button" aria-label="Zoom arrière" onClick={() => zoomAt(size.w / 2, size.h / 2, 1 / 1.35)}>−</button>
          <button type="button" aria-label="Zoom avant" onClick={() => zoomAt(size.w / 2, size.h / 2, 1.35)}>+</button>
          <button type="button" className="cg-reset" onClick={resetView}>Vue d'ensemble</button>
        </div>
      </div>

      <div className="cg-stage" ref={containerRef}>
        <svg
          ref={svgRef}
          width={size.w}
          height={size.h}
          role="application"
          aria-label="Carte interactive des concepts du cours. Zoomez pour révéler les niveaux de détail."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
            {/* aggregated theme-to-theme links (visible zoomed out) */}
            {themeEdgeOpacity > 0.02 && (
              <g className="cg-theme-edges" style={{ opacity: themeEdgeOpacity }}>
                {themeEdges.map(([a, b]) => {
                  const dx = b.x - a.x;
                  const dy = b.y - a.y;
                  const len = Math.hypot(dx, dy);
                  const ux = dx / len;
                  const uy = dy / len;
                  return (
                    <line
                      key={a.id + b.id}
                      x1={a.x + ux * (a.r + 4)}
                      y1={a.y + uy * (a.r + 4)}
                      x2={b.x - ux * (b.r + 4)}
                      y2={b.y - uy * (b.r + 4)}
                    />
                  );
                })}
              </g>
            )}

            {/* theme discs */}
            {data.themes.map((t) => (
              <g
                key={t.id}
                className="cg-theme"
                style={{ opacity: themeMatches(t) ? 1 : DIM }}
                tabIndex={0}
                role="button"
                aria-label={`Thème : ${t.label}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelection({ kind: "theme", id: t.id });
                    zoomToTheme(t);
                  }
                }}
                onClick={() => {
                  if (wasDrag()) return;
                  setSelection({ kind: "theme", id: t.id });
                  if (z < 1.6) zoomToTheme(t);
                }}
              >
                <circle cx={t.x} cy={t.y} r={t.r} fill={t.color} fillOpacity={themeFillOpacity} stroke={t.color} strokeOpacity={0.5} />
                <text
                  className="cg-theme-label"
                  x={t.x}
                  y={t.y}
                  fill={t.color}
                  fontSize={themeFont}
                  style={{ opacity: themeLabelOpacity }}
                >
                  {t.label.split(" et ").map((part, i, arr) => (
                    <tspan key={i} x={t.x} dy={i === 0 ? (arr.length > 1 ? "-0.35em" : "0.35em") : "1.15em"}>
                      {i < arr.length - 1 ? `${part} et` : part}
                    </tspan>
                  ))}
                </text>
              </g>
            ))}

            {/* concept-level cross links */}
            {d1 > 0.02 && (
              <g className="cg-concept-edges" style={{ opacity: d1 }}>
                {data.edges.map((e) => {
                  const a = conceptById.get(e.source)!;
                  const b = conceptById.get(e.target)!;
                  const on =
                    !activePhase || conceptMatches(a) || conceptMatches(b);
                  return (
                    <line
                      key={e.source + e.target}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      style={{ opacity: on ? 1 : DIM }}
                    />
                  );
                })}
              </g>
            )}

            {/* depth-2 notions (rendered under the concept layer so concept labels stay legible) */}
            {d2 > 0.02 && (
              <g style={{ opacity: d2 }}>
                {data.concepts.map((c) => {
                  const t = themeById.get(c.theme)!;
                  return c.notions.map((n) => {
                    const on = notionMatches(c, n);
                    return (
                      <g
                        key={n.id}
                        className="cg-notion"
                        style={{ opacity: on ? 1 : DIM }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (wasDrag()) return;
                          setSelection({ kind: "notion", conceptId: c.id, id: n.id });
                        }}
                      >
                        <line x1={c.x} y1={c.y} x2={n.x} y2={n.y} stroke={t.color} strokeOpacity={0.35} />
                        <circle cx={n.x} cy={n.y} r={NOTION_R} fill="#fff" stroke={t.color} strokeWidth={2.5} />
                        <text className="cg-notion-label" x={n.x} y={n.y + NOTION_R + 11} fontSize={9.5}>
                          {n.label}
                        </text>
                      </g>
                    );
                  });
                })}
              </g>
            )}

            {/* depth-1 concepts */}
            {d1 > 0.02 && (
              <g style={{ opacity: d1 }}>
                {data.concepts.map((c) => {
                  const t = themeById.get(c.theme)!;
                  const on = conceptMatches(c);
                  return (
                    <g
                      key={c.id}
                      className="cg-concept"
                      style={{ opacity: on ? 1 : DIM }}
                      tabIndex={d1 > 0.5 ? 0 : -1}
                      role="button"
                      aria-label={c.label}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelection({ kind: "concept", id: c.id });
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (wasDrag()) return;
                        setSelection({ kind: "concept", id: c.id });
                      }}
                    >
                      <circle cx={c.x} cy={c.y} r={CONCEPT_R} fill={t.color} />
                      <text className="cg-concept-label" x={c.x} y={c.y + CONCEPT_R + 16} fontSize={15}>
                        {c.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

                      </g>
        </svg>

        {renderPanel()}
      </div>

      <p className="cg-hint">
        Molette ou pincement pour zoomer, glisser pour se déplacer. En zoomant, les grands thèmes
        s'ouvrent sur leurs concepts, puis sur les notions fines. Cliquer un élément affiche sa fiche.
      </p>

      {/* project timeline */}
      <div className="cg-timeline" role="group" aria-label="Les quatre phases du projet de session">
        {data.phases.map((p) => {
          const active = activePhase === p.id;
          return (
            <button
              key={p.id}
              type="button"
              className={`cg-phase${active ? " is-active" : ""}`}
              aria-pressed={active}
              onClick={() => setActivePhase(active ? null : p.id)}
            >
              <span className="cg-phase-num">{p.num}</span>
              <span className="cg-phase-body">
                <span className="cg-phase-label">{p.label}</span>
                <span className="cg-phase-detail">{p.detail}</span>
                {p.deadline && <span className="cg-phase-deadline">Remise le {p.deadline}</span>}
              </span>
            </button>
          );
        })}
      </div>
      <p className="cg-timeline-hint">
        {activePhase
          ? `La carte met en évidence les concepts travaillés pendant la phase ${phaseById.get(activePhase)!.num}. Cliquer de nouveau pour tout réafficher.`
          : "Cliquer une phase pour voir, dans la carte, les concepts qu'elle mobilise."}
      </p>
    </div>
  );
}

/* ---------- small presentational shell for the detail panel ---------- */

function PanelShell(props: {
  color: string;
  title: string;
  kicker?: string;
  phases?: Phase[];
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <aside className="cg-panel" style={{ borderTopColor: props.color }} aria-live="polite">
      <button type="button" className="cg-panel-close" onClick={props.onClose} aria-label="Fermer la fiche">
        ×
      </button>
      {props.kicker && <p className="cg-panel-kicker" style={{ color: props.color }}>{props.kicker}</p>}
      <h3>{props.title}</h3>
      {props.phases && props.phases.length > 0 && (
        <p className="cg-panel-phases">
          {props.phases.map((p) => (
            <span key={p.id} className="cg-badge">Phase {p.num}</span>
          ))}
        </p>
      )}
      {props.children}
    </aside>
  );
}
