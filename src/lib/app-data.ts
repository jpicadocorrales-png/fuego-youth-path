import { useQuery } from "@tanstack/react-query";
import { BADGES, COURSES, isCourseAvailable } from "./demo-data";
import { loadState } from "./demo-store";

export const courseColor: Record<string, string> = {
  green: "bg-green",
  sky: "bg-sky",
  orange: "bg-orange",
  pink: "bg-pink",
  yellow: "bg-yellow",
};
export const courseText: Record<string, string> = {
  green: "text-green",
  sky: "text-sky",
  orange: "text-orange",
  pink: "text-pink",
  yellow: "text-yellow",
};

// Versión demo: no hay cuentas. Todos los visitantes ven la app como
// administradores y su progreso se guarda en el navegador (demo-store.ts).
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => ({ id: "demo", email: "", profile: loadState().profile, isAdmin: true }),
  });
}

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => {
      const doneSet = new Set(loadState().completions.map((d) => d.lesson_id));
      return COURSES.map((c) => {
        const completed = c.lessons.filter((l) => doneSet.has(l.id)).length;
        return {
          ...c,
          available: isCourseAvailable(c.id),
          lessons: c.lessons.map((l) => ({ ...l, course_id: c.id, done: doneSet.has(l.id) })),
          total: c.lessons.length,
          completed,
          pct: c.lessons.length ? Math.round((completed / c.lessons.length) * 100) : 0,
        };
      });
    },
  });
}

export function useCompletions() {
  return useQuery({ queryKey: ["completions"], queryFn: () => loadState().completions });
}

export function useBadges() {
  return useQuery({
    queryKey: ["badges"],
    queryFn: () => {
      const m = new Map(loadState().badges.map((b) => [b.badge_id, b.earned_at]));
      return BADGES.map((b) => ({ ...b, earnedAt: m.get(b.id) ?? null }));
    },
  });
}

export function useNotifications() {
  return useQuery({ queryKey: ["notifications"], queryFn: () => loadState().notifications.slice(0, 20) });
}

export function useAnnouncements() {
  return useQuery({ queryKey: ["announcements"], queryFn: () => loadState().announcements.slice(0, 10) });
}

export function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {
    /* almacenamiento no disponible */
  }
}
