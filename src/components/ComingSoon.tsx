import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import mascot from "@/assets/fuego-mascot.png";

type Props = { kind: "lesson"; title: string; courseId: string } | { kind: "course"; title: string };

/** Aviso para lecciones y cursos cuyo contenido todavía se está preparando. */
export function ComingSoon(props: Props) {
  const navigate = useNavigate();
  const isLesson = props.kind === "lesson";
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <img src={mascot} alt="" width={800} height={800} className="w-40 animate-pop" />
      <h1 className="text-3xl font-bold text-primary">Estamos trabajando en el contenido</h1>
      <p className="max-w-sm text-lg text-muted-foreground">
        {isLesson ? "La lección" : "El curso"} «{props.title}» estará disponible muy pronto. ¡Gracias por tu paciencia!
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
        {isLesson ? "Volver al curso" : "Volver a cursos"}
      </Button>
    </div>
  );
}
