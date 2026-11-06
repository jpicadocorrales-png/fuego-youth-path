import {
  Award,
  Bird,
  BookOpenCheck,
  CalendarCheck,
  Crown,
  Flame,
  Gem,
  Sprout,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";

// Colores de la paleta de Fuego+: fondo del recuadro del ícono y color de la fecha.
const COLORS = {
  green: { solid: "bg-green", fg: "text-green" },
  coral: { solid: "bg-orange", fg: "text-orange" },
  violet: { solid: "bg-primary", fg: "text-primary" },
  yellow: { solid: "bg-yellow", fg: "text-[#a8740f]" },
  pink: { solid: "bg-pink", fg: "text-[#d13f95]" },
} as const;
type Color = keyof typeof COLORS;

// Cada insignia tiene su ícono y un color fijo, en un orden fijo. El orden y los colores
// están pensados para que dos insignias vecinas nunca compartan color, tanto en la
// cuadrícula de 3 columnas como en la de 2.
const BADGES: { code: string; icon: LucideIcon; color: Color }[] = [
  { code: "first", icon: Sprout, color: "green" },
  { code: "five", icon: BookOpenCheck, color: "pink" },
  { code: "ten", icon: Bird, color: "violet" },
  { code: "xp100", icon: Zap, color: "yellow" },
  { code: "xp300", icon: Flame, color: "coral" },
  { code: "streak3", icon: CalendarCheck, color: "green" },
  { code: "streak7", icon: Crown, color: "violet" },
  { code: "course1", icon: Trophy, color: "yellow" },
  { code: "perfect", icon: Gem, color: "pink" },
];

// Para insignias nuevas que no estén en la lista: se reparten los colores por posición.
const CYCLE: Color[] = ["green", "coral", "violet", "yellow", "pink"];

export type BadgeLook = { icon: LucideIcon; solid: string; fg: string };

export function badgeLook(badge: { code: string }, position: number): BadgeLook {
  const known = BADGES.find((b) => b.code === badge.code);
  const color = known?.color ?? CYCLE[position % CYCLE.length]!;
  return { icon: known?.icon ?? Award, ...COLORS[color] };
}

// Orden de presentación: primero las conocidas en su orden, luego las nuevas.
export function sortBadges<T extends { code: string }>(badges: T[]): T[] {
  const rank = (code: string) => {
    const i = BADGES.findIndex((b) => b.code === code);
    return i === -1 ? BADGES.length : i;
  };
  return [...badges].sort((a, b) => rank(a.code) - rank(b.code));
}
