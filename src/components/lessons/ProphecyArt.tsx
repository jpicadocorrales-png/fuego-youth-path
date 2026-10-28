// Ilustraciones vectoriales de «El rollo de las profecías».
// Las clases pr-* animan partes de las escenas (definidas en styles.css, solo con movimiento permitido).
import type { ReactNode } from "react";
import type { SymbolId } from "./jesusContent";

const V = "#5c30ff";
const V2 = "#8a6bff";
const NIGHT = "#2a1872";
const C = "#e63c23";
const P = "#f971c3";
const Y = "#f6bc3f";
const G = "#008c47";
const CR = "#ffe8ce";
const INK = "#3b2a4a";
const STONE = "#b9adc9";
const STONE2 = "#9a8db0";
const WOOD = "#b8652f";
const SKIN = "#e9b48c";
const SILVER = "#d5d3e2";

// La Virgen arrodillada con el niño envuelto en brazos (dibujada en un área de 200×200).
// Se usa reducida en el símbolo y a tamaño completo en la escena de cumplimiento.
const MANTLE = "#a896ff";
const MANTLE_SHADE = "#9580ff";
const VEIL_SHADE = "#e6dccd";
const FACE = "#f2b896";
const HAIR = "#8a4a22";
const KNEES = "#f08a6a";

function VirginWithChild() {
  return (
    <>
      <path d="M84 40a24 24 0 0 1 44-8" fill="none" stroke={Y} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M88 22l-4-5M98 16l-1-6M110 15l1-6M121 19l4-5M130 27l5-3" stroke={Y} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M58 160c12-7 34-9 54-7 18 1 34 3 40 9 4 5 1 12-7 14-30 5-64 5-84 1-9-2-10-11-3-17z" fill={KNEES} />
      <path d="M92 72c16-5 32-1 42 10 10 12 13 32 15 52 1 10 2 20 1 28-30-4-62-4-92 0-2-22 2-44 11-60 6-12 13-24 23-30z" fill={MANTLE} />
      <path d="M74 118c-2 14-3 28-2 42M140 100c4 16 6 34 6 54" fill="none" stroke={V2} strokeWidth="1.6" strokeLinecap="round" />
      {/* Velo */}
      <path d="M102 22c-14 0-24 10-26 26-2 16-6 32-14 50 12 8 28 10 40 6 0-12 2-24 6-32 12 0 22-8 24-22 3-18-8-28-30-28z" fill="#fff6ea" />
      <path d="M76 52c-2 14-6 30-12 44 6 4 14 6 22 6" fill="none" stroke={VEIL_SHADE} strokeWidth="2" strokeLinecap="round" />
      {/* Rostro inclinado hacia el niño */}
      <ellipse cx="111" cy="55" rx="12.5" ry="15.5" fill={FACE} transform="rotate(-14 111 55)" />
      <path d="M97 52c-1-11 7-18 16-17 8 1 13 8 12 15-4-5-9-7-14-6-5 1-9 4-14 8z" fill={HAIR} />
      <path d="M103 57q2.5 2 5 0M113.5 55q2.5 2 5 0" fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="103" cy="62" r="2.6" fill={P} opacity="0.45" />
      <circle cx="119" cy="60" r="2.6" fill={P} opacity="0.45" />
      <path d="M109 65q3 2 6-.5" fill="none" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
      {/* El niño envuelto */}
      <path d="M104 98a16 16 0 0 1 28-2" fill="none" stroke={Y} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="106" cy="120" rx="17" ry="27" fill="#fff" stroke={VEIL_SHADE} strokeWidth="1.6" transform="rotate(-38 106 120)" />
      <path d="M92 118c8 4 18 2 24-6M94 130c8 3 16 1 22-6M100 140c6 1 12-1 16-6" fill="none" stroke={VEIL_SHADE} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="118" cy="103" r="9.5" fill={FACE} />
      <path d="M112 98c2-6 10-8 15-3 1 3 0 6-2 8-1-4-5-6-13-5z" fill={HAIR} />
      <path d="M113.5 104q2 1.5 4 0" fill="none" stroke={INK} strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="113" cy="107" r="2" fill={P} opacity="0.45" />
      {/* Brazos y manos que lo sostienen */}
      <path d="M68 112c8 8 14 12 22 14" fill="none" stroke={MANTLE_SHADE} strokeWidth="11" strokeLinecap="round" />
      <path d="M146 118c-10 6-18 9-27 10" fill="none" stroke={MANTLE_SHADE} strokeWidth="11" strokeLinecap="round" />
      <ellipse cx="94" cy="127" rx="8" ry="4.2" fill={FACE} transform="rotate(-12 94 127)" />
      <ellipse cx="117" cy="129" rx="8" ry="4.2" fill={FACE} transform="rotate(12 117 129)" />
    </>
  );
}

function Sparkle({ x, y, r }: { x: number; y: number; r: number }) {
  const s = r / 5;
  return <path d={`M${x} ${y - r}L${x + s} ${y - s}L${x + r} ${y}L${x + s} ${y + s}L${x} ${y + r}L${x - s} ${y + s}L${x - r} ${y}L${x - s} ${y - s}Z`} fill={Y} />;
}

const symbols: Record<SymbolId, ReactNode> = {
  "city-star": (
    <>
      <path d="M32 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L32 17.3l-5.6 2.9 1.1-6.2L23 9.6l6.2-.9z" fill={Y} />
      <rect x="9" y="35" width="15" height="21" rx="2" fill={V} />
      <rect x="23" y="29" width="18" height="27" rx="2" fill={V2} />
      <path d="M21 31l11-9 11 9z" fill={C} />
      <rect x="40" y="38" width="15" height="18" rx="2" fill={V} />
      <rect x="13" y="40" width="4" height="5" rx="1" fill={Y} />
      <rect x="29" y="36" width="6" height="7" rx="1" fill={Y} />
      <rect x="44" y="43" width="4" height="5" rx="1" fill={Y} />
      <rect x="29" y="47" width="6" height="9" rx="3" fill={INK} />
      <rect x="6" y="55" width="52" height="4" rx="2" fill={G} />
    </>
  ),
  "crown-throne": (
    <>
      <path d="M22 13l4 5 6-8 6 8 4-5-2 12H24z" fill={Y} />
      <rect x="18" y="26" width="28" height="22" rx="4" fill={C} />
      <rect x="22" y="30" width="20" height="10" rx="3" fill={P} />
      <rect x="14" y="40" width="36" height="8" rx="3" fill={V} />
      <rect x="17" y="48" width="5" height="11" rx="2" fill={V} />
      <rect x="42" y="48" width="5" height="11" rx="2" fill={V} />
    </>
  ),
  boat: (
    <>
      <rect x="31" y="10" width="3" height="32" rx="1.5" fill={WOOD} />
      <path d="M34 12l14 26H34z" fill={CR} stroke={STONE} strokeWidth="1.5" />
      <path d="M31 16L19 38h12z" fill={P} />
      <path d="M10 42h44l-7 10H17z" fill={C} />
      <path d="M4 56c5-4 9-4 14 0s9 4 14 0 9-4 14 0 9 4 14 0" fill="none" stroke={V} strokeWidth="3.5" strokeLinecap="round" />
    </>
  ),
  "mother-baby": (
    <g transform="translate(-7 -2) scale(0.37)">
      <VirginWithChild />
    </g>
  ),
  "man-sword": (
    <>
      <circle cx="24" cy="15" r="7" fill={SKIN} />
      <path d="M13 58c0-20 4-34 11-34s11 14 11 34z" fill={C} />
      <rect x="14" y="36" width="20" height="4" rx="2" fill={INK} />
      <path d="M33 33l14-14" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M45 21l12-12" stroke={SILVER} strokeWidth="5" strokeLinecap="round" />
      <path d="M40 18l9 9" stroke={Y} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  temple: (
    <>
      <path d="M6 22L32 8l26 14z" fill={C} />
      <rect x="8" y="22" width="48" height="5" rx="1.5" fill={Y} />
      {[12, 22, 32, 42].map((x) => (
        <rect key={x} x={x} y="28" width="6" height="22" rx="2" fill={CR} stroke={STONE} strokeWidth="1.2" />
      ))}
      <rect x="6" y="50" width="52" height="5" rx="1.5" fill={V} />
      <rect x="3" y="55" width="58" height="4" rx="2" fill={V2} />
    </>
  ),
  horse: (
    <>
      <path d="M12 30c0-6 6-9 14-9h12l6-9 10 4-2 8-6 2v12c0 4-3 7-7 7H20c-5 0-8-4-8-9z" fill={WOOD} />
      <path d="M42 12l-6 10" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M12 30c-4 2-6 8-5 12" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {[16, 23, 33, 40].map((x) => (
        <rect key={x} x={x} y="42" width="4.5" height="16" rx="2" fill={WOOD} />
      ))}
      <circle cx="49" cy="17" r="1.6" fill={INK} />
    </>
  ),
  donkey: (
    <>
      <path d="M44 15l-2-11 5 1 2 10z" fill={STONE2} />
      <path d="M49 16l2-11 4 2-2 10z" fill={STONE2} />
      <path d="M12 32c0-6 6-9 13-9h14l4-8h9l3 9-5 3-3 1v10c0 4-3 6-7 6H20c-5 0-8-3-8-8z" fill={STONE} />
      <ellipse cx="54" cy="25" rx="4" ry="3" fill={CR} />
      {[16, 23, 33, 40].map((x) => (
        <rect key={x} x={x} y="42" width="4.5" height="15" rx="2" fill={STONE2} />
      ))}
      <path d="M12 32c-3 1-5 5-4 9" stroke={STONE2} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="49" cy="20" r="1.6" fill={INK} />
    </>
  ),
  camel: (
    <>
      <path d="M8 34c0-8 6-14 12-14s7 6 10 6 5-10 11-10 9 8 9 14v6H8z" fill={Y} />
      <path d="M46 32c0-10 1-16 4-20h6l2 5-4 2c-1 4-1 9-2 13z" fill={Y} />
      {[13, 20, 36, 43].map((x) => (
        <rect key={x} x={x} y="38" width="4.5" height="20" rx="2" fill="#d99a2b" />
      ))}
      <circle cx="54" cy="15" r="1.6" fill={INK} />
    </>
  ),
  coins: (
    <>
      <path d="M22 18h20l-4 7c10 4 15 13 15 21 0 9-9 12-21 12s-21-3-21-12c0-8 5-17 15-21z" fill={CR} stroke={STONE} strokeWidth="1.5" />
      <path d="M24 25h16" stroke={WOOD} strokeWidth="3" strokeLinecap="round" />
      <text x="32" y="47" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily="Nunito Sans, sans-serif">30</text>
      <ellipse cx="14" cy="55" rx="7" ry="3.5" fill={SILVER} stroke={STONE2} strokeWidth="1.2" />
      <ellipse cx="50" cy="56" rx="7" ry="3.5" fill={SILVER} stroke={STONE2} strokeWidth="1.2" />
      <ellipse cx="52" cy="51" rx="7" ry="3.5" fill={SILVER} stroke={STONE2} strokeWidth="1.2" />
    </>
  ),
  "gold-crown": (
    <>
      <path d="M8 22l12 10 12-18 12 18 12-10-5 28H13z" fill={Y} />
      <rect x="12" y="46" width="40" height="8" rx="3" fill="#d99a2b" />
      <circle cx="32" cy="36" r="4" fill={C} />
      <circle cx="20" cy="40" r="3" fill={V} />
      <circle cx="44" cy="40" r="3" fill={V} />
      <circle cx="8" cy="22" r="3" fill={Y} />
      <circle cx="32" cy="14" r="3" fill={Y} />
      <circle cx="56" cy="22" r="3" fill={Y} />
    </>
  ),
  chest: (
    <>
      <circle cx="22" cy="21" r="5" fill={P} />
      <path d="M32 12l6 6-6 8-6-8z" fill={V2} />
      <circle cx="43" cy="21" r="5" fill={G} />
      <path d="M8 30c0-6 4-9 10-9h28c6 0 10 3 10 9v4H8z" fill={WOOD} />
      <rect x="8" y="34" width="48" height="22" rx="3" fill={C} />
      <rect x="8" y="33" width="48" height="4" fill={Y} />
      <rect x="28" y="36" width="8" height="10" rx="2" fill={Y} />
    </>
  ),
  cross: (
    <>
      <rect x="27" y="5" width="10" height="52" rx="2.5" fill={WOOD} />
      <rect x="12" y="17" width="40" height="9" rx="2.5" fill={WOOD} />
      <path d="M8 59c6-6 14-8 24-8s18 2 24 8z" fill={V} />
    </>
  ),
  throne: (
    <>
      <path d="M18 6h28v28H18z" fill={V} />
      <path d="M18 6l5 6 4-6 5 6 5-6 4 6 5-6" fill="none" stroke={Y} strokeWidth="3" strokeLinejoin="round" />
      <rect x="22" y="14" width="20" height="18" rx="3" fill={P} />
      <rect x="12" y="32" width="40" height="10" rx="3" fill={C} />
      <rect x="15" y="42" width="6" height="16" rx="2" fill={V} />
      <rect x="43" y="42" width="6" height="16" rx="2" fill={V} />
    </>
  ),
  sword: (
    <>
      <path d="M32 3l5 7v32h-10V10z" fill={SILVER} stroke={STONE2} strokeWidth="1.2" />
      <rect x="18" y="42" width="28" height="6" rx="3" fill={Y} />
      <rect x="29" y="48" width="6" height="10" rx="2" fill={WOOD} />
      <circle cx="32" cy="60" r="3" fill={Y} />
    </>
  ),
  tunic: (
    <>
      <path d="M22 6h20l18 11-7 10-6-4v35H17V23l-6 4-7-10z" fill={C} />
      <path d="M26 6c1 5 11 5 12 0" fill="none" stroke={CR} strokeWidth="3" strokeLinecap="round" />
      <rect x="17" y="34" width="30" height="5" fill={Y} />
      <path d="M32 12v46" stroke="#c22e19" strokeWidth="1.5" strokeDasharray="3 3" />
    </>
  ),
  scroll: (
    <>
      <rect x="14" y="12" width="36" height="40" rx="2" fill={CR} stroke={STONE} strokeWidth="1.5" />
      <rect x="9" y="8" width="7" height="48" rx="3.5" fill={WOOD} />
      <rect x="48" y="8" width="7" height="48" rx="3.5" fill={WOOD} />
      {[20, 27, 34, 41].map((y) => (
        <rect key={y} x="20" y={y} width={y === 41 ? 14 : 24} height="3" rx="1.5" fill={STONE2} />
      ))}
    </>
  ),
  jar: (
    <>
      <rect x="22" y="5" width="20" height="6" rx="3" fill="#c94f2a" />
      <path d="M25 11h14v5c10 4 15 13 15 22 0 12-9 20-22 20S10 50 10 38c0-9 5-18 15-22z" fill={C} />
      <path d="M12 34h40" stroke={Y} strokeWidth="3" />
      <path d="M14 42h36" stroke={Y} strokeWidth="2" />
      <path d="M10 26c-6 2-6 12 2 12" fill="none" stroke={C} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  "open-tomb": (
    <>
      <path d="M4 58c0-26 12-44 28-44s28 18 28 44z" fill={STONE} />
      <path d="M18 58c0-14 6-22 12-22s12 8 12 22z" fill={Y} />
      <path d="M30 32l-2-10M38 34l6-8M22 34l-6-8" stroke={Y} strokeWidth="3" strokeLinecap="round" />
      <circle cx="52" cy="50" r="10" fill={STONE2} />
    </>
  ),
  "closed-tomb": (
    <>
      <path d="M4 58c0-26 12-44 28-44s28 18 28 44z" fill={STONE} />
      <path d="M18 58c0-14 6-22 12-22s12 8 12 22z" fill={INK} />
      <circle cx="30" cy="46" r="13" fill={STONE2} />
      <circle cx="30" cy="46" r="8" fill="none" stroke={STONE} strokeWidth="2" />
    </>
  ),
  hourglass: (
    <>
      <rect x="14" y="5" width="36" height="6" rx="3" fill={WOOD} />
      <rect x="14" y="53" width="36" height="6" rx="3" fill={WOOD} />
      <path d="M19 11h26c0 10-9 15-9 21s9 11 9 21H19c0-10 9-15 9-21s-9-11-9-21z" fill={CR} stroke={STONE} strokeWidth="1.5" />
      <path d="M24 16h16c-2 6-6 9-8 12-2-3-6-6-8-12z" fill={Y} />
      <path d="M23 51c2-6 6-8 9-8s7 2 9 8z" fill={Y} />
    </>
  ),
};

export function ProphecySymbol({ id, className }: { id: SymbolId; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {symbols[id]}
    </svg>
  );
}

function Rays({ cx, cy, n, r1, r2, color, width = 4 }: { cx: number; cy: number; n: number; r1: number; r2: number; color: string; width?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r1}
            y1={cy + Math.sin(a) * r1}
            x2={cx + Math.cos(a) * r2}
            y2={cy + Math.sin(a) * r2}
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
          />
        );
      })}
    </>
  );
}

// Escenas de cumplimiento, una por profecía (viewBox 320×200).
const scenes: Record<string, ReactNode> = {
  belen: (
    <>
      <defs>
        <linearGradient id="pr-sky1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={NIGHT} />
          <stop offset="1" stopColor={V} />
        </linearGradient>
        <radialGradient id="pr-star1">
          <stop offset="0" stopColor={Y} stopOpacity="0.85" />
          <stop offset="1" stopColor={Y} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill="url(#pr-sky1)" />
      {([[30, 30], [80, 55], [250, 30], [290, 70], [210, 60], [120, 25]] as const).map(([x, y]) => (
        <circle key={`${x}-${y}`} className="pr-twinkle" cx={x} cy={y} r="1.8" fill={CR} />
      ))}
      <circle className="pr-pulse" cx="170" cy="48" r="42" fill="url(#pr-star1)" />
      <path className="pr-twinkle" d="M170 24l5.5 16.5 17.5.5-14 10.5 5 17-14-10-14 10 5-17-14-10.5 17.5-.5z" fill={Y} />
      <path d="M170 70v62" stroke={Y} strokeOpacity="0.35" strokeWidth="10" />
      <path d="M0 150h40v-30h30v-20h30v30h20v-40l14-12 14 12v60h22v-20h40v-30h30v20h30v30h50v50H0z" fill={NIGHT} />
      <path d="M150 150l20-18 20 18v20h-40z" fill={C} />
      <rect x="162" y="154" width="16" height="16" rx="3" fill={Y} />
      {([[52, 132], [84, 116], [128, 122], [214, 156], [258, 140]] as const).map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="7" height="8" rx="1.5" fill={Y} opacity="0.85" />
      ))}
      <rect y="170" width="320" height="30" fill="#1d1050" />
    </>
  ),
  virgen: (
    <>
      <defs>
        <radialGradient id="pr-glow2">
          <stop offset="0" stopColor={Y} stopOpacity="0.9" />
          <stop offset="0.6" stopColor={P} stopOpacity="0.35" />
          <stop offset="1" stopColor={P} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill={CR} />
      <circle className="pr-pulse" cx="160" cy="100" r="96" fill="url(#pr-glow2)" />
      <g className="pr-twinkle"><Sparkle x={66} y={70} r={22} /></g>
      <g className="pr-twinkle"><Sparkle x={254} y={76} r={22} /></g>
      <Sparkle x={92} y={40} r={6} />
      <Sparkle x={280} y={116} r={6} />
      <Sparkle x={228} y={40} r={5} />
      <g transform="translate(56 12)">
        <VirginWithChild />
      </g>
    </>
  ),
  rey: (
    <>
      <defs>
        <linearGradient id="pr-sky3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd98a" />
          <stop offset="1" stopColor={CR} />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#pr-sky3)" />
      <path d="M90 120V70h30V54h80v16h30v50z" fill="#f2c9a0" />
      <path d="M144 120V90a16 16 0 0132 0v30z" fill={WOOD} opacity="0.55" />
      <path d="M0 200l130-80h60l130 80z" fill="#f2d7b3" />
      {([[34, 150, -1], [70, 128, -1], [286, 150, 1], [250, 128, 1]] as const).map(([x, y, s]) => (
        <g key={`${x}-${y}`} className="pr-sway">
          <path d={`M${x} ${y + 40}q${s * 4}-24 0-44`} stroke={G} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d={`M${x} ${y - 4}q-18 -4 -26 10M${x} ${y - 4}q18 -4 26 10M${x} ${y - 4}q-10 -14 -22 -14M${x} ${y - 4}q10 -14 22 -14`} stroke={G} strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      ))}
      <g className="pr-ride">
        <path d="M120 150c0-8 8-12 18-12h30l8-12h14l4 12-8 4-4 2v12c0 6-4 8-10 8h-42c-6 0-10-5-10-14z" fill={STONE} />
        <path d="M182 128l-3-15 6 1 3 14zM189 128l4-14 5 3-4 12z" fill={STONE2} />
        {[126, 136, 158, 168].map((x) => (
          <rect key={x} x={x} y="160" width="6" height="22" rx="3" fill={STONE2} />
        ))}
        <path d="M146 140c-2-20 4-36 14-36s14 16 10 36z" fill="#fff6ea" />
        <path d="M150 128h22" stroke={C} strokeWidth="5" />
        <circle cx="160" cy="96" r="10" fill={SKIN} />
        <path d="M150 96c0-14 20-14 20 0" fill={WOOD} />
      </g>
    </>
  ),
  monedas: (
    <>
      <rect width="320" height="200" fill={CR} />
      <circle cx="175" cy="118" r="86" fill={Y} opacity="0.2" />
      <ellipse cx="170" cy="172" rx="130" ry="12" fill="#f2d7b3" />
      {/* Saco caído de lado, con la boca hacia la derecha */}
      <g transform="translate(110 122) rotate(100) scale(1.2)">
        <path d="M-14 -50h28l-6 12c18 7 30 24 30 40 0 18-17 26-38 26s-38-8-38-26c0-16 12-33 30-40z" fill="#fff6ea" stroke={STONE} strokeWidth="2.5" strokeLinejoin="round" />
        <ellipse cx="0" cy="-50" rx="14" ry="4.5" fill="#e6d6c2" stroke={STONE} strokeWidth="2" />
        <rect x="-12" y="-42" width="24" height="6" rx="3" fill={WOOD} />
      </g>
      {/* Monedas saliendo del saco y amontonándose */}
      {([
        [184, 142, 35, 0.2], [196, 154, 18, 0.35], [184, 166, 0, 0.5],
        [206, 164, 0, 0.6], [230, 164, 0, 0.7], [254, 164, 0, 0.8],
        [218, 157, 0, 0.9], [242, 157, 0, 1], [230, 150, 0, 1.1], [282, 166, 0, 1.25],
      ] as const).map(([x, y, tilt, d]) => (
        <g key={`${x}-${y}`} className="pr-spill" style={{ animationDelay: `${d}s` }}>
          <g transform={`rotate(${tilt} ${x} ${y})`}>
            <ellipse cx={x} cy={y + 3} rx="12" ry="5" fill={STONE2} />
            <ellipse cx={x} cy={y} rx="12" ry="5" fill={SILVER} stroke={STONE2} strokeWidth="1.2" />
            <ellipse cx={x} cy={y} rx="6.5" ry="2.4" fill="none" stroke={STONE2} strokeWidth="1" />
          </g>
        </g>
      ))}
      {([[262, 136], [206, 134], [244, 122]] as const).map(([x, y]) => (
        <path key={x} className="pr-twinkle" d={`M${x} ${y - 7}l2 5 5 2-5 2-2 5-2-5-5-2 5-2z`} fill={Y} />
      ))}
    </>
  ),
  siervo: (
    <>
      <defs>
        <linearGradient id="pr-sky5" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={Y} />
          <stop offset="0.55" stopColor={P} />
          <stop offset="1" stopColor={C} />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#pr-sky5)" />
      <circle className="pr-pulse" cx="160" cy="96" r="60" fill="#fff6ea" opacity="0.45" />
      <path d="M0 200c40-40 90-64 160-64s120 24 160 64z" fill={V} />
      <path d="M0 200c50-26 100-38 160-38s110 12 160 38z" fill={NIGHT} opacity="0.6" />
      <rect x="153" y="40" width="14" height="104" rx="3" fill={INK} />
      <rect x="128" y="62" width="64" height="12" rx="3" fill={INK} />
    </>
  ),
  vestidos: (
    <>
      <rect width="320" height="200" fill={CR} />
      <ellipse cx="160" cy="176" rx="140" ry="16" fill="#f2d7b3" />
      <path d="M118 30h84l46 26-18 26-16-10v100H106V72l-16 10-18-26z" fill={C} />
      <path d="M134 30c4 14 48 14 52 0" fill="none" stroke={CR} strokeWidth="5" strokeLinecap="round" />
      <rect x="106" y="110" width="108" height="10" fill={Y} />
      <path d="M160 40v132" stroke="#c22e19" strokeWidth="2" strokeDasharray="5 5" />
      {([[52, 150, -12], [262, 146, 10], [240, 168, -6]] as const).map(([x, y, r]) => (
        <g key={x} className="pr-toss">
          <g transform={`rotate(${r} ${x} ${y})`}>
            <rect x={x - 11} y={y - 11} width="22" height="22" rx="5" fill="#fff6ea" stroke={STONE} strokeWidth="2" />
            <circle cx={x - 4} cy={y - 4} r="2.4" fill={INK} />
            <circle cx={x + 4} cy={y + 4} r="2.4" fill={INK} />
          </g>
        </g>
      ))}
      <circle cx="70" cy="170" r="6" fill={STONE2} />
      <circle cx="84" cy="176" r="5" fill={STONE} />
    </>
  ),
  resurreccion: (
    <>
      <defs>
        <linearGradient id="pr-sky7" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd98a" />
          <stop offset="1" stopColor={CR} />
        </linearGradient>
        <radialGradient id="pr-light7" cx="0.5" cy="0.7">
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset="0.5" stopColor={Y} />
          <stop offset="1" stopColor={Y} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill="url(#pr-sky7)" />
      <path d="M20 200c0-90 50-150 140-150s140 60 140 150z" fill={STONE} />
      <path d="M48 200c0-60 30-110 72-120" fill="none" stroke={STONE2} strokeWidth="3" opacity="0.6" />
      <g className="pr-rays">
        <Rays cx={150} cy={150} n={14} r1={52} r2={92} color={Y} width={5} />
      </g>
      <path d="M110 200v-56a40 40 0 0180 0v56z" fill="#3b2a4a" />
      <path className="pr-dawn" d="M110 200v-56a40 40 0 0180 0v56z" fill="url(#pr-light7)" />
      <rect x="128" y="176" width="44" height="10" rx="3" fill="#fff6ea" opacity="0.85" />
      <g className="pr-stone">
        <circle cx="240" cy="160" r="40" fill={STONE2} />
        <circle cx="240" cy="160" r="26" fill="none" stroke={STONE} strokeWidth="3" />
      </g>
      <rect y="194" width="320" height="6" fill={STONE2} />
    </>
  ),
};

export function ProphecyScene({ id, className }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      {scenes[id]}
    </svg>
  );
}
