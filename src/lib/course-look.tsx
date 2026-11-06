import type { ComponentType } from "react";
import { BookOpen, Church, Globe, Grape, Shield } from "lucide-react";

type IconProps = { className?: string; strokeWidth?: number };

// Cruz latina con el mismo trazo que los íconos de lucide (su «Cross» es una cruz griega).
function LatinCross({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 2h4v5h5v4h-5v11h-4V11H5V7h5z" />
    </svg>
  );
}

// Clases de la paleta de Fuego+ para cada color de curso: fondo completo (`bg`),
// ícono o texto de ese color (`fg`), un fondo suave para el recuadro del ícono (`tint`)
// y el color en hexadecimal (`hex`) para los gráficos.
const PALETTE: Record<string, { bg: string; fg: string; tint: string; hex: string }> = {
  green: { bg: "bg-green", fg: "text-green", tint: "bg-green/15", hex: "#008c47" },
  sky: { bg: "bg-sky", fg: "text-sky", tint: "bg-sky/15", hex: "#5c30ff" },
  orange: { bg: "bg-orange", fg: "text-orange", tint: "bg-orange/15", hex: "#e63c23" },
  pink: { bg: "bg-pink", fg: "text-pink", tint: "bg-pink/20", hex: "#f971c3" },
  yellow: { bg: "bg-yellow", fg: "text-yellow", tint: "bg-yellow/25", hex: "#f6bc3f" },
};

// Ícono y color de cada curso según su nombre, para que cada uno sea reconocible
// y no se repitan colores. Los cursos nuevos usan el color guardado y un libro.
export type CourseLook = { icon: ComponentType<IconProps>; bg: string; fg: string; tint: string; hex: string };

const LOOKS: [RegExp, { icon: ComponentType<IconProps>; color: string }][] = [
  [/fundamentos/i, { icon: Church, color: "orange" }],
  [/creaci|g[eé]nesis/i, { icon: Globe, color: "green" }],
  [/jes[uú]s/i, { icon: LatinCross, color: "sky" }],
  [/h[eé]roes/i, { icon: Shield, color: "yellow" }],
  [/fruto/i, { icon: Grape, color: "pink" }],
];

export function courseLook(course: { title: string; color: string }): CourseLook {
  const found = LOOKS.find(([re]) => re.test(course.title))?.[1];
  const color = found?.color ?? course.color;
  const p = PALETTE[color] ?? { bg: "bg-primary", fg: "text-primary", tint: "bg-primary/15", hex: "#5c30ff" };
  return { icon: found?.icon ?? BookOpen, ...p };
}
