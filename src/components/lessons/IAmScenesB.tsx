// Escenas interactivas 5–7 de «¿Qué dijo Jesús de sí mismo?»: la piedra, el camino y la vid.
import { useRef, useState } from "react";
import {
  CR, G, G2, G3, P, SAND, SAND2, STONE, STONE2, V, V2, WOOD, WOOD2, Y,
  Stage, useFinish, type SceneProps,
} from "./IAmShared";
import { clamp, dist, placeAt, polyline, pressable, useSvgDrag, type Pt } from "./svgDrag";

const f = (n: number) => n.toFixed(1);

/* ───────────── 5. La resurrección y la vida: rodar la piedra de la tumba ───────────── */

const STONE_R = 56;
const STONE_HOME: Pt = { x: 180, y: 210 };
const ROLL = 122;

export function StoneScene({ onDone }: SceneProps) {
  const svg = useRef<SVGSVGElement>(null);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const base = useRef(0);
  const [complete, finish] = useFinish(onDone, 2100);

  function rollAway() {
    setDx(ROLL);
    finish();
  }
  const bind = useSvgDrag<"stone">(svg, {
    onMove: (_, p, start) => {
      if (complete) return;
      if (!dragging) {
        setDragging(true);
        base.current = dx;
      }
      const v = clamp(base.current + p.x - start.x, 0, ROLL);
      setDx(v);
      if (v >= ROLL * 0.94) rollAway();
    },
    onEnd: (_, __, moved) => {
      setDragging(false);
      if (complete) return;
      if (!moved || dx >= ROLL * 0.7) rollAway();
      else setDx(0);
    },
  });

  const progress = dx / ROLL;
  // La piedra va un poco detrás del dedo para que se sienta pesada.
  const stoneStyle = {
    transform: `translate(${f(STONE_HOME.x + dx)}px, ${STONE_HOME.y}px) rotate(${f((dx / STONE_R) * 57.3)}deg)`,
    transformBox: "view-box" as const,
    transformOrigin: "0 0",
    transition: dragging ? "transform .35s ease-out" : "transform 1.3s cubic-bezier(.3,.6,.3,1)",
  };

  return (
    <Stage
      svgRef={svg}
      label="Una tumba en la roca con una piedra redonda en la entrada"
      hint={complete ? undefined : dx === 0 ? "Arrastra la piedra hacia la derecha, o tócala." : undefined}
    >
      <defs>
        <linearGradient id="iam-stone-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe3b0" />
          <stop offset="1" stopColor={CR} />
        </linearGradient>
        <radialGradient id="iam-stone-light" cx="0.5" cy="0.7">
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset="0.55" stopColor={Y} />
          <stop offset="1" stopColor={Y} stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="iam-stone-glow">
          <stop offset="0" stopColor="#fffbe8" stopOpacity="0.95" />
          <stop offset="0.5" stopColor={Y} stopOpacity="0.5" />
          <stop offset="1" stopColor={Y} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="360" height="300" fill="url(#iam-stone-sky)" />
      <circle cx="300" cy="56" r="20" fill={Y} />
      <path d="M0 230c60-20 120-18 180-6s120 10 180-6v82H0z" fill={G3} />
      <path d="M22 300C22 160 88 82 188 82S346 160 346 300Z" fill={STONE} />
      <path d="M250 110c50 30 80 100 84 190h12c0-90-40-160-96-190z" fill={STONE2} opacity="0.5" />
      <path d="M70 160l20 12-6 18M290 170l-16 14 8 14" fill="none" stroke={STONE2} strokeWidth="3" strokeLinecap="round" />

      {/* Interior de la tumba: vacío, se ilumina al mover la piedra */}
      <path d="M132 266V206A48 48 0 0 1 228 206V266Z" fill="#2c2140" />
      <g style={{ opacity: progress, transition: dragging ? "opacity .35s" : "opacity 1.3s" }}>
        <path d="M132 266V206A48 48 0 0 1 228 206V266Z" fill="url(#iam-stone-light)" />
        <rect x="146" y="240" width="68" height="14" rx="4" fill={STONE2} />
        <path d="M156 240c4-8 16-9 26-6 6 2 12 1 18-2l6 8z" fill="#fff" />
        {Array.from({ length: 9 }, (_, i) => {
          const a = ((-170 + i * 20) * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={f(180 + Math.cos(a) * 58)}
              y1={f(214 + Math.sin(a) * 58)}
              x2={f(180 + Math.cos(a) * 96)}
              y2={f(214 + Math.sin(a) * 96)}
              stroke={Y}
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.8"
            />
          );
        })}
      </g>
      <rect x="0" y="266" width="360" height="34" fill="#b9a68b" />
      <rect x="0" y="266" width="360" height="5" fill="#a08e74" />

      {/* La piedra */}
      <g className="iam-move" style={stoneStyle}>
        <g
          {...(complete ? {} : { ...bind("stone"), ...pressable("Piedra: arrástrala o tócala para moverla", rollAway) })}
          className={complete ? undefined : "iam-focus cursor-grab touch-none"}
        >
          <circle r={STONE_R} fill={STONE2} />
          <circle r={STONE_R - 16} fill="none" stroke={STONE} strokeWidth="4" />
          <path d="M-30 -20q12-10 26-4M10 24q14 4 22-8" fill="none" stroke="#857a99" strokeWidth="4" strokeLinecap="round" />
          <circle cx="-14" cy="-30" r="6" fill="#aea3c2" />
        </g>
      </g>
      {complete && <circle className="iam-expand" cx="180" cy="214" r="90" fill="url(#iam-stone-glow)" />}
    </Stage>
  );
}

/* ───────────── 6. El camino, la verdad y la vida: reconstruir el sendero ───────────── */

const ROAD = [
  { y: 300, cx: 180, w: 150 },
  { y: 236, cx: 166, w: 118 },
  { y: 178, cx: 190, w: 88 },
  { y: 128, cx: 170, w: 62 },
  { y: 88, cx: 184, w: 42 },
  { y: 58, cx: 180, w: 26 },
];
const roadAt = (k: number) => ROAD[k]!;
const segment = (k: number): Pt[] => {
  const a = roadAt(k);
  const b = roadAt(k + 1);
  return [
    { x: a.cx - a.w / 2, y: a.y },
    { x: a.cx + a.w / 2, y: a.y },
    { x: b.cx + b.w / 2, y: b.y },
    { x: b.cx - b.w / 2, y: b.y },
  ];
};
const center = (pts: Pt[]): Pt => ({
  x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
  y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
});
// Tramos que faltan: cada pieza tiene su propia forma y un único lugar.
const GAPS = [1, 2, 3].map((k) => {
  const pts = segment(k);
  const c = center(pts);
  return { k, c, rel: pts.map((p) => ({ x: p.x - c.x, y: p.y - c.y })) };
});
const TRAY: Record<number, Pt> = { 1: { x: 274, y: 340 }, 2: { x: 84, y: 340 }, 3: { x: 180, y: 340 } };

function RoadPiece({ rel }: { rel: Pt[] }) {
  const top = { x: (rel[2]!.x + rel[3]!.x) / 2, y: rel[2]!.y };
  const bottom = { x: (rel[0]!.x + rel[1]!.x) / 2, y: rel[0]!.y };
  return (
    <>
      <polygon points={polyline(rel)} fill={SAND} stroke={SAND2} strokeWidth="2" strokeLinejoin="round" />
      <line x1={f(bottom.x)} y1={f(bottom.y - 6)} x2={f(top.x)} y2={f(top.y + 6)} stroke="#fff6ea" strokeWidth="3" strokeDasharray="7 7" strokeLinecap="round" />
      <circle cx={f(rel[0]!.x * 0.5)} cy={f(rel[0]!.y * 0.4)} r="2.5" fill={SAND2} />
      <circle cx={f(rel[1]!.x * 0.45)} cy={f(rel[2]!.y * 0.3)} r="2" fill={SAND2} />
    </>
  );
}

export function PathScene({ onDone }: SceneProps) {
  const svg = useRef<SVGSVGElement>(null);
  const [placed, setPlaced] = useState<number[]>([]);
  const [drag, setDrag] = useState<{ k: number; p: Pt } | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const [miss, setMiss] = useState(false);
  const [complete, finish] = useFinish(onDone, 2600);

  function place(k: number) {
    const next = [...placed, k];
    setPlaced(next);
    setSel(null);
    setMiss(false);
    if (next.length === GAPS.length) finish();
  }
  const bind = useSvgDrag<number>(svg, {
    onMove: (k, p) => setDrag({ k, p }),
    onEnd: (k, p, moved) => {
      setDrag(null);
      if (!moved) {
        setSel(sel === k ? null : k);
        return;
      }
      const gap = GAPS.find((g) => g.k === k)!;
      if (dist(p, gap.c) < 42) place(k);
      else if (GAPS.some((g) => !placed.includes(g.k) && dist(p, g.c) < 42)) setMiss(true);
    },
  });
  function trySlot(k: number) {
    if (sel === null) return;
    if (sel === k) place(k);
    else {
      setMiss(true);
      setSel(null);
    }
  }

  const cameraStyle = {
    transform: complete ? "translate(0px, 26px) scale(1.22)" : "none",
    transformBox: "view-box" as const,
    transformOrigin: "180px 60px",
    transition: "transform 1.6s cubic-bezier(.4,0,.2,1) .9s",
  };

  return (
    <Stage
      svgRef={svg}
      height={380}
      label="Un sendero incompleto hacia una luz en el horizonte, con tres piezas sueltas"
      hint={
        complete
          ? undefined
          : miss
            ? "Esa pieza no encaja ahí. Fíjate en su forma."
            : sel !== null
              ? "Ahora toca el espacio donde encaja."
              : "Arrastra cada pieza a su lugar en el camino."
      }
    >
      <defs>
        <linearGradient id="iam-path-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="1" stopColor="#ffd98a" />
        </linearGradient>
        <radialGradient id="iam-path-glow">
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset="0.4" stopColor={Y} stopOpacity="0.8" />
          <stop offset="1" stopColor={Y} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="iam-move" style={cameraStyle}>
        <rect width="360" height="300" fill="url(#iam-path-sky)" />
        <circle cx="180" cy="48" r="70" fill="url(#iam-path-glow)" className="iam-pulse" />
        <path d="M0 76c60-14 120-16 180-6s120 6 180-8v238H0z" fill={G3} />
        <path d="M0 150c50-20 100-16 140 0M220 160c50-20 100-20 140-4v144H220z" fill={G2} opacity="0.6" />
        <path d="M0 210c40-10 70-8 100 4v86H0z" fill={G2} />
        {([[44, 120], [318, 112], [300, 230], [52, 262], [110, 96], [256, 90]] as const).map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="9" fill={G} />
            <circle cx={x + 8} cy={y + 2} r="7" fill={G} />
          </g>
        ))}
        {([[90, 160], [270, 186], [300, 150], [60, 200]] as const).map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill={P} />
        ))}

        {/* Tramos fijos del camino */}
        {[0, 4].map((k) => (
          <g key={k} transform={`translate(${f(center(segment(k)).x)} ${f(center(segment(k)).y)})`}>
            <RoadPiece rel={segment(k).map((p) => ({ x: p.x - center(segment(k)).x, y: p.y - center(segment(k)).y }))} />
          </g>
        ))}

        {/* Espacios vacíos */}
        {GAPS.filter((g) => !placed.includes(g.k)).map((g) => (
          <g
            key={g.k}
            {...pressable(sel !== null ? `Colocar la pieza en el espacio ${g.k}` : `Espacio vacío ${g.k} del camino`, () => trySlot(g.k))}
            onClick={() => trySlot(g.k)}
            className="iam-focus"
          >
            <polygon
              points={polyline(segment(g.k))}
              fill="#6b5a3e"
              fillOpacity="0.22"
              stroke="#fff"
              strokeWidth="2.5"
              strokeDasharray="7 6"
              className={sel !== null ? "iam-pulse" : undefined}
            />
          </g>
        ))}

        {complete && (
          <polyline
            className="iam-draw"
            points={polyline(ROAD.map((r) => ({ x: r.cx, y: r.y })))}
            pathLength={1}
            strokeDasharray="1"
            fill="none"
            stroke={Y}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Bandeja con las piezas */}
        <g style={{ opacity: complete ? 0 : 1, transition: "opacity .6s" }}>
          <rect y="300" width="360" height="80" fill="#f6e2c6" />
          <line x1="0" y1="301" x2="360" y2="301" stroke={SAND2} strokeWidth="2" strokeDasharray="6 6" />
        </g>
        {GAPS.map((g) => {
          const done = placed.includes(g.k);
          const isDrag = drag?.k === g.k;
          const pos = done ? g.c : isDrag ? drag.p : TRAY[g.k]!;
          return (
            <g key={g.k} className="iam-move" style={placeAt(pos, isDrag, 0, isDrag ? 1.05 : 1)}>
              <g
                {...(done
                  ? {}
                  : { ...bind(g.k), ...pressable(`Pieza ${g.k} del camino`, () => setSel(sel === g.k ? null : g.k)) })}
                className={done ? undefined : "iam-focus cursor-grab touch-none"}
              >
                <RoadPiece rel={g.rel} />
                {sel === g.k && (
                  <polygon points={polyline(g.rel)} fill="none" stroke={V} strokeWidth="3" strokeDasharray="6 5" />
                )}
              </g>
            </g>
          );
        })}
      </g>
    </Stage>
  );
}

/* ───────────── 7. La vid verdadera: conectar las ramas a la vid ───────────── */

const JOINTS = [
  { x: 184, y: 236, side: 1 },
  { x: 174, y: 184, side: -1 },
  { x: 182, y: 132, side: 1 },
];
const BRANCHES: { side: number; len: number; home: Pt; rot: number }[] = [
  { side: 1, len: 100, home: { x: 214, y: 286 }, rot: -6 },
  { side: -1, len: 96, home: { x: 150, y: 288 }, rot: 6 },
  { side: 1, len: 82, home: { x: 238, y: 56 }, rot: 10 },
];
const BARE = "#b3a594";

function Leaf({ x, y, s, tone }: { x: number; y: number; s: number; tone: string }) {
  return (
    <g className="iam-grow">
      <path d="M0 0c6-9 20-9 24 0-6 9-18 9-24 0z" fill={tone} transform={`translate(${f(x)} ${f(y)}) rotate(${-35 * s}) scale(${s} 1)`} />
    </g>
  );
}

function Grapes({ x, y }: { x: number; y: number }) {
  const dots = [[-8, 0], [0, 0], [8, 0], [-4, 7], [4, 7], [0, 14]] as const;
  return (
    <g className="iam-grow">
      <line x1={f(x)} y1={f(y - 8)} x2={f(x)} y2={f(y)} stroke={WOOD2} strokeWidth="2" />
      {dots.map(([dx, dy], i) => (
        <circle key={i} cx={f(x + dx)} cy={f(y + 4 + dy)} r="4.8" fill={i % 2 ? V2 : V} />
      ))}
    </g>
  );
}

function Branch({ side, len, attached, stage }: { side: number; len: number; attached: boolean; stage: number }) {
  const s = side;
  return (
    <>
      <path
        d={`M0 0C${f(s * len * 0.3)} -8 ${f(s * len * 0.6)} -26 ${f(s * len)} -34`}
        fill="none"
        stroke={attached ? WOOD2 : BARE}
        strokeWidth="8"
        strokeLinecap="round"
        style={{ transition: "stroke .6s" }}
      />
      {attached && stage >= 1 && (
        <>
          <Leaf x={s * len * 0.32} y={-12} s={s} tone={G} />
          <Leaf x={s * len * 0.66} y={-25} s={s} tone={G2} />
          <Leaf x={s * len * 0.95} y={-33} s={s} tone={G} />
        </>
      )}
      {attached && stage >= 2 && (
        <>
          <g className="iam-grow"><circle cx={f(s * len * 0.5)} cy="-21" r="4" fill="#b5e8b0" stroke={G} strokeWidth="1.5" /></g>
          <g className="iam-grow"><circle cx={f(s * len * 0.82)} cy="-31" r="3.5" fill={P} /></g>
        </>
      )}
      {attached && stage >= 3 && <Grapes x={s * len * 0.55} y={-14} />}
    </>
  );
}

export function VineScene({ onDone }: SceneProps) {
  const svg = useRef<SVGSVGElement>(null);
  const [joint, setJoint] = useState<(number | null)[]>([null, null, null]);
  const [drag, setDrag] = useState<{ b: number; p: Pt } | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const [miss, setMiss] = useState(false);
  const [complete, finish] = useFinish(onDone, 2400);

  const stage = joint.filter((j) => j !== null).length;
  const freeFor = (b: number) =>
    JOINTS.map((j, i) => ({ ...j, i })).filter((j) => j.side === BRANCHES[b]!.side && !joint.includes(j.i));

  function attach(b: number, j: number) {
    const next = joint.map((v, k) => (k === b ? j : v));
    setJoint(next);
    setSel(null);
    setMiss(false);
    if (next.every((v) => v !== null)) finish();
  }
  const bind = useSvgDrag<number>(svg, {
    onMove: (b, p) => setDrag({ b, p }),
    onEnd: (b, p, moved) => {
      setDrag(null);
      if (!moved) {
        setSel(sel === b ? null : b);
        return;
      }
      const near = freeFor(b).find((j) => dist(p, j) < 36);
      if (near) attach(b, near.i);
      else if (JOINTS.some((j) => dist(p, j) < 36)) setMiss(true);
    },
  });
  function tryJoint(i: number) {
    if (sel === null) return;
    if (freeFor(sel).some((j) => j.i === i)) attach(sel, i);
    else {
      setMiss(true);
      setSel(null);
    }
  }

  return (
    <Stage
      svgRef={svg}
      label="Una vid con tres ramas separadas"
      hint={
        complete
          ? undefined
          : miss
            ? "Esa rama crece hacia el otro lado. Prueba en otro punto."
            : sel !== null
              ? "Ahora toca el punto de la vid donde va."
              : `Ramas conectadas: ${stage}/3`
      }
    >
      <defs>
        <linearGradient id="iam-vine-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3dc" />
          <stop offset="1" stopColor={CR} />
        </linearGradient>
        <radialGradient id="iam-vine-glow" cx="0.5" cy="0.45">
          <stop offset="0" stopColor={Y} stopOpacity="0.55" />
          <stop offset="1" stopColor={Y} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="360" height="300" fill="url(#iam-vine-sky)" />
      {complete && <rect className="iam-fade" width="360" height="300" fill="url(#iam-vine-glow)" />}
      <path d="M0 262c60-12 120-12 180-4s120 6 180-4v46H0z" fill={G2} />
      <path d="M0 280c80-8 160-6 240 0s90 2 120-2v22H0z" fill={G} />

      {/* El tronco de la vid */}
      <path d="M180 300C168 252 194 206 176 156S188 92 180 62" fill="none" stroke={WOOD2} strokeWidth="18" strokeLinecap="round" />
      <path d="M180 300C168 252 194 206 176 156S188 92 180 62" fill="none" stroke={WOOD} strokeWidth="6" strokeLinecap="round" opacity="0.6" />
      <Leaf x={168} y={64} s={-1} tone={G} />
      <Leaf x={190} y={60} s={1} tone={G2} />
      {complete && (
        <>
          <Leaf x={160} y={84} s={-1} tone={G2} />
          <Leaf x={198} y={86} s={1} tone={G} />
          <Grapes x={186} y={92} />
        </>
      )}

      {/* Puntos de unión */}
      {JOINTS.map((j, i) =>
        joint.includes(i) ? null : (
          <g
            key={i}
            {...pressable(sel !== null ? `Conectar la rama en el punto ${i + 1}` : `Punto de unión ${i + 1}`, () => tryJoint(i))}
            onClick={() => tryJoint(i)}
            className="iam-focus"
          >
            <circle cx={j.x} cy={j.y} r="16" fill="none" stroke={Y} strokeWidth="3" strokeDasharray="5 4" className="iam-pulse" />
            <circle cx={j.x} cy={j.y} r="7" fill={WOOD2} stroke={Y} strokeWidth="2" />
            <path d={`M${j.x} ${j.y}l${j.side * 12} -4`} stroke={Y} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ),
      )}

      {/* Las ramas */}
      {BRANCHES.map((br, b) => {
        const j = joint[b];
        const attached = j !== null && j !== undefined;
        const isDrag = drag?.b === b;
        const pos = attached ? JOINTS[j]! : isDrag ? drag.p : br.home;
        return (
          <g key={b} className="iam-move" style={placeAt(pos, isDrag, attached ? 0 : br.rot, isDrag ? 1.05 : 1)}>
            <g
              {...(attached
                ? {}
                : { ...bind(b), ...pressable(`Rama ${b + 1}`, () => setSel(sel === b ? null : b)) })}
              className={attached ? undefined : "iam-focus cursor-grab touch-none"}
            >
              <path d={`M0 6L${f(br.side * br.len)} -28L${f(br.side * br.len)} -44L0 -10Z`} fill="transparent" />
              <Branch side={br.side} len={br.len} attached={attached} stage={stage} />
              {!attached && <circle r="6" fill={BARE} stroke={sel === b ? V : "#fff"} strokeWidth="2.5" />}
              {sel === b && (
                <path
                  d={`M0 0C${f(br.side * br.len * 0.3)} -8 ${f(br.side * br.len * 0.6)} -26 ${f(br.side * br.len)} -34`}
                  fill="none"
                  stroke={V}
                  strokeWidth="14"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                />
              )}
            </g>
          </g>
        );
      })}
      {complete && <rect className="iam-flash" width="360" height="300" fill="url(#iam-vine-glow)" />}
    </Stage>
  );
}

