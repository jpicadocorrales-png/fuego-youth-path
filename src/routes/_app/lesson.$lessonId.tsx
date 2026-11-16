import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ComingSoon } from "@/components/ComingSoon";
import { ReligionsLesson } from "@/components/lessons/ReligionsLesson";
import { READY_EXPERIENCES, findLesson, isCourseAvailable } from "@/lib/demo-data";
import { completeLesson } from "@/lib/demo-store";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/_app/lesson/$lessonId")({
  head: () => ({ meta: [{ title: "Lección — Fuego+" }, { name: "description", content: "Aprende y gana XP." }] }),
  component: LessonPlayer,
});

function LessonPlayer() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { lang, t } = useLang();
  const found = findLesson(lessonId);

  if (!found) return <ComingSoon kind="course" title={t("desconocido", "unknown")} />;
  const { course, lesson } = found;
  if (!isCourseAvailable(course.id)) return <ComingSoon kind="course" title={course.title[lang]} />;

  // Lecciones cuyo contenido todavía se está preparando (por ejemplo «Jesús»).
  if (!lesson.experience || !READY_EXPERIENCES.has(lesson.experience)) {
    return <ComingSoon kind="lesson" title={lesson.title[lang]} courseId={course.id} />;
  }

  const exit = () => navigate({ to: "/courses/$courseId", params: { courseId: course.id } });
  const finish = () => {
    completeLesson(lesson.id, course.id, 100);
    void qc.invalidateQueries();
  };
  const goNext = () => {
    const next = course.lessons.find((l) => l.order_index > lesson.order_index);
    if (next) navigate({ to: "/lesson/$lessonId", params: { lessonId: next.id } });
    else exit();
  };

  return <ReligionsLesson key={lesson.id} onComplete={finish} onNext={goNext} onExit={exit} />;
}
