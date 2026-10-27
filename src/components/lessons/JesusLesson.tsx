import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import { PROPHECIES, I_AM_STATEMENTS, I_AM_REVELATION } from "./jesusContent";

const STEPS = ["intro", "prophecies", "declarations", "final"] as const;

type Props = { onComplete: () => void; onNext: () => void; onExit: () => void };

export function JesusLesson({ onComplete, onNext, onExit }: Props) {
  const [i, setI] = useState(0);
  const step = STEPS[i]!;
  const next = () => setI((x) => Math.min(x + 1, STEPS.length - 1));

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
        <button onClick={() => (i > 0 ? setI(i - 1) : onExit())} aria-label="Atrás">
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
        {step === "prophecies" && <Prophecies onNext={next} />}
        {step === "declarations" && <Declarations onNext={next} />}
        {step === "final" && <Final onNext={onNext} />}
      </div>
    </div>
  );
}

function FlipCard({
  front,
  back,
  onReveal,
}: {
  front: ReactNode;
  back: ReactNode;
  onReveal: () => void;
}) {
  const [open, setOpen] = useState(false);
  const flip = () => {
    setOpen(!open);
    if (!open) onReveal();
  };
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={open}
      onClick={flip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          flip();
        }
      }}
      className="block w-full cursor-pointer [perspective:1000px]"
    >
      <div
        className={cn(
          "relative min-h-44 transition-transform duration-500 [transform-style:preserve-3d]",
          open && "[transform:rotateY(180deg)]",
        )}
      >
        <div className="card-chunky absolute inset-0 flex flex-col justify-center p-5 [backface-visibility:hidden]">
          {front}
        </div>
        <div className="card-chunky absolute inset-0 flex flex-col justify-center overflow-auto border-primary/30 bg-card p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}
        </div>
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

function Prophecies({ onNext }: { onNext: () => void }) {
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const mark = (id: string) => setSeen((s) => new Set(s).add(id));
  const total = PROPHECIES.length;
  return (
    <div>
      <h2 className="text-2xl font-bold">Profecías cumplidas</h2>
      <p className="text-muted-foreground">
        Toca cada tarjeta para descubrir su cumplimiento ({seen.size}/{total})
      </p>
      <div className="mt-4 space-y-3">
        {PROPHECIES.map((p) => (
          <FlipCard
            key={p.id}
            onReveal={() => mark(p.id)}
            front={
              <>
                <div className="text-xs font-extrabold uppercase text-secondary">
                  Antiguo Testamento · {p.ot.ref}
                </div>
                <p className="mt-2 text-lg font-semibold">{p.ot.text}</p>
              </>
            }
            back={
              <>
                <div className="text-xs font-extrabold uppercase text-primary">
                  Cumplida en · {p.nt.ref}
                </div>
                <p className="mt-2 text-lg font-semibold">{p.nt.text}</p>
              </>
            }
          />
        ))}
      </div>
      <Button size="lg" className="mt-6 w-full" disabled={seen.size < total} onClick={onNext}>
        {seen.size < total ? `Descubre ${total - seen.size} más` : "Continuar"}
      </Button>
    </div>
  );
}

function Declarations({ onNext }: { onNext: () => void }) {
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const mark = (id: string) => setSeen((s) => new Set(s).add(id));
  const total = I_AM_STATEMENTS.length;
  const done = seen.size >= total;
  return (
    <div>
      <h2 className="text-2xl font-bold">Las declaraciones «YO SOY»</h2>
      <p className="text-muted-foreground">
        Toca cada declaración para descubrir qué revela ({seen.size}/{total})
      </p>
      <div className="mt-4 space-y-3">
        {I_AM_STATEMENTS.map((s) => (
          <FlipCard
            key={s.id}
            onReveal={() => mark(s.id)}
            front={
              <>
                <div className="text-xs font-extrabold uppercase text-secondary">{s.ref}</div>
                <p className="mt-2 font-display text-2xl font-black">{s.statement}</p>
                {seen.has(s.id) && <Check className="mt-2 !size-6 text-primary" />}
              </>
            }
            back={
              <>
                <p className="text-lg leading-relaxed">{s.meaning}</p>
                <p className="mt-3 text-base font-bold text-primary">Reflexión: {s.reflection}</p>
              </>
            }
          />
        ))}
      </div>
      {done && (
        <div className="card-chunky mt-6 animate-pop border-gold p-5">
          <div className="text-xs font-extrabold uppercase text-gold">{I_AM_REVELATION.ref}</div>
          <p className="mt-2 font-display text-xl font-bold">{I_AM_REVELATION.text}</p>
          <p className="mt-2 text-muted-foreground">
            Jesús se revela con el mismo nombre con que Dios se presentó.
          </p>
        </div>
      )}
      <Button size="lg" className="mt-6 w-full" disabled={!done} onClick={onNext}>
        {done ? "Continuar" : `Descubre ${total - seen.size} más`}
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
