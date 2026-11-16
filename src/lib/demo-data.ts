// Datos de la versión demo (portafolio). La app no usa cuentas ni base de datos:
// los cursos viven aquí y el progreso de cada visitante se guarda en su navegador
// (ver demo-store.ts).
//
// Solo el primer curso se puede abrir. Los demás, y las lecciones sin experiencia
// lista, muestran el aviso «Estamos trabajando en el contenido».

/** Experiencias de lección ya desarrolladas. Las demás muestran el aviso. */
export const READY_EXPERIENCES = new Set(["religions-01"]);

export type DemoLesson = {
  id: string;
  title: string;
  xp: number;
  order_index: number;
  experience: string | null;
};

export type DemoCourse = {
  id: string;
  title: string;
  description: string;
  color: string;
  level: string;
  order_index: number;
  lessons: DemoLesson[];
};

function lessons(courseId: string, list: (string | [string, string])[]): DemoLesson[] {
  return list.map((item, i) => {
    const [title, experience] = typeof item === "string" ? [item, null] : item;
    return { id: `${courseId}-${i + 1}`, title, xp: 10, order_index: i + 1, experience };
  });
}

export const COURSES: DemoCourse[] = [
  {
    id: "fundamentos",
    title: "Fundamentos",
    description: "Descubre qué creemos los cristianos, qué hace diferente al cristianismo y por qué Jesús está en el centro de nuestra fe.",
    color: "orange",
    level: "Principiante",
    order_index: 1,
    lessons: lessons("fundamentos", [
      ["Religiones", "religions-01"],
      ["Jesús", "jesus-01"],
      "Dios",
      "Espíritu Santo",
      "Pecado",
      "Salvación",
      "Oración",
      "Iglesia",
    ]),
  },
  {
    id: "creacion",
    title: "Creación y Génesis",
    description: "Descubre cómo empezó todo: la creación, Adán y Eva, Noé y Abraham.",
    color: "green",
    level: "Principiante",
    order_index: 2,
    lessons: lessons("creacion", ["La creación", "Adán y Eva", "Noé y Abraham"]),
  },
  {
    id: "vida-de-jesus",
    title: "Vida de Jesús",
    description: "Nacimiento, milagros, enseñanzas y resurrección de Jesús.",
    color: "sky",
    level: "Principiante",
    order_index: 3,
    lessons: lessons("vida-de-jesus", ["Nacimiento", "Milagros", "Enseñanzas", "Resurrección"]),
  },
  {
    id: "heroes",
    title: "Héroes de la fe",
    description: "David, Ester, Daniel y otros que confiaron en Dios.",
    color: "yellow",
    level: "Intermedio",
    order_index: 4,
    lessons: lessons("heroes", ["David y Ester", "Daniel"]),
  },
  {
    id: "frutos",
    title: "Frutos del Espíritu",
    description: "Amor, gozo, paz y más: cómo vivirlos hoy.",
    color: "pink",
    level: "Intermedio",
    order_index: 5,
    lessons: lessons("frutos", ["Amor, gozo y paz", "Vivirlos hoy"]),
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
  name: string;
  description: string;
  emoji: string;
  kind: "lessons" | "xp" | "streak" | "courses" | "perfect";
  threshold: number;
};

const badge = (code: string, name: string, description: string, emoji: string, kind: DemoBadge["kind"], threshold: number): DemoBadge => ({
  id: code,
  code,
  name,
  description,
  emoji,
  kind,
  threshold,
});

export const BADGES: DemoBadge[] = [
  badge("first", "Primer paso", "Completaste tu primera lección", "🌱", "lessons", 1),
  badge("five", "Lector constante", "Completaste 5 lecciones", "📚", "lessons", 5),
  badge("ten", "Discípulo", "Completaste 10 lecciones", "🕊️", "lessons", 10),
  badge("xp100", "100 XP", "Alcanzaste 100 puntos de experiencia", "⚡", "xp", 100),
  badge("xp300", "Llama encendida", "Alcanzaste 300 XP", "🔥", "xp", 300),
  badge("streak3", "Racha de 3 días", "Estudiaste 3 días seguidos", "🌟", "streak", 3),
  badge("streak7", "Semana fiel", "Estudiaste 7 días seguidos", "👑", "streak", 7),
  badge("course1", "Curso completo", "Terminaste un curso entero", "🏆", "courses", 1),
  badge("perfect", "Perfecto", "Lección sin errores", "💎", "perfect", 1),
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: "bienvenida",
    title: "¡Bienvenidos a la app!",
    body: "Cada semana publicaremos nuevos cursos. ¡Mantén tu racha!",
    created_at: "2026-11-02T12:00:00Z",
  },
  {
    id: "reto",
    title: "Reto del mes",
    body: "Completa el curso \"Vida de Jesús\" este mes y gana una sorpresa en el grupo de jóvenes.",
    created_at: "2026-11-01T12:00:00Z",
  },
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
