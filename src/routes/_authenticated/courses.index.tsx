import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, ProgressBar } from "@/components/AppShell";
import { useCourses } from "@/lib/app-data";
import { courseLook } from "@/lib/course-look";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/courses/")({
  head: () => ({ meta: [{ title: "Cursos — Fuego+" }, { name: "description", content: "Tus cursos bíblicos y sugerencias." }] }),
  component: CoursesPage,
});

function CoursesPage() {
  const { data: courses = [] } = useCourses();
  const mine = courses.filter((c) => c.pct > 0);
  const suggested = courses.filter((c) => c.pct === 0);

  const Card = ({ c }: { c: (typeof courses)[number] }) => {
    const look = courseLook(c);
    return (
    <Link to="/courses/$courseId" params={{ courseId: c.id }} className="card-chunky block overflow-hidden transition-transform hover:-translate-y-1">
      <div className={cn("flex h-24 items-center justify-center", look.bg, look.text)}>
        <look.icon className="size-12" strokeWidth={2} />
      </div>
      <div className="p-4">
        <div className="text-xs font-extrabold uppercase text-muted-foreground">{c.level} · {c.total} lecciones</div>
        <h3 className="mt-1 text-lg font-bold">{c.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
        <ProgressBar value={c.pct} className="mt-3 h-3" />
        <div className="mt-1 text-xs font-bold">{c.pct === 100 ? "¡Completado! 🏆" : `${c.pct}%`}</div>
      </div>
    </Link>
    );
  };

  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Mis cursos</h1>
      {mine.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">{mine.map((c) => <Card key={c.id} c={c} />)}</div>
      ) : (
        <p className="mt-2 text-muted-foreground">Aún no empiezas ningún curso. ¡Elige uno abajo!</p>
      )}
      {suggested.length > 0 && (
        <>
          <h2 className="mt-10 text-2xl font-bold">✨ Sugeridos para ti</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">{suggested.map((c) => <Card key={c.id} c={c} />)}</div>
        </>
      )}
    </AppShell>
  );
}
