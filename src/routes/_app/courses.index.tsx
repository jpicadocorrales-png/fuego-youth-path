import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CourseRow } from "@/components/CourseRow";
import { useCourses } from "@/lib/app-data";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/_app/courses/")({
  head: () => ({ meta: [{ title: "Cursos — Fuego+" }, { name: "description", content: "Tus cursos bíblicos y sugerencias." }] }),
  component: CoursesPage,
});

function CoursesPage() {
  const { data: courses = [] } = useCourses();
  const { t } = useLang();
  const mine = courses.filter((c) => c.pct > 0);
  const suggested = courses.filter((c) => c.pct === 0);

  return (
    <AppShell>
      <h1 className="text-4xl font-black md:text-5xl">{t("Cursos", "Courses")}</h1>

      <h2 className="mb-4 mt-8 text-2xl font-black md:text-3xl">{t("Mis cursos", "My courses")}</h2>
      {mine.length ? (
        <div className="space-y-3">
          {mine.map((c) => (
            <CourseRow key={c.id} c={c} />
          ))}
        </div>
      ) : (
        <p className="rounded-[1.5rem] bg-card p-5 text-muted-foreground">{t("Aún no empiezas ningún curso. ¡Elige uno abajo!", "You haven't started a course yet. Pick one below!")}</p>
      )}

      {suggested.length > 0 && (
        <>
          <h2 className="mb-4 mt-12 text-2xl font-black md:text-3xl">{t("Sugeridos para ti", "Suggested for you")}</h2>
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
