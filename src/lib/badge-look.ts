import {
  Award,
  Bird,
  BookOpen,
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

// Ícono de línea para cada insignia (mismo estilo que los íconos de estadísticas) y un color
// de la paleta según el tipo de meta, igual que en las tarjetas del inicio:
// lecciones = coral, XP = amarillo, racha = violeta, cursos = verde, perfecto = rosa.
const ICON_BY_CODE: Record<string, LucideIcon> = {
  first: Sprout,
  five: BookOpenCheck,
  ten: Bird,
  xp100: Zap,
  xp300: Flame,
  streak3: CalendarCheck,
  streak7: Crown,
  course1: Trophy,
  perfect: Gem,
};

const BY_KIND: Record<string, { icon: LucideIcon; solid: string; fg: string }> = {
  lessons: { icon: BookOpen, solid: "bg-orange text-white", fg: "text-orange" },
  xp: { icon: Zap, solid: "bg-yellow text-foreground", fg: "text-foreground" },
  streak: { icon: Flame, solid: "bg-primary text-primary-foreground", fg: "text-primary" },
  courses: { icon: Trophy, solid: "bg-green text-white", fg: "text-green" },
  perfect: { icon: Gem, solid: "bg-pink text-white", fg: "text-pink" },
};

export type BadgeLook = { icon: LucideIcon; solid: string; fg: string };

export function badgeLook(badge: { code: string; kind: string }): BadgeLook {
  const kind = BY_KIND[badge.kind] ?? { icon: Award, solid: "bg-primary text-primary-foreground", fg: "text-primary" };
  return { ...kind, icon: ICON_BY_CODE[badge.code] ?? kind.icon };
}
