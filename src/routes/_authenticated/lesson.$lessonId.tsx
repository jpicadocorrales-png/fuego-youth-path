import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { ProgressBar } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import mascot from "@/assets/fuego-mascot.png";
import { ReligionsLesson } from "@/components/lessons/ReligionsLesson";
import { JesusLesson } from "@/components/lessons/JesusLesson";

export const Route = createFileRoute("/_authenticated/lesson/$lessonId")({
  head: () => ({ meta: [{ title: "Lección — Sendero" }, { name: "description", content: "Responde y gana XP." }] }),
  component: LessonPlayer,
});

const kindLabel: Record<string, string> = {
  multiple: "Elige la respuesta correcta",
  fill: "Completa el versículo",
  truefalse: "¿Verdadero o falso?",
};

function LessonPlayer() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const [{ data: lesson }, { data: qs }] = await Promise.all([
        supabase.from("lessons").select("*").eq("id", lessonId).single(),
        supabase.from("questions").select("*").eq("lesson_id", lessonId).order("order_index"),
      ]);
      return { lesson, questions: qs ?? [] };
    },
  });

  const [step, setStep] = useState(-1); // -1 = reading
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!data?.lesson) return <div className="p-10 text-center">Cargando…</div>;
  const { lesson, questions } = data;
  const total = questions.length;
  const q = step >= 0 ? questions[step] : null;
  const opts = (q?.options as string[]) ?? [];
  const isRight = q && picked === q.correct_index;

  async function finish(finalCorrect: number, showSummary = true) {
    const score = total ? Math.round((finalCorrect / total) * 100) : 100;
    const { data: u } = await supabase.auth.getUser();
    const { data: existing } = await supabase
      .from("lesson_completions").select("id").eq("lesson_id", lesson!.id).eq("user_id", u.user!.id).maybeSingle();
    if (!existing) {
      await supabase.from("lesson_completions").insert({ lesson_id: lesson!.id, course_id: lesson!.course_id, score, user_id: u.user!.id });
    }
    qc.invalidateQueries();
    if (showSummary) setFinished(true);
  }

  const goNext = async () => {
    const { data: next } = await supabase
      .from("lessons").select("id").eq("course_id", lesson.course_id)
      .gt("order_index", lesson.order_index).order("order_index").limit(1).maybeSingle();
    if (next) {
      setStep(-1); setPicked(null); setChecked(false); setCorrect(0); setFinished(false);
      navigate({ to: "/lesson/$lessonId", params: { lessonId: next.id } });
    } else navigate({ to: "/courses/$courseId", params: { courseId: lesson.course_id } });
  };

  if (lesson.experience === "jesus-01") {
    return (
      <JesusLesson
        onComplete={() => void finish(0, false)}
        onNext={() => void goNext()}
        onExit={() => navigate({ to: "/courses/$courseId", params: { courseId: lesson.course_id } })}
      />
    );
  }

  if (lesson.experience === "religions-01") {
    return (
      <ReligionsLesson
        onComplete={() => void finish(0, false)}
        onNext={() => void goNext()}
        onExit={() => navigate({ to: "/courses/$courseId", params: { courseId: lesson.course_id } })}
      />
    );
  }

  function next() {
    const newCorrect = correct + (isRight ? 1 : 0);
    setCorrect(newCorrect);
    if (step + 1 >= total) { void finish(newCorrect); return; }
    setStep(step + 1);
    setPicked(null);
    setChecked(false);
  }

  if (finished) {
    const pct = total ? Math.round((correct / total) * 100) : 100;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <img src={mascot} alt="" width={1024} height={1024} className="w-40 animate-pop" />
        <h1 className="text-4xl font-bold text-primary">¡Lección completada!</h1>
        <div className="flex gap-3">
          <div className="card-chunky border-gold px-6 py-3"><div className="text-xs font-extrabold uppercase text-gold">XP</div><div className="font-display text-2xl font-bold">+{lesson.xp}</div></div>
          <div className="card-chunky border-primary px-6 py-3"><div className="text-xs font-extrabold uppercase text-primary">Precisión</div><div className="font-display text-2xl font-bold">{pct}%</div></div>
        </div>
        <Button size="lg" className="mt-4 w-64" onClick={() => navigate({ to: "/courses/$courseId", params: { courseId: lesson.course_id } })}>Continuar</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-4 p-5">
        <button
          aria-label="Atrás"
          onClick={() => {
            if (step < 0) { navigate({ to: "/courses/$courseId", params: { courseId: lesson.course_id } }); return; }
            setStep(step - 1); setPicked(null); setChecked(false);
          }}
        ><ArrowLeft className="size-7 text-muted-foreground" /></button>
        <ProgressBar value={total ? ((step + (checked ? 1 : 0)) / total) * 100 : 0} />
        <Link to="/courses/$courseId" params={{ courseId: lesson.course_id }} aria-label="Salir"><X className="size-7 text-muted-foreground" /></Link>
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 px-5">
        {step === -1 ? (
          <div className="animate-pop">
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
            <div className="mt-6 flex items-start gap-4">
              <img src={mascot} alt="" width={1024} height={1024} className="w-24" />
              <div className="card-chunky flex-1 p-5">
                <p className="text-xl font-semibold italic">“{lesson.passage}”</p>
                <p className="mt-2 text-sm font-extrabold text-secondary">{lesson.reference}</p>
              </div>
            </div>
          </div>
        ) : q && (
          <div key={q.id} className="animate-pop">
            <div className="text-sm font-extrabold uppercase text-secondary">{kindLabel[q.kind] ?? "Pregunta"}</div>
            <h2 className="mt-2 text-2xl font-bold">{q.prompt}</h2>
            <div className={cn("mt-6 grid gap-3", q.kind === "truefalse" && "grid-cols-2")}>
              {opts.map((o, i) => (
                <button
                  key={i}
                  disabled={checked}
                  onClick={() => setPicked(i)}
                  className={cn(
                    "card-chunky p-4 text-left text-lg font-bold transition-all active:translate-y-1",
                    picked === i && !checked && "border-secondary bg-secondary/10 text-secondary",
                    checked && i === q.correct_index && "border-primary bg-accent text-accent-foreground",
                    checked && picked === i && i !== q.correct_index && "border-destructive bg-destructive/10 text-destructive",
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={cn("border-t-2 p-5", checked && (isRight ? "bg-accent" : "bg-destructive/10"))}>
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <div className="font-display text-xl font-bold">
            {checked && (isRight ? <span className="text-primary">¡Excelente! 🎉</span> : <span className="text-destructive">Respuesta: {opts[q!.correct_index]}</span>)}
          </div>
          {step === -1 ? (
            <Button size="lg" onClick={() => (total ? setStep(0) : finish(0))}>Comenzar</Button>
          ) : !checked ? (
            <Button size="lg" disabled={picked === null} onClick={() => setChecked(true)}>Comprobar</Button>
          ) : (
            <Button size="lg" variant={isRight ? "default" : "destructive"} onClick={next}>Continuar</Button>
          )}
        </div>
      </div>
    </div>
  );
}
