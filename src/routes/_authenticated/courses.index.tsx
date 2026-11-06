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

// Tarjeta de curso con el mismo estilo que el inicio: fondo de color completo, etiqueta,
// título, descripción y barra de avance blanca.
function CourseCard({ c }: { c: Course }) {
  const look = courseLook(c);
  const done = c.pct === 100;
  return (
    <Link
      to="/courses/$courseId"
      params={{ courseId: c.id }}
      className={cn(
        "flex min-h-56 flex-col rounded-[1.75rem] p-6 transition-transform hover:scale-[1.02]",
        look.bg,
        look.text,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-white/20">
          <look.icon className="size-6" strokeWidth={2.5} />
        </span>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wide">
          {c.level} · {c.total} lecciones
        </span>
      </div>
      <div className="mt-auto pt-6">
        <h3 className="text-2xl font-extrabold leading-tight tracking-normal">{c.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm font-semibold opacity-90">{c.description}</p>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/30">
          <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${c.pct}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm font-bold">
          <span>
            {c.completed} de {c.total} lecciones · {c.pct}%
          </span>
          {done ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-extrabold">
              <Check className="size-3.5" strokeWidth={3} /> Completado
            </span>
          ) : (
            <ArrowRight className="size-5" />
          )}
        </div>
      </div>
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
        <div className="grid gap-4 sm:grid-cols-2">
          {mine.map((c) => (
            <CourseCard key={c.id} c={c} />
          ))}
        </div>
      ) : (
        <p className="rounded-[1.5rem] bg-card p-5 text-muted-foreground">Aún no empiezas ningún curso. ¡Elige uno abajo!</p>
      )}

      {suggested.length > 0 && (
        <>
          <h2 className="mb-4 mt-12 text-2xl font-black md:text-3xl">Sugeridos para ti</h2>
          <div className="grid gap-4 pb-6 sm:grid-cols-2">
            {suggested.map((c) => (
              <CourseCard key={c.id} c={c} />
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
