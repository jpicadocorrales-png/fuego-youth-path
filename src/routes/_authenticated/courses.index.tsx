import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useCourses } from "@/lib/app-data";
import { courseLook } from "@/lib/course-look";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/courses/")({
  head: () => ({ meta: [{ title: "Cursos — Fuego+" }, { name: "description", content: "Tus cursos bíblicos y sugerencias." }] }),
  component: CoursesPage,
});

type Course = NonNullable<ReturnType<typeof useCourses>["data"]>[number];

// Fila de curso con el mismo estilo que los anuncios del inicio: fondo blanco, texto negro
// y el ícono del curso en su color de la paleta.
function CourseRow({ c }: { c: Course }) {
  const look = courseLook(c);
  const done = c.pct === 100;
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: c.id }}
      className="flex items-center gap-4 rounded-[1.5rem] bg-card p-5 text-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
    >
      <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl", look.tint, look.fg)}>
        <look.icon className="size-7" strokeWidth={2.25} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-lg font-extrabold tracking-normal">{c.title}</h3>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground">
            {c.level} · {c.total} lecciones
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-muted-foreground">{c.description}</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full rounded-full transition-all duration-700", look.bg)} style={{ width: `${c.pct}%` }} />
          </div>
          {done ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold">
              <Check className="size-4" strokeWidth={3} /> Completado
            </span>
          ) : (
            <span className="shrink-0 text-sm font-bold">
              {c.completed} de {c.total} · {c.pct}%
            </span>
          )}
        </div>
      </div>
      <ArrowRight className="size-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}

function CoursesPage() {
  const { data: courses = [] } = useCourses();
  const mine = courses.filter((c) => c.pct > 0);
  const suggested = courses.filter((c) => c.pct === 0);

  return (
    <AppShell>
      <h1 className="text-4xl font-black md:text-5xl">Cursos</h1>

      <h2 className="mb-4 mt-8 text-2xl font-black md:text-3xl">Mis cursos</h2>
      {mine.length ? (
        <div className="space-y-3">
          {mine.map((c) => (
            <CourseRow key={c.id} c={c} />
          ))}
        </div>
      ) : (
        <p className="rounded-[1.5rem] bg-card p-5 text-muted-foreground">Aún no empiezas ningún curso. ¡Elige uno abajo!</p>
      )}

      {suggested.length > 0 && (
        <>
          <h2 className="mb-4 mt-12 text-2xl font-black md:text-3xl">Sugeridos para ti</h2>
          <div className="space-y-3 pb-6">
            {suggested.map((c) => (
              <CourseRow key={c.id} c={c} />
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
