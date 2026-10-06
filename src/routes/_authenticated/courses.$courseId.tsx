import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Lock, Star } from "lucide-react";
import { AppShell, ProgressBar } from "@/components/AppShell";
import { courseColor, useCourses } from "@/lib/app-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/courses/$courseId")({
  head: () => ({ meta: [{ title: "Curso — Fuego+" }, { name: "description", content: "Camino de lecciones del curso." }] }),
  component: CoursePath,
});

const offsets = [0, 60, 90, 60, 0, -60, -90, -60];

function CoursePath() {
  const { courseId } = Route.useParams();
  const { data: courses = [] } = useCourses();
  const course = courses.find((c) => c.id === courseId);
  if (!course) return <AppShell><p>Cargando…</p></AppShell>;
  const nextIdx = course.lessons.findIndex((l) => !l.done);
  const others = courses.filter((c) => c.id !== course.id && c.pct < 100).slice(0, 2);

  return (
    <AppShell>
      <div className={`rounded-3xl p-5 text-primary-foreground ${courseColor[course.color] ?? "bg-primary"}`}>
        <Link to="/courses" className="text-sm font-bold opacity-90">← Cursos</Link>
        <h1 className="mt-1 text-2xl font-bold">{course.emoji} {course.title}</h1>
        <p className="text-sm opacity-90">{course.description}</p>
        <div className="mt-3 text-sm font-extrabold">{course.completed}/{course.total} lecciones · {course.pct}%</div>
      </div>

      <div className="my-10 flex flex-col items-center gap-6">
        {course.lessons.map((l, i) => {
          const isNext = i === nextIdx;
          const locked = !l.done && !isNext;
          const node = (
            <div
              className={cn(
                "flex size-20 items-center justify-center rounded-full text-primary-foreground transition-transform",
                l.done && "bg-gold shadow-[0_6px_0_var(--color-gold-shade)]",
                isNext && "bg-primary shadow-[0_6px_0_var(--color-primary-shade)] hover:scale-105",
                locked && "bg-muted text-muted-foreground shadow-[0_6px_0_var(--color-border)]",
              )}
            >
              {l.done ? <Check className="!size-9" strokeWidth={4} /> : locked ? <Lock className="!size-8" /> : <Star className="!size-9 fill-current" />}
            </div>
          );
          return (
            <div key={l.id} className="flex flex-col items-center" style={{ transform: `translateX(${offsets[i % offsets.length]}px)` }}>
              {isNext && <div className="mb-2 animate-bounce rounded-xl border-2 bg-card px-3 py-1 text-sm font-extrabold text-primary">¡EMPIEZA!</div>}
              {locked ? node : <Link to="/lesson/$lessonId" params={{ lessonId: l.id }}>{node}</Link>}
              <span className="mt-2 text-sm font-bold">{l.title}</span>
            </div>
          );
        })}
      </div>

      {course.pct === 100 && others.length > 0 && (
        <div className="card-chunky p-5">
          <h2 className="text-xl font-bold">🎉 ¡Terminaste! Próximo curso sugerido</h2>
          {others.map((o) => (
            <Link key={o.id} to="/courses/$courseId" params={{ courseId: o.id }} className="mt-3 block rounded-xl bg-muted p-3 font-bold">
              {o.emoji} {o.title}
              <ProgressBar value={o.pct} className="mt-2 h-2" />
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
