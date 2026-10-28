import { useEffect, useRef, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/AppShell";
import { IAmExperience } from "./IAmExperience";
import { ProphecyScroll } from "./ProphecyScroll";
import type { BackRef } from "./lessonProgress";

const STEPS = ["intro", "prophecies", "declarations", "final"] as const;

type Props = { onComplete: () => void; onNext: () => void; onExit: () => void };

export function JesusLesson({ onComplete, onNext, onExit }: Props) {
  const [i, setI] = useState(0);
  const step = STEPS[i]!;
  const next = () => setI((x) => Math.min(x + 1, STEPS.length - 1));
  // Cada actividad registra aquí cómo retroceder un paso dentro de ella (profecía o declaración anterior).
  const backRef: BackRef = useRef<(() => boolean) | null>(null);
  const back = () => {
    if (backRef.current?.()) return;
    if (i > 0) setI(i - 1);
    else onExit();
  };

  useEffect(() => {
    if (step === "final") onComplete();
    window.scrollTo({ top: 0 });
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const label =
    step === "prophecies"
      ? "Experiencia 1 · Profecías cumplidas"
      : step === "declarations"
        ? "Experiencia 2 · Símbolos «YO SOY»"
        : step === "final"
          ? "Lección completada"
          : "Jesús · Fundamentos";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-4 p-5">
        <button onClick={back} aria-label="Atrás">
          <ArrowLeft className="size-7 text-muted-foreground" />
        </button>
        <ProgressBar value={(i / (STEPS.length - 1)) * 100} />
        <button onClick={onExit} aria-label="Salir">
          <X className="size-7 text-muted-foreground" />
        </button>
      </div>
      <div className="mx-auto w-full max-w-2xl px-5 text-xs font-extrabold uppercase tracking-widest text-flame">
        {label}
      </div>
      <div key={step} className="mx-auto w-full max-w-2xl flex-1 animate-pop px-5 pb-10 pt-3">
        {step === "intro" && <Intro onNext={next} />}
        {step === "prophecies" && <ProphecyScroll onNext={next} backRef={backRef} />}
        {step === "declarations" && <IAmExperience onNext={next} backRef={backRef} />}
        {step === "final" && <Final onNext={onNext} />}
      </div>
    </div>
  );
}

function Intro({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <h1 className="text-3xl font-black">Jesús, las promesas y sus declaraciones</h1>
      <div className="card-chunky mt-6 space-y-3 p-5 text-lg">
        <p>Mucho antes de Jesús, Dios anunció en las Escrituras lo que haría por su pueblo.</p>
        <p>En Jesús se cumplen esas promesas, y él mismo revela quién es.</p>
      </div>
      <Button size="lg" className="mt-6 w-full" onClick={onNext}>
        Descubrir las profecías
      </Button>
    </div>
  );
}

function Final({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 pt-10 text-center">
      <h1 className="text-4xl font-black text-primary">¡Lección completada!</h1>
      <p className="text-lg">Descubriste cómo Jesús cumple las promesas y revela su identidad.</p>
      <Button size="lg" className="mt-4 w-full" onClick={onNext}>
        Continuar
      </Button>
    </div>
  );
}
