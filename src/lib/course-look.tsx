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

// Fondos con la paleta de Fuego+ (violeta, coral, rosa, amarillo y verde). Todas las
// tarjetas de curso llevan texto negro, que se lee bien sobre los cinco colores.
const BG: Record<string, string> = {
  green: "bg-green",
  sky: "bg-sky",
  orange: "bg-orange",
  pink: "bg-pink",
  yellow: "bg-yellow",
};
const INK = "text-[#1c1626]";

// Ícono y color de cada curso según su nombre, para que cada uno sea reconocible
// y no se repitan colores. Los cursos nuevos usan el color guardado y un libro.
export type CourseLook = { icon: ComponentType<IconProps>; bg: string; text: string };

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
  return { icon: found?.icon ?? BookOpen, bg: BG[color] ?? "bg-primary", text: INK };
}
