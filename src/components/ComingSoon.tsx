import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import mascot from "@/assets/fuego-mascot.png";
import { LangSwitch, useLang } from "@/lib/i18n";

type Props = { kind: "lesson"; title: string; courseId: string } | { kind: "course"; title: string };

/** Aviso para lecciones y cursos cuyo contenido todavía se está preparando. */
export function ComingSoon(props: Props) {
  const navigate = useNavigate();
  const { t } = useLang();
  const isLesson = props.kind === "lesson";
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <LangSwitch className="absolute right-5 top-5" />
      <img src={mascot} alt="" width={800} height={800} className="w-40 animate-pop" />
      <h1 className="text-3xl font-bold text-primary">{t("Estamos trabajando en el contenido", "We're working on this content")}</h1>
      <p className="max-w-sm text-lg text-muted-foreground">
        {t(
          `${isLesson ? "La lección" : "El curso"} «${props.title}» estará disponible muy pronto. ¡Gracias por tu paciencia!`,
          `The ${isLesson ? "lesson" : "course"} “${props.title}” will be available very soon. Thanks for your patience!`,
        )}
      </p>
      <Button
        size="lg"
        className="mt-4 w-64"
        onClick={() =>
          props.kind === "lesson"
            ? navigate({ to: "/courses/$courseId", params: { courseId: props.courseId } })
            : navigate({ to: "/courses" })
        }
      >
        {isLesson ? t("Volver al curso", "Back to course") : t("Volver a cursos", "Back to courses")}
      </Button>
    </div>
  );
}
