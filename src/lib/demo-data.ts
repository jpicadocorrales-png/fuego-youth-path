// Datos de la versión demo (portafolio). La app no usa cuentas ni base de datos:
// los cursos viven aquí y el progreso de cada visitante se guarda en su navegador
// (ver demo-store.ts). Los textos están en español e inglés.
//
// Solo el primer curso se puede abrir. Los demás, y las lecciones sin experiencia
// lista, muestran el aviso «Estamos trabajando en el contenido».

import type { Lang } from "./i18n";

export type Text = { es: string; en: string };
export const tx = (text: Text, lang: Lang) => text[lang];

/** Experiencias de lección ya desarrolladas. Las demás muestran el aviso. */
export const READY_EXPERIENCES = new Set(["religions-01"]);

export type DemoLesson = {
  id: string;
  title: Text;
  xp: number;
  order_index: number;
  experience: string | null;
};

export type DemoCourse = {
  id: string;
  title: Text;
  description: Text;
  color: string;
  level: Text;
  order_index: number;
  lessons: DemoLesson[];
};

const BEGINNER: Text = { es: "Principiante", en: "Beginner" };
const INTERMEDIATE: Text = { es: "Intermedio", en: "Intermediate" };

function lessons(courseId: string, list: [string, string, string?][]): DemoLesson[] {
  return list.map(([es, en, experience], i) => ({
    id: `${courseId}-${i + 1}`,
    title: { es, en },
    xp: 10,
    order_index: i + 1,
    experience: experience ?? null,
  }));
}

export const COURSES: DemoCourse[] = [
  {
    id: "fundamentos",
    title: { es: "Fundamentos", en: "Foundations" },
    description: {
      es: "Descubre qué creemos los cristianos, qué hace diferente al cristianismo y por qué Jesús está en el centro de nuestra fe.",
      en: "Discover what Christians believe, what makes Christianity different, and why Jesus is at the center of our faith.",
    },
    color: "orange",
    level: BEGINNER,
    order_index: 1,
    lessons: lessons("fundamentos", [
      ["Religiones", "Religions", "religions-01"],
      ["Jesús", "Jesus", "jesus-01"],
      ["Dios", "God"],
      ["Espíritu Santo", "Holy Spirit"],
      ["Pecado", "Sin"],
      ["Salvación", "Salvation"],
      ["Oración", "Prayer"],
      ["Iglesia", "Church"],
    ]),
  },
  {
    id: "creacion",
    title: { es: "Creación y Génesis", en: "Creation and Genesis" },
    description: {
      es: "Descubre cómo empezó todo: la creación, Adán y Eva, Noé y Abraham.",
      en: "Discover how it all began: creation, Adam and Eve, Noah and Abraham.",
    },
    color: "green",
    level: BEGINNER,
    order_index: 2,
    lessons: lessons("creacion", [
      ["La creación", "Creation"],
      ["Adán y Eva", "Adam and Eve"],
      ["Noé y Abraham", "Noah and Abraham"],
    ]),
  },
  {
    id: "vida-de-jesus",
    title: { es: "Vida de Jesús", en: "Life of Jesus" },
    description: {
      es: "Nacimiento, milagros, enseñanzas y resurrección de Jesús.",
      en: "The birth, miracles, teachings and resurrection of Jesus.",
    },
    color: "sky",
    level: BEGINNER,
    order_index: 3,
    lessons: lessons("vida-de-jesus", [
      ["Nacimiento", "Birth"],
      ["Milagros", "Miracles"],
      ["Enseñanzas", "Teachings"],
      ["Resurrección", "Resurrection"],
    ]),
  },
  {
    id: "heroes",
    title: { es: "Héroes de la fe", en: "Heroes of Faith" },
    description: {
      es: "David, Ester, Daniel y otros que confiaron en Dios.",
      en: "David, Esther, Daniel and others who trusted God.",
    },
    color: "yellow",
    level: INTERMEDIATE,
    order_index: 4,
    lessons: lessons("heroes", [
      ["David y Ester", "David and Esther"],
      ["Daniel", "Daniel"],
    ]),
  },
  {
    id: "frutos",
    title: { es: "Frutos del Espíritu", en: "Fruits of the Spirit" },
    description: {
      es: "Amor, gozo, paz y más: cómo vivirlos hoy.",
      en: "Love, joy, peace and more: how to live them today.",
    },
    color: "pink",
    level: INTERMEDIATE,
    order_index: 5,
    lessons: lessons("frutos", [
      ["Amor, gozo y paz", "Love, joy and peace"],
      ["Vivirlos hoy", "Living them today"],
    ]),
  },
];

/** Solo el primer curso está disponible en la demo. */
export const isCourseAvailable = (courseId: string) => COURSES[0]?.id === courseId;

export function findLesson(lessonId: string) {
  for (const course of COURSES) {
    const lesson = course.lessons.find((l) => l.id === lessonId);
    if (lesson) return { course, lesson };
  }
  return undefined;
}

export type DemoBadge = {
  id: string;
  code: string;
  name: Text;
  description: Text;
  emoji: string;
  kind: "lessons" | "xp" | "streak" | "courses" | "perfect";
  threshold: number;
};

const badge = (
  code: string,
  name: Text,
  description: Text,
  emoji: string,
  kind: DemoBadge["kind"],
  threshold: number,
): DemoBadge => ({ id: code, code, name, description, emoji, kind, threshold });

export const BADGES: DemoBadge[] = [
  badge("first", { es: "Primer paso", en: "First step" }, { es: "Completaste tu primera lección", en: "You completed your first lesson" }, "🌱", "lessons", 1),
  badge("five", { es: "Lector constante", en: "Steady reader" }, { es: "Completaste 5 lecciones", en: "You completed 5 lessons" }, "📚", "lessons", 5),
  badge("ten", { es: "Discípulo", en: "Disciple" }, { es: "Completaste 10 lecciones", en: "You completed 10 lessons" }, "🕊️", "lessons", 10),
  badge("xp100", { es: "100 XP", en: "100 XP" }, { es: "Alcanzaste 100 puntos de experiencia", en: "You reached 100 experience points" }, "⚡", "xp", 100),
  badge("xp300", { es: "Llama encendida", en: "Burning flame" }, { es: "Alcanzaste 300 XP", en: "You reached 300 XP" }, "🔥", "xp", 300),
  badge("streak3", { es: "Racha de 3 días", en: "3-day streak" }, { es: "Estudiaste 3 días seguidos", en: "You studied 3 days in a row" }, "🌟", "streak", 3),
  badge("streak7", { es: "Semana fiel", en: "Faithful week" }, { es: "Estudiaste 7 días seguidos", en: "You studied 7 days in a row" }, "👑", "streak", 7),
  badge("course1", { es: "Curso completo", en: "Course complete" }, { es: "Terminaste un curso entero", en: "You finished an entire course" }, "🏆", "courses", 1),
  badge("perfect", { es: "Perfecto", en: "Perfect" }, { es: "Lección sin errores", en: "A lesson with no mistakes" }, "💎", "perfect", 1),
];

/** Anuncios y notificaciones de ejemplo, traducidos por su id. */
export const BUILT_IN_TEXT: Record<string, { title: Text; body: Text }> = {
  bienvenida: {
    title: { es: "¡Bienvenidos a la app!", en: "Welcome to the app!" },
    body: { es: "Cada semana publicaremos nuevos cursos. ¡Mantén tu racha!", en: "We'll publish new courses every week. Keep your streak going!" },
  },
  reto: {
    title: { es: "Reto del mes", en: "Challenge of the month" },
    body: {
      es: "Completa el curso \"Vida de Jesús\" este mes y gana una sorpresa en el grupo de jóvenes.",
      en: "Complete the \"Life of Jesus\" course this month and win a surprise at youth group.",
    },
  },
  welcome: {
    title: { es: "¡Bienvenido! 🎉", en: "Welcome! 🎉" },
    body: { es: "Empieza tu primer curso y gana tu primera insignia.", en: "Start your first course and earn your first badge." },
  },
};

export const INITIAL_ANNOUNCEMENTS = [
  { id: "bienvenida", title: BUILT_IN_TEXT["bienvenida"]!.title.es, body: BUILT_IN_TEXT["bienvenida"]!.body.es, created_at: "2026-11-02T12:00:00Z" },
  { id: "reto", title: BUILT_IN_TEXT["reto"]!.title.es, body: BUILT_IN_TEXT["reto"]!.body.es, created_at: "2026-11-01T12:00:00Z" },
];

/**
 * Jóvenes ficticios para el panel de administración. `done` es cuántas lecciones
 * completó en cada curso y `daysAgo` hace cuántos días fue su última lección
 * (null = nunca).
 */
export const DEMO_STUDENTS: {
  id: string;
  display_name: string;
  avatar_emoji: string;
  streak: number;
  daysAgo: number | null;
  badges: number;
  done: Record<string, number>;
}[] = [
  { id: "s1", display_name: "Sofía", avatar_emoji: "🕊️", streak: 6, daysAgo: 0, badges: 5, done: { fundamentos: 8, creacion: 3, "vida-de-jesus": 2 } },
  { id: "s2", display_name: "Mateo", avatar_emoji: "🦁", streak: 4, daysAgo: 1, badges: 4, done: { fundamentos: 6, "vida-de-jesus": 3 } },
  { id: "s3", display_name: "Valentina", avatar_emoji: "🌟", streak: 3, daysAgo: 0, badges: 3, done: { fundamentos: 5, heroes: 2 } },
  { id: "s4", display_name: "Daniel", avatar_emoji: "👑", streak: 2, daysAgo: 2, badges: 2, done: { fundamentos: 4, frutos: 1 } },
  { id: "s5", display_name: "Camila", avatar_emoji: "🌿", streak: 0, daysAgo: 9, badges: 2, done: { fundamentos: 3 } },
  { id: "s6", display_name: "Andrés", avatar_emoji: "🐟", streak: 0, daysAgo: 12, badges: 1, done: { fundamentos: 1 } },
  { id: "s7", display_name: "Isabella", avatar_emoji: "🐑", streak: 0, daysAgo: null, badges: 0, done: {} },
];
