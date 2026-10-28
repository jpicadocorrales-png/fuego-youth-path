// Escenas interactivas 1–4 de «¿Qué dijo Jesús de sí mismo?»: pan, luz, puerta y pastor.
// Las clases iam-* animan partes de las escenas (definidas en styles.css, solo con movimiento permitido).
import { useRef, useState } from "react";
import {
  C, CR, G, G2, G3, INK, NIGHT, P, SAND, SAND2, STONE2, V, WOOD, WOOD2, Y,
  Stage, useFinish, type SceneProps,
} from "./IAmShared";
import { clamp, densify, dist, placeAt, polyline, pressable, useSvgDrag, type Pt } from "./svgDrag";

const f = (n: number) => n.toFixed(1);
const rad = (d: number) => (d * Math.PI) / 180;

/* ───────────── 1. El pan de vida: arrastrar tres piezas de pan al plato ───────────── */

const PLATE = { x: 180, y: 158, rx: 78, ry: 56 };
const LOAF_R = 42;
const BREAD: { a0: number; home: Pt; rot: number }[] = [
  { a0: -90, home: { x: 62, y: 82 }, rot: -18 },
  { a0: 30, home: { x: 300, y: 96 }, rot: 22 },
  { a0: 150, home: { x: 70, y: 238 }, rot: 8 },
];
const CRUST = "#d9893a";
const CRUMB = "#eeb067";

function sector(a0: number, r: number) {
  const a1 = a0 + 120;
  return `M0 0L${f(r * Math.cos(rad(a0)))} ${f(r * Math.sin(rad(a0)))}A${r} ${r} 0 0 1 ${f(r * Math.cos(rad(a1)))} ${f(r * Math.sin(rad(a1)))}Z`;
}
// Centro aproximado de cada tercio del pan, para que la pieza gire sobre sí misma.
const centroid = (a0: number): Pt => ({ x: 22 * Math.cos(rad(a0 + 60)), y: 22 * Math.sin(rad(a0 + 60)) });

export function BreadScene({ onDone }: SceneProps) {
  const svg = useRef<SVGSVGElement>(null);
  const [placed, setPlaced] = useState([false, false, false]);
  const [drag, setDrag] = useState<{ i: number; p: Pt } | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const [complete, finish] = useFinish(onDone, 2000);

  const onPlate = (p: Pt) => ((p.x - PLATE.x) / PLATE.rx) ** 2 + ((p.y - PLATE.y) / PLATE.ry) ** 2 <= 1.25;
  function place(i: number) {
    const next = placed.map((v, k) => v || k === i);
    setPlaced(next);
    setSel(null);
    if (next.every(Boolean)) finish();
  }
  const bind = useSvgDrag<number>(svg, {
    onMove: (i, p) => setDrag({ i, p }),
    onEnd: (i, p, moved) => {
      setDrag(null);
      if (!moved) setSel(sel === i ? null : i);
      else if (onPlate(p)) place(i);
    },
  });
  const count = placed.filter(Boolean).length;
  const tryPlate = () => {
    if (sel !== null) place(sel);
  };

  return (
    <Stage
      svgRef={svg}
      label="Una mesa con un plato vacío y tres piezas de pan"
      hint={complete ? undefined : sel !== null ? "Ahora toca el plato." : `Piezas en el plato: ${count}/3`}
    >
      <defs>
        <radialGradient id="iam-bread-warm">
          <stop offset="0" stopColor={Y} stopOpacity="0.8" />
          <stop offset="1" stopColor={Y} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="360" height="300" fill="#f3cfa4" />
      <rect x="10" y="22" width="340" height="270" rx="38" fill="#b9733a" />
      <rect x="10" y="18" width="340" height="262" rx="38" fill="#d9925a" />
      {[70, 130, 200, 250].map((y) => (
        <path key={y} d={`M30 ${y}c60-8 120 8 180 0s100-6 120 2`} fill="none" stroke="#c98149" strokeWidth="3" strokeLinecap="round" />
      ))}
      <rect x="98" y="30" width="164" height="238" rx="16" fill={CR} />
      <rect x="98" y="44" width="164" height="6" fill={C} opacity="0.65" />
      <rect x="98" y="248" width="164" height="6" fill={C} opacity="0.65" />
      <g transform="translate(296 222)">
        <circle r="22" fill="#fff" stroke="#eadfce" strokeWidth="3" />
        <circle r="14" fill="#8b3a4a" />
        <rect x="20" y="-5" width="12" height="10" rx="4" fill="#fff" stroke="#eadfce" strokeWidth="2" />
      </g>

      {/* El plato */}
      <g
        {...pressable(sel !== null ? "Colocar la pieza en el plato" : "Plato vacío", tryPlate)}
        onClick={tryPlate}
        className="iam-focus"
      >
        <ellipse cx={PLATE.x} cy={PLATE.y + 8} rx={PLATE.rx} ry={PLATE.ry} fill="#000" opacity="0.12" />
        <ellipse cx={PLATE.x} cy={PLATE.y} rx={PLATE.rx} ry={PLATE.ry} fill="#fff" stroke="#eadfce" strokeWidth="3" />
        <ellipse cx={PLATE.x} cy={PLATE.y} rx={PLATE.rx - 22} ry={PLATE.ry - 16} fill="#f6efe7" />
        {sel !== null && (
          <ellipse cx={PLATE.x} cy={PLATE.y} rx={PLATE.rx + 6} ry={PLATE.ry + 6} fill="none" stroke={V} strokeWidth="3" strokeDasharray="8 6" className="iam-pulse" />
        )}
      </g>
      {complete && (
        <ellipse className="iam-glow" cx={PLATE.x} cy={PLATE.y} rx={PLATE.rx + 10} ry={PLATE.ry + 10} fill="url(#iam-bread-warm)" />
      )}

      {/* Las tres piezas de pan */}
      {BREAD.map((b, i) => {
        const c = centroid(b.a0);
        const isDrag = drag?.i === i;
        const done = placed[i]!;
        const pos = done ? { x: PLATE.x + c.x, y: PLATE.y + c.y } : isDrag ? drag.p : b.home;
        return (
          <g key={i} className="iam-move" style={placeAt(pos, isDrag, done ? 0 : b.rot, isDrag ? 1.08 : 1)}>
            <g
              transform={`translate(${f(-c.x)} ${f(-c.y)})`}
              {...(done
                ? {}
                : { ...bind(i), ...pressable(`Pieza de pan ${i + 1}`, () => setSel(sel === i ? null : i)) })}
              className={done ? undefined : "iam-focus cursor-grab touch-none"}
            >
              <g className={done ? undefined : "iam-bob"} style={{ animationDelay: `${i * 0.5}s` }}>
                <circle cx={c.x} cy={c.y} r="34" fill="transparent" />
                <path d={sector(b.a0, LOAF_R)} fill={CRUST} stroke={CR} strokeWidth="2.5" strokeLinejoin="round" />
                <path d={sector(b.a0, LOAF_R - 12)} fill={CRUMB} opacity="0.6" />
                <path
                  d={`M${f(c.x - 8)} ${f(c.y - 4)}q8 -6 16 0`}
                  fill="none"
                  stroke="#b86d27"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
              {sel === i && <circle cx={c.x} cy={c.y} r="36" fill="none" stroke={V} strokeWidth="3" strokeDasharray="6 5" />}
            </g>
          </g>
        );
      })}

      {/* Las piezas se unen en un pan completo */}
      {complete && (
        <g className="iam-fade" transform={`translate(${PLATE.x} ${PLATE.y})`}>
          <circle r={LOAF_R + 2} fill={CRUST} />
          <circle r={LOAF_R - 12} fill={CRUMB} opacity="0.6" />
          {[-14, 0, 14].map((x) => (
            <path key={x} d={`M${x - 10} ${-18 + Math.abs(x) / 2}q10 18 0 36`} fill="none" stroke="#b86d27" strokeWidth="3" strokeLinecap="round" />
          ))}
        </g>
      )}
      {complete && <rect className="iam-flash" width="360" height="300" fill="url(#iam-bread-warm)" />}
    </Stage>
  );
}

/* ───────────── 2. La luz del mundo: llevar la luz por un sendero oscuro ───────────── */

const LIGHT_WAY: Pt[] = [
  { x: 180, y: 284 }, { x: 150, y: 254 }, { x: 128, y: 222 }, { x: 150, y: 192 }, { x: 204, y: 172 },
  { x: 234, y: 144 }, { x: 212, y: 112 }, { x: 172, y: 92 }, { x: 178, y: 66 }, { x: 222, y: 46 },
];
const LIGHT_PATH = densify(LIGHT_WAY, 8);
const LIGHT_LAST = LIGHT_PATH.length - 1;

export function LightScene({ onDone }: SceneProps) {
  const svg = useRef<SVGSVGElement>(null);
  const [lamp, setLamp] = useState<Pt>(LIGHT_PATH[0]!);
  const [dragging, setDragging] = useState(false);
  const [lit, setLit] = useState<Pt[]>([LIGHT_PATH[0]!]);
  const [reach, setReach] = useState(0);
  const [complete, finish] = useFinish(onDone, 2000);

  function advance(to: number) {
    const target = Math.min(to, LIGHT_LAST);
    setReach(target);
    if (target >= LIGHT_LAST - 1) {
      setLamp(LIGHT_PATH[LIGHT_LAST]!);
      finish();
    }
  }
  function step() {
    const target = Math.min(reach + 7, LIGHT_LAST);
    setLit((l) => [...l, ...LIGHT_PATH.slice(reach + 1, target + 1)]);
    setLamp(LIGHT_PATH[target]!);
    advance(target);
  }
  const bind = useSvgDrag<"lamp">(svg, {
    onMove: (_, p) => {
      if (complete) return;
      const q = { x: clamp(p.x, 12, 348), y: clamp(p.y, 12, 288) };
      setDragging(true);
      setLamp(q);
      setLit((l) => (dist(l[l.length - 1]!, q) > 12 ? [...l, q] : l));
      // Avanza solo siguiendo el sendero, sin saltarse tramos.
      let best = reach;
      for (let k = reach + 1; k <= Math.min(reach + 6, LIGHT_LAST); k++) {
        if (dist(LIGHT_PATH[k]!, q) < 34) best = k;
      }
      if (best !== reach) advance(best);
    },
    onEnd: (_, __, moved) => {
      setDragging(false);
      if (complete) return;
      if (!moved) step();
      else setLamp(LIGHT_PATH[reach]!);
    },
  });

  return (
    <Stage
      svgRef={svg}
      label="Un sendero en la oscuridad y una pequeña luz"
      hint={complete ? undefined : reach === 0 ? "Arrastra la luz por el sendero, o tócala para avanzar." : undefined}
    >
      <defs>
        <linearGradient id="iam-light-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd98a" />
          <stop offset="1" stopColor={CR} />
        </linearGradient>
        <radialGradient id="iam-light-hole">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.55" stopColor="#000" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="iam-light-warm" cx="0.6" cy="0.15">
          <stop offset="0" stopColor="#fffbe8" stopOpacity="0.95" />
          <stop offset="0.5" stopColor={Y} stopOpacity="0.45" />
          <stop offset="1" stopColor={Y} stopOpacity="0" />
        </radialGradient>
        <mask id="iam-light-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="360" height="300">
          <rect width="360" height="300" fill="#fff" />
          {lit.map((p, i) => (
            <circle key={i} cx={f(p.x)} cy={f(p.y)} r="46" fill="url(#iam-light-hole)" />
          ))}
          <circle cx={f(lamp.x)} cy={f(lamp.y)} r="56" fill="url(#iam-light-hole)" />
        </mask>
      </defs>

      {/* El paisaje completo, oculto por la oscuridad */}
      <rect width="360" height="300" fill="url(#iam-light-sky)" />
      <circle cx="232" cy="30" r="22" fill={Y} />
      <path d="M0 120c60-30 120-30 180-10s120 10 180-20v210H0z" fill={G3} />
      <path d="M0 190c70-24 130-20 200 0s110 6 160-14v124H0z" fill={G2} />
      <polyline points={polyline(LIGHT_WAY)} fill="none" stroke={SAND} strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={polyline(LIGHT_WAY)} fill="none" stroke={SAND2} strokeWidth="2" strokeDasharray="4 10" strokeLinecap="round" strokeLinejoin="round" />
      {([[62, 196, 26], [96, 128, 20], [276, 210, 28], [300, 120, 22], [118, 72, 16], [262, 70, 14], [40, 268, 22], [314, 262, 20]] as const).map(([x, y, r]) => (
        <g key={`${x}-${y}`}>
          <rect x={x - 3} y={y} width="6" height={r} rx="3" fill={WOOD2} />
          <circle cx={x} cy={y - r * 0.2} r={r} fill={G} />
          <circle cx={x - r * 0.35} cy={y - r * 0.5} r={r * 0.45} fill={G2} opacity="0.7" />
        </g>
      ))}
      {([[110, 250], [228, 252], [246, 196], [92, 172]] as const).map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill={P} />
      ))}

      {/* La oscuridad: se abre donde pasa la luz */}
      <rect
        width="360"
        height="300"
        fill={NIGHT}
        mask="url(#iam-light-mask)"
        className="iam-move"
        style={{ opacity: complete ? 0 : 0.9, transition: "opacity 1.6s ease" }}
      />
      {!complete &&
        ([[40, 30], [96, 52], [150, 22], [300, 40], [330, 96], [24, 120]] as const).map(([x, y]) => (
          <circle key={`${x}-${y}`} className="iam-twinkle" cx={x} cy={y} r="1.6" fill={CR} />
        ))}
      {complete && <rect className="iam-flash" width="360" height="300" fill="url(#iam-light-warm)" />}

      {/* La luz que el usuario mueve */}
      <g className="iam-move" style={placeAt(lamp, dragging)}>
        <g
          {...(complete ? {} : { ...bind("lamp"), ...pressable("Luz: tócala para avanzar por el sendero", step) })}
          className={complete ? undefined : "iam-focus cursor-grab touch-none"}
        >
          <circle r="30" fill="transparent" />
          <circle r="26" fill={Y} opacity="0.3" className="iam-pulse" />
          <path d="M-8 -16a8 8 0 0 1 16 0" fill="none" stroke={INK} strokeWidth="2.5" />
          <rect x="-11" y="-16" width="22" height="6" rx="2" fill={INK} />
          <rect x="-9" y="-10" width="18" height="20" rx="4" fill={Y} stroke={INK} strokeWidth="2" />
          <path d="M0 6c-4 0-5-4-3-7 1-2 3-3 3-6 2 2 4 4 4 7 0 4-2 6-4 6z" fill="#fff6ea" />
          <rect x="-11" y="10" width="22" height="5" rx="2" fill={INK} />
        </g>
      </g>
    </Stage>
  );
}

/* ───────────── 3. La puerta: deslizar el cerrojo y abrir la puerta ───────────── */

const ARCH = "M120 270V110A60 60 0 0 1 240 110V270Z";
const DOOR = "M0 200V40A60 60 0 0 1 120 40V200Z";

export function DoorScene({ onDone }: SceneProps) {
  const svg = useRef<SVGSVGElement>(null);
  const [bolt, setBolt] = useState(1); // 1 = cerrado, 0 = abierto
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(0); // 0 = cerrada, 1 = abierta
  const [drag, setDrag] = useState<"bolt" | "door" | null>(null);
  const base = useRef(0);
  const [complete, finish] = useFinish(onDone, 1700);

  function unlock() {
    setBolt(0);
    setUnlocked(true);
  }
  function openDoor() {
    setOpen(1);
    finish();
  }
  const bind = useSvgDrag<"bolt" | "door">(svg, {
    onMove: (id, p, start) => {
      if (drag !== id) {
        setDrag(id);
        base.current = id === "bolt" ? bolt : open;
      }
      if (id === "bolt") setBolt(clamp(base.current + (p.x - start.x) / 26, 0, 1));
      else setOpen(clamp(base.current + (start.x - p.x) / 110, 0, 1));
    },
    onEnd: (id, _, moved) => {
      setDrag(null);
      if (id === "bolt") {
        if (!moved || bolt < 0.5) unlock();
        else setBolt(1);
      } else if (!moved || open > 0.45) openDoor();
      else setOpen(0);
    },
  });

  const doorStyle = {
    transform: `translate(120px, 70px) matrix(${f(1 - 0.86 * open)}, ${f(-0.12 * open)}, 0, 1, 0, 0)`,
    transformBox: "view-box" as const,
    transformOrigin: "0 0",
    transition: drag === "door" ? "none" : "transform .9s cubic-bezier(.3,.7,.2,1)",
  };

  return (
    <Stage
      svgRef={svg}
      label="Una puerta cerrada con cerrojo en un muro"
      hint={
        complete
          ? undefined
          : !unlocked
            ? "Desliza el cerrojo hacia la izquierda, o tócalo."
            : "Ahora arrastra la puerta hacia la izquierda para abrirla, o tócala."
      }
    >
      <defs>
        <clipPath id="iam-door-arch">
          <path d={ARCH} />
        </clipPath>
        <linearGradient id="iam-door-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="1" stopColor="#ffd98a" />
        </linearGradient>
        <radialGradient id="iam-door-glow" cx="0.5" cy="0.4">
          <stop offset="0" stopColor="#fffbe8" stopOpacity="0.95" />
          <stop offset="1" stopColor={Y} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Muro */}
      <rect width="360" height="300" fill="#e7c193" />
      {Array.from({ length: 9 }, (_, r) =>
        Array.from({ length: 7 }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * 58 - (r % 2 ? 29 : 0) + 3}
            y={r * 32 + 3}
            width="52"
            height="26"
            rx="7"
            fill="#f1d3ad"
            opacity="0.75"
          />
        )),
      )}
      <rect y="270" width="360" height="30" fill="#c58d5e" />

      {/* Lo que hay detrás de la puerta */}
      <g clipPath="url(#iam-door-arch)">
        <rect x="110" y="40" width="140" height="240" fill="url(#iam-door-sky)" />
        <circle cx="200" cy="96" r="16" fill={Y} />
        <path d="M110 180c40-18 90-22 140-6v106H110z" fill={G3} />
        <path d="M110 214c50-14 90-12 140 4v62H110z" fill={G2} />
        <path d="M168 270l8-90h8l26 90z" fill={SAND} />
        {([[136, 236], [226, 230], [150, 204], [232, 196]] as const).map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill={P} />
        ))}
        <rect x="110" y="40" width="140" height="240" fill="url(#iam-door-glow)" style={{ opacity: open, transition: "opacity .9s" }} />
      </g>
      <path d="M120 270V110A60 60 0 0 1 240 110V270" fill="none" stroke="#c98f5e" strokeWidth="14" strokeLinejoin="round" />
      <rect x="242" y="163" width="18" height="16" rx="3" fill={INK} />

      {/* Luz que atraviesa la puerta */}
      <path d="M120 270L240 270L360 300L0 300Z" fill={Y} style={{ opacity: open * 0.4, transition: "opacity .9s" }} />

      {/* La puerta, que gira sobre sus bisagras */}
      <g className="iam-move" style={doorStyle}>
        <g
          {...(unlocked && !complete
            ? { ...bind("door"), ...pressable("Puerta: arrástrala o tócala para abrirla", openDoor) }
            : {})}
          className={unlocked && !complete ? "iam-focus cursor-grab touch-none" : undefined}
        >
          <path d={DOOR} fill={WOOD} />
          {[30, 60, 90].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="200" stroke={WOOD2} strokeWidth="2.5" />
          ))}
          <rect x="4" y="40" width="112" height="12" rx="3" fill={WOOD2} />
          <rect x="4" y="150" width="112" height="12" rx="3" fill={WOOD2} />
          <rect x="114" y="0" width="8" height="200" fill={WOOD2} opacity="0.8" />
          {[52, 158].map((y) => (
            <g key={y}>
              <rect x="-4" y={y} width="32" height="9" rx="3" fill={INK} />
              <circle cx="8" cy={y + 4.5} r="1.8" fill={STONE2} />
              <circle cx="20" cy={y + 4.5} r="1.8" fill={STONE2} />
            </g>
          ))}
          <circle cx="98" cy="130" r="8" fill="none" stroke={Y} strokeWidth="3" />
          <path d={DOOR} fill="#000" style={{ opacity: open * 0.25 }} />

          {/* Cerrojo */}
          <rect x="62" y="96" width="8" height="18" rx="2" fill={INK} />
          <rect x="104" y="96" width="8" height="18" rx="2" fill={INK} />
          <g
            className="iam-move"
            style={{
              transform: `translateX(${f(26 * bolt)}px)`,
              transition: drag === "bolt" ? "none" : "transform .35s cubic-bezier(.2,.9,.3,1.1)",
            }}
          >
            <rect x="48" y="101" width="58" height="8" rx="4" fill={STONE2} stroke={INK} strokeWidth="1.5" />
            <g
              {...(unlocked ? {} : { ...bind("bolt"), ...pressable("Cerrojo: deslízalo o tócalo para abrirlo", unlock) })}
              className={unlocked ? undefined : "iam-focus cursor-grab touch-none"}
            >
              <circle cx="56" cy="105" r="18" fill="transparent" />
              <circle cx="56" cy="105" r="9" fill={Y} stroke={INK} strokeWidth="2" className={unlocked ? undefined : "iam-pulse"} />
            </g>
          </g>
        </g>
      </g>
      {complete && <rect className="iam-flash" width="360" height="300" fill="url(#iam-door-glow)" />}
    </Stage>
  );
}

/* ───────────── 4. El buen pastor: guiar a la oveja de vuelta al rebaño ───────────── */

const SHEEP_WAY: Pt[] = [
  { x: 54, y: 260 }, { x: 102, y: 252 }, { x: 150, y: 238 }, { x: 178, y: 214 }, { x: 162, y: 188 },
  { x: 142, y: 166 }, { x: 160, y: 142 }, { x: 200, y: 128 }, { x: 234, y: 116 },
];
const SHEEP_PATH = densify(SHEEP_WAY, 6);
const SHEEP_LAST = SHEEP_PATH.length - 1;
const FLOCK: Pt[] = [
  { x: 270, y: 82 }, { x: 300, y: 72 }, { x: 314, y: 98 }, { x: 284, y: 104 },
];
const MEET: Pt = { x: 246, y: 110 };

function Sheep({ flip = false, walking = false, s = 1 }: { flip?: boolean; walking?: boolean; s?: number }) {
  return (
    <g transform={`scale(${flip ? -s : s} ${s})`}>
      <g className={walking ? "iam-walk" : undefined}>
        {[-10, -3, 5, 11].map((x) => (
          <rect key={x} x={x} y="4" width="3.5" height="11" rx="1.75" fill={INK} />
        ))}
        {([[-8, 0, 9], [0, -5, 10], [8, -1, 9], [1, 4, 9], [-4, -7, 7]] as const).map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#fff" stroke="#e3d9cc" strokeWidth="1.5" />
        ))}
        <ellipse cx="16" cy="-5" rx="6" ry="7.5" fill={INK} />
        <ellipse cx="12" cy="-10" rx="4" ry="2" fill={INK} transform="rotate(-25 12 -10)" />
        <circle cx="18" cy="-6" r="1.2" fill="#fff" />
      </g>
    </g>
  );
}

export function ShepherdScene({ onDone }: SceneProps) {
  const svg = useRef<SVGSVGElement>(null);
  const [idx, setIdx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [complete, finish] = useFinish(onDone, 2200);

  function moveTo(k: number) {
    const next = clamp(k, 0, SHEEP_LAST);
    setIdx(next);
    if (next >= SHEEP_LAST - 1) {
      setIdx(SHEEP_LAST);
      finish();
    }
  }
  const bind = useSvgDrag<"sheep">(svg, {
    onMove: (_, p) => {
      if (complete) return;
      setDragging(true);
      // La oveja solo se mueve sobre el sendero; si el dedo se aleja, se detiene.
      let best = -1;
      let bestD = 38;
      for (let k = Math.max(0, idx - 12); k <= Math.min(SHEEP_LAST, idx + 12); k++) {
        const d = dist(SHEEP_PATH[k]!, p);
        if (d < bestD) {
          bestD = d;
          best = k;
        }
      }
      if (best >= 0 && best !== idx) moveTo(best);
    },
    onEnd: (_, __, moved) => {
      setDragging(false);
      if (!complete && !moved) moveTo(idx + 8);
    },
  });

  const pos = SHEEP_PATH[idx]!;
  const ahead = SHEEP_PATH[Math.min(idx + 3, SHEEP_LAST)]!;
  const flip = ahead.x < pos.x - 0.5;

  return (
    <Stage
      svgRef={svg}
      label="Un rebaño en un redil y una oveja separada del grupo"
      hint={complete ? undefined : idx === 0 ? "Arrastra la oveja por el sendero, o tócala para avanzar." : undefined}
    >
      <defs>
        <linearGradient id="iam-sheep-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe3b0" />
          <stop offset="1" stopColor={CR} />
        </linearGradient>
        <radialGradient id="iam-sheep-warm" cx="0.75" cy="0.3">
          <stop offset="0" stopColor={Y} stopOpacity="0.6" />
          <stop offset="1" stopColor={Y} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="360" height="300" fill="url(#iam-sheep-sky)" />
      <circle cx="70" cy="44" r="20" fill={Y} />
      <path d="M0 110c50-34 110-40 170-20s120 10 190-30v240H0z" fill={G3} />
      <path d="M0 170c60-30 130-28 190-8s110 6 170-20v158H0z" fill={G2} opacity="0.9" />
      <path d="M0 230c70-20 140-16 210 0s100 4 150-10v80H0z" fill="#5cb87a" />
      <polyline points={polyline(SHEEP_WAY)} fill="none" stroke={SAND} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      {([[30, 200], [120, 120], [330, 220], [240, 260], [90, 290]] as const).map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="11" fill={G} />
          <circle cx={x + 10} cy={y + 2} r="8" fill={G} />
        </g>
      ))}

      {/* El redil */}
      <ellipse cx="290" cy="90" rx="64" ry="40" fill="#86cd98" />
      {complete && (
        <g className="iam-fade" fill="#3a2a7a">
          <circle cx="204" cy="58" r="10" />
          <path d="M190 142c0-38 4-70 14-84 10 14 16 46 16 84z" />
          <path d="M226 142V52a10 10 0 0 0-20 0" fill="none" stroke="#3a2a7a" strokeWidth="5" strokeLinecap="round" />
        </g>
      )}
      {FLOCK.map((p, i) => {
        const q = complete ? { x: p.x + (MEET.x - p.x) * 0.45, y: p.y + (MEET.y - p.y) * 0.45 } : p;
        return (
          <g key={i} className="iam-move" style={placeAt(q, false, 0, 1, 1100)}>
            <Sheep flip={!complete && i % 2 === 1} walking={complete} s={0.9} />
          </g>
        );
      })}
      <ellipse cx="290" cy="90" rx="64" ry="40" fill="none" stroke="#d9cbb8" strokeWidth="9" strokeDasharray="300 34" strokeDashoffset="170" />

      {/* La oveja perdida */}
      <g className="iam-move" style={placeAt(pos, dragging, 0, 1, 600)}>
        <g
          {...(complete ? {} : { ...bind("sheep"), ...pressable("Oveja: tócala para avanzar por el sendero", () => moveTo(idx + 8)) })}
          className={complete ? undefined : "iam-focus cursor-grab touch-none"}
        >
          <circle r="28" fill="transparent" />
          <Sheep flip={flip} walking={dragging} />
        </g>
      </g>
      {complete && <rect className="iam-flash" width="360" height="300" fill="url(#iam-sheep-warm)" />}
    </Stage>
  );
}
