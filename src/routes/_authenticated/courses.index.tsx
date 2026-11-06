import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CourseRow } from "@/components/CourseRow";
import { useCourses } from "@/lib/app-data";

export const Route = createFileRoute("/_authenticated/courses/")({
  head: () => ({ meta: [{ title: "Cursos — Fuego+" }, { name: "description", content: "Tus cursos bíblicos y sugerencias." }] }),
  component: CoursesPage,
});

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
