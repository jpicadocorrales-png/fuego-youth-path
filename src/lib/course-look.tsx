import type { ComponentType } from "react";
import { BookOpen, Church, Globe, Grape, Shield } from "lucide-react";
import { courseColor } from "@/lib/app-data";

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

// Ícono y color de cada curso según su nombre, para que cada uno sea reconocible
// y no se repitan colores. Los cursos nuevos usan el color guardado y un libro.
export type CourseLook = { icon: ComponentType<IconProps>; bg: string; text: string };

const LOOKS: [RegExp, CourseLook][] = [
  [/fundamentos/i, { icon: Church, bg: "bg-orange", text: "text-primary-foreground" }],
  [/creaci|g[eé]nesis/i, { icon: Globe, bg: "bg-green", text: "text-primary-foreground" }],
  [/jes[uú]s/i, { icon: LatinCross, bg: "bg-sky", text: "text-primary-foreground" }],
  [/h[eé]roes/i, { icon: Shield, bg: "bg-yellow", text: "text-foreground" }],
  [/fruto/i, { icon: Grape, bg: "bg-pink", text: "text-foreground" }],
];

export function courseLook(course: { title: string; color: string }): CourseLook {
  const found = LOOKS.find(([re]) => re.test(course.title));
  if (found) return found[1];
  return {
    icon: BookOpen,
    bg: courseColor[course.color] ?? "bg-primary",
    text: course.color === "yellow" || course.color === "pink" ? "text-foreground" : "text-primary-foreground",
  };
}
