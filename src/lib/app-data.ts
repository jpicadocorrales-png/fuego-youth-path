import { useQuery } from "@tanstack/react-query";
import { BADGES, BUILT_IN_TEXT, COURSES, isCourseAvailable } from "./demo-data";
import { loadState } from "./demo-store";
import { useLang } from "./i18n";

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
// Cada hook devuelve los textos ya traducidos al idioma elegido; el idioma va en
// la queryKey para que se recalcule al cambiarlo.

/** Nombre de ejemplo del visitante. «Visitante» y «Visitor» de versiones anteriores también se cambian por «Charlie». */
export const DEFAULT_NAME = "Charlie";

export function displayName(name: string, _lang?: "es" | "en") {
  return !name || name === "Visitante" || name === "Visitor" ? DEFAULT_NAME : name;
}

export function useMe() {
  const { lang } = useLang();
  return useQuery({
    queryKey: ["me", lang],
    queryFn: () => {
      const profile = loadState().profile;
      return { id: "demo", email: "", profile: { ...profile, display_name: displayName(profile.display_name, lang) }, isAdmin: true };
    },
  });
}

export function useCourses() {
  const { lang } = useLang();
  return useQuery({
    queryKey: ["courses", lang],
    queryFn: () => {
      const doneSet = new Set(loadState().completions.map((d) => d.lesson_id));
      return COURSES.map((c) => {
        const completed = c.lessons.filter((l) => doneSet.has(l.id)).length;
        return {
          ...c,
          title: c.title[lang],
          description: c.description[lang],
          level: c.level[lang],
          available: isCourseAvailable(c.id),
          lessons: c.lessons.map((l) => ({ ...l, title: l.title[lang], course_id: c.id, done: doneSet.has(l.id) })),
          total: c.lessons.length,
          completed,
          pct: c.lessons.length ? Math.round((completed / c.lessons.length) * 100) : 0,
        };
      });
    },
  });
}

/** Sesiones de lección (incluye repasos): alimentan «lecciones» y el gráfico de la semana en Inicio. */
export function useCompletions() {
  return useQuery({ queryKey: ["completions"], queryFn: () => loadState().sessions ?? loadState().completions });
}

export function useBadges() {
  const { lang } = useLang();
  return useQuery({
    queryKey: ["badges", lang],
    queryFn: () => {
      const m = new Map(loadState().badges.map((b) => [b.badge_id, b.earned_at]));
      return BADGES.map((b) => ({ ...b, name: b.name[lang], description: b.description[lang], earnedAt: m.get(b.id) ?? null }));
    },
  });
}

export function useNotifications() {
  const { lang } = useLang();
  return useQuery({
    queryKey: ["notifications", lang],
    queryFn: () =>
      loadState()
        .notifications.slice(0, 20)
        .map((n) => {
          const badge = n.badge_id ? BADGES.find((b) => b.id === n.badge_id) : undefined;
          if (badge) {
            const prefix = lang === "es" ? "Nueva insignia" : "New badge";
            return { ...n, title: `${prefix}: ${badge.name[lang]} ${badge.emoji}`, body: badge.description[lang] };
          }
          const built = BUILT_IN_TEXT[n.id];
          return built ? { ...n, title: built.title[lang], body: built.body[lang] } : n;
        }),
  });
}

export function useAnnouncements() {
  const { lang } = useLang();
  return useQuery({
    queryKey: ["announcements", lang],
    queryFn: () =>
      loadState()
        .announcements.slice(0, 10)
        .map((a) => {
          const built = BUILT_IN_TEXT[a.id];
          return built ? { ...a, title: built.title[lang], body: built.body[lang] } : a;
        }),
  });
}

export function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {
    /* almacenamiento no disponible */
  }
}
