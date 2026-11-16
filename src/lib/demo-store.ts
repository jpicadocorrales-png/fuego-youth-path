// Progreso del visitante guardado en localStorage (versión demo, sin cuentas).
import { BADGES, COURSES, INITIAL_ANNOUNCEMENTS } from "./demo-data";

// v2: la demo arranca con progreso de ejemplo (ver initial()).
const KEY = "fuego-demo-v2";

export type Profile = {
  display_name: string;
  avatar_emoji: string;
  daily_goal: number;
  sound_enabled: boolean;
  email_notifications: boolean;
  xp: number;
  streak: number;
  last_activity_date: string | null;
};
export type Completion = { lesson_id: string; course_id: string; completed_at: string; score: number };
/** Cada vez que se termina una lección, también si se repite: alimenta «lecciones» y el gráfico de la semana. */
export type Session = { lesson_id: string; completed_at: string };
// Las notificaciones de insignias guardan `badge_id` para mostrarse en el idioma elegido.
export type Notification = { id: string; title: string; body: string; read: boolean; created_at: string; badge_id?: string };
export type Announcement = { id: string; title: string; body: string; created_at: string };

export type DemoState = {
  profile: Profile;
  completions: Completion[];
  sessions: Session[];
  badges: { badge_id: string; earned_at: string }[];
  notifications: Notification[];
  announcements: Announcement[];
};

// Lecciones hechas cada día de la última semana, del más antiguo (hace 6 días) a hoy.
// Los últimos 5 días tienen actividad: por eso la racha es de 5.
const WEEK = [1, 0, 2, 1, 2, 1, 2];

/**
 * Estado inicial de la demo: un visitante que ya avanzó un poco, para que el
 * portafolio no se vea vacío. Las fechas se calculan desde hoy, así el gráfico
 * de la semana y la racha siempre se ven al día.
 */
function initial(): DemoState {
  const now = new Date();
  const at = (daysAgo: number, hour: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, 15 * daysAgo, 0, 0);
    // Hoy, nunca en el futuro.
    return (daysAgo === 0 && d > now ? now : d).toISOString();
  };

  // Religiones (hace 6 días) y Jesús (hace 2 días) completadas; «Dios» queda desbloqueada.
  const completions: Completion[] = [
    { lesson_id: "fundamentos-1", course_id: "fundamentos", completed_at: at(6, 18), score: 100 },
    { lesson_id: "fundamentos-2", course_id: "fundamentos", completed_at: at(2, 19), score: 100 },
  ];
  // El resto de la semana son repasos de esas dos lecciones.
  const sessions: Session[] = WEEK.flatMap((count, i) => {
    const daysAgo = WEEK.length - 1 - i;
    return Array.from({ length: count }, (_, k) => ({
      lesson_id: k % 2 === 0 ? "fundamentos-1" : "fundamentos-2",
      completed_at: at(daysAgo, 17 + k),
    }));
  });

  const earned = (id: string, daysAgo: number) => ({ badge_id: id, earned_at: at(daysAgo, 19) });
  const badges = [earned("first", 6), earned("perfect", 6), earned("streak3", 2), earned("five", 1), earned("xp100", 0)];
  const badgeNote = (id: string, daysAgo: number, read: boolean): Notification => ({
    id: `badge-${id}`, title: "", body: "", read, created_at: at(daysAgo, 19), badge_id: id,
  });

  return {
    profile: {
      display_name: "", // vacío = nombre de ejemplo «Charlie» (ver displayName en app-data.ts)
      avatar_emoji: "🦁",
      daily_goal: 1,
      sound_enabled: true,
      email_notifications: true,
      xp: 120,
      streak: 5,
      last_activity_date: dayKey(now),
    },
    completions,
    sessions,
    badges,
    notifications: [
      badgeNote("xp100", 0, false),
      badgeNote("five", 1, false),
      badgeNote("streak3", 2, true),
      badgeNote("perfect", 6, true),
      badgeNote("first", 6, true),
      { id: "welcome", title: "¡Bienvenido! 🎉", body: "Empieza tu primer curso y gana tu primera insignia.", read: true, created_at: at(6, 17) },
    ],
    announcements: [...INITIAL_ANNOUNCEMENTS],
  };
}

let memory: DemoState | null = null;

export function loadState(): DemoState {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) memory = { ...initial(), ...(JSON.parse(raw) as Partial<DemoState>) };
  } catch {
    /* almacenamiento no disponible */
  }
  memory ??= initial();
  return memory;
}

export function saveState(next: DemoState) {
  memory = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* almacenamiento no disponible: el progreso dura solo esta visita */
  }
}

export function updateState(fn: (s: DemoState) => DemoState) {
  saveState(fn(loadState()));
}

export function resetState() {
  saveState(initial());
}

const uid = () => Math.random().toString(36).slice(2);
// Fecha local (AAAA-MM-DD) para que la racha cuente los días del visitante, no los de UTC.
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Registra una lección completada: XP, racha, insignias y notificaciones. */
export function completeLesson(lessonId: string, courseId: string, score: number) {
  updateState((s) => {
    const now = new Date();
    const sessions = [...(s.sessions ?? []), { lesson_id: lessonId, completed_at: now.toISOString() }];
    // Repetir una lección cuenta para la semana, pero no suma XP ni insignias otra vez.
    if (s.completions.some((c) => c.lesson_id === lessonId)) return { ...s, sessions };
    const course = COURSES.find((c) => c.id === courseId);
    const xp = course?.lessons.find((l) => l.id === lessonId)?.xp ?? 10;
    const today = dayKey(now);
    const yesterday = dayKey(new Date(now.getTime() - 864e5));
    const p = s.profile;
    const streak = p.last_activity_date === today ? p.streak : p.last_activity_date === yesterday ? p.streak + 1 : 1;
    const profile = { ...p, xp: p.xp + xp, streak, last_activity_date: today };
    const completions = [...s.completions, { lesson_id: lessonId, course_id: courseId, completed_at: now.toISOString(), score }];

    const doneIds = new Set(completions.map((c) => c.lesson_id));
    const coursesDone = COURSES.filter((c) => c.lessons.length && c.lessons.every((l) => doneIds.has(l.id))).length;
    const badges = [...s.badges];
    const notifications = [...s.notifications];
    for (const b of BADGES) {
      if (badges.some((x) => x.badge_id === b.id)) continue;
      const metric = { lessons: completions.length, xp: profile.xp, streak: profile.streak, courses: coursesDone, perfect: score >= 100 ? 1 : 0 }[b.kind];
      if (metric >= b.threshold) {
        badges.push({ badge_id: b.id, earned_at: now.toISOString() });
        notifications.unshift({ id: uid(), title: `Nueva insignia: ${b.name.es} ${b.emoji}`, body: b.description.es, read: false, created_at: now.toISOString(), badge_id: b.id });
      }
    }
    return { ...s, profile, completions, sessions, badges, notifications };
  });
}

export function addAnnouncement(title: string, body: string) {
  updateState((s) => ({
    ...s,
    announcements: [{ id: uid(), title, body, created_at: new Date().toISOString() }, ...s.announcements],
  }));
}
