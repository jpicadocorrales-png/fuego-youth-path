// Progreso del visitante guardado en localStorage (versión demo, sin cuentas).
import { BADGES, COURSES, INITIAL_ANNOUNCEMENTS } from "./demo-data";

const KEY = "fuego-demo-v1";

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
export type Notification = { id: string; title: string; body: string; read: boolean; created_at: string };
export type Announcement = { id: string; title: string; body: string; created_at: string };

export type DemoState = {
  profile: Profile;
  completions: Completion[];
  badges: { badge_id: string; earned_at: string }[];
  notifications: Notification[];
  announcements: Announcement[];
};

const initial = (): DemoState => ({
  profile: {
    display_name: "Visitante",
    avatar_emoji: "🦁",
    daily_goal: 1,
    sound_enabled: true,
    email_notifications: true,
    xp: 0,
    streak: 0,
    last_activity_date: null,
  },
  completions: [],
  badges: [],
  notifications: [
    { id: "welcome", title: "¡Bienvenido! 🎉", body: "Empieza tu primer curso y gana tu primera insignia.", read: false, created_at: new Date().toISOString() },
  ],
  announcements: [...INITIAL_ANNOUNCEMENTS],
});

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
    if (s.completions.some((c) => c.lesson_id === lessonId)) return s;
    const course = COURSES.find((c) => c.id === courseId);
    const xp = course?.lessons.find((l) => l.id === lessonId)?.xp ?? 10;
    const now = new Date();
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
        notifications.unshift({ id: uid(), title: `Nueva insignia: ${b.name} ${b.emoji}`, body: b.description, read: false, created_at: now.toISOString() });
      }
    }
    return { ...s, profile, completions, badges, notifications };
  });
}

export function addAnnouncement(title: string, body: string) {
  updateState((s) => ({
    ...s,
    announcements: [{ id: uid(), title, body, created_at: new Date().toISOString() }, ...s.announcements],
  }));
}
