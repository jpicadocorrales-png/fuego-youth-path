import { useEffect, useRef, useState, type ReactNode } from "react";
import { Test as OddOne, Discard as Swipe } from "./ReligionsGames";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/AppShell";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ReligionBadge } from "./ReligionIcons";

const R = {
  cri: { name: "Cristianismo" },
  isl: { name: "Islam" },
  jud: { name: "Judaísmo" },
  hin: { name: "Hinduismo" },
  bud: { name: "Budismo" },
} as const;
type RK = keyof typeof R;
const RKEYS = Object.keys(R) as RK[];

const flipText: Record<RK, ReactNode> = {
  cri: <>Cree en <b>un solo Dios</b> y afirma que <b>Jesús es el Hijo de Dios</b>, el Mesías y Salvador. Su <b>muerte y resurrección</b> son centrales para la fe cristiana. La salvación se recibe <b>por gracia</b> mediante la fe en Cristo.</>,
  isl: <>Cree en <b>un solo Dios</b> y considera a <b>Mahoma</b> como su último profeta. Jesús es considerado <b>un profeta</b>, pero no Dios ni Hijo de Dios. El <b>Corán</b> es su texto sagrado central.</>,
  jud: <>Cree en <b>un solo Dios</b> y reconoce las <b>Escrituras hebreas</b>. <b>Espera al Mesías</b> y no reconoce a Jesús como el Mesías ni como Hijo de Dios.</>,
  hin: <>Es una <b>tradición diversa</b> con distintas concepciones de lo divino. En muchas de sus corrientes son importantes conceptos como el <b>karma</b>, la <b>reencarnación</b> y la liberación del ciclo de renacimientos.</>,
  bud: <>Se centra en comprender y <b>superar el sufrimiento</b> mediante enseñanzas como las <b>Cuatro Nobles Verdades</b> y el <b>Noble Camino Óctuple</b>. No se basa en la adoración de un Dios creador como elemento central.</>,
};

const STEPS = ["intro", "explore", "who", "noticed", "compare", "drag", "odd", "swipe", "quick", "final"] as const;

type Props = { onComplete: () => void; onNext: () => void; onExit: () => void };

export function ReligionsLesson({ onComplete, onNext, onExit }: Props) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const next = () => setI((x) => Math.min(x + 1, STEPS.length - 1));
  useEffect(() => {
    if (step === "final") onComplete();
    window.scrollTo({ top: 0 });
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps
  const testing = i >= 5 && i < 9;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-4 p-5">
        <button onClick={onExit} aria-label="Salir"><X className="size-7 text-muted-foreground" /></button>
        <ProgressBar value={(i / (STEPS.length - 1)) * 100} />
      </div>
      <div className="mx-auto w-full max-w-2xl px-5 text-xs font-extrabold uppercase tracking-widest text-flame">
        {step === "final" ? "Lección completada" : testing ? "Fase de prueba" : "Fase de aprendizaje"}
      </div>
      <div key={step} className="mx-auto w-full max-w-2xl flex-1 animate-pop px-5 pb-10 pt-3">
        {step === "intro" && <Intro onNext={next} />}
        {step === "explore" && <Explore onNext={next} />}
        {step === "who" && <Who onNext={next} />}
        {step === "noticed" && <Noticed onNext={next} />}
        {step === "compare" && <Compare onNext={next} />}
        {step === "drag" && <DragDrop onNext={next} />}
        {step === "odd" && <OddOne onNext={next} />}
        {step === "swipe" && <Swipe onNext={next} />}
        {step === "quick" && <Quick onNext={next} />}
        {step === "final" && <Final onNext={onNext} />}
      </div>
    </div>
  );
}

function Feedback({ ok, text }: { ok: boolean; text?: string | undefined }) {
  return (
    <div className={cn("mt-4 animate-pop rounded-2xl p-4 font-display text-lg font-bold", ok ? "bg-accent text-accent-foreground" : "bg-destructive/10 text-destructive")}>
      {ok ? "¡Correcto! 🎉" : "Casi…"} {text}
    </div>
  );
}

function Intro({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Fundamentos · Religiones</div>
      <h1 className="text-3xl font-black">¿Por qué el cristianismo?</h1>
      <div className="card-chunky mt-6 space-y-3 p-5 text-lg">
        <p>Muchas religiones hablan de Dios, espiritualidad, moralidad o de cómo vivir una buena vida. Pero no todas responden de la misma manera a preguntas fundamentales:</p>
        <ul className="space-y-2 font-bold">
          {["¿Quién es Dios?", "¿Qué está mal con la humanidad?", "¿Cómo podemos reconciliarnos con Dios?", "¿Qué ocurre después de la muerte?"].map((q) => (
            <li key={q} className="rounded-xl bg-primary/10 px-4 py-3 text-primary">{q}</li>
          ))}
        </ul>
        <p>Conocer estas diferencias nos ayuda a entender qué afirma realmente el cristianismo.</p>
      </div>
      <Button size="lg" className="mt-6 w-full" onClick={onNext}>Explorar religiones</Button>
    </div>
  );
}

function Explore({ onNext }: { onNext: () => void }) {
  const [seen, setSeen] = useState<Set<RK>>(new Set());
  const [open, setOpen] = useState<Set<RK>>(new Set());
  const toggle = (k: RK) => {
    setOpen((o) => { const n = new Set(o); n.has(k) ? n.delete(k) : n.add(k); return n; });
    setSeen((s) => new Set(s).add(k));
  };
  return (
    <div>
      <h2 className="text-2xl font-bold">Explora las religiones</h2>
      <p className="text-muted-foreground">Toca cada tarjeta para voltearla ({seen.size}/5)</p>
      <div className="mt-4 space-y-3">
        {RKEYS.map((k) => (
          <button key={k} onClick={() => toggle(k)} className="block w-full [perspective:1000px]">
            <div className={cn("relative min-h-64 transition-transform duration-500 [transform-style:preserve-3d]", open.has(k) && "[transform:rotateY(180deg)]")}>
              <div className="card-chunky absolute inset-0 flex items-center gap-4 p-5 [backface-visibility:hidden]">
                <ReligionBadge k={k} size="lg" />
                <span className="font-display text-2xl font-bold">{R[k].name}</span>
                {seen.has(k) && <Check className="ml-auto !size-6 text-primary" />}
              </div>
              <div className="card-chunky absolute inset-0 overflow-auto border-primary/30 bg-card p-5 text-left text-lg leading-relaxed [&_b]:font-extrabold [&_b]:text-primary [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="mb-2 flex items-center gap-2 font-display text-xl font-black"><ReligionBadge k={k} size="sm" /> {R[k].name}</div>
                {flipText[k]}
              </div>
            </div>
          </button>
        ))}
      </div>
      <Button size="lg" className="mt-6 w-full" disabled={seen.size < 5} onClick={onNext}>
        {seen.size < 5 ? `Explora ${5 - seen.size} más` : "Continuar"}
      </Button>
    </div>
  );
}

function ChoiceRounds({ title, rounds, onNext, doneText }: {
  title: string;
  rounds: { prompt: string; options: string[]; correct: number }[];
  onNext: () => void;
  doneText?: string;
}) {
  const [r, setR] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const round = rounds[r]!;
  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === round.correct;
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      if (r + 1 >= rounds.length) setDone(true);
      else { setR(r + 1); setPicked(null); }
    }, ok ? 800 : 1400);
  }
  if (done) {
    return (
      <div className="py-10 text-center">
        <div className="text-6xl animate-pop">🔥</div>
        <h2 className="mt-3 text-3xl font-bold">{doneText ?? `${score}/${rounds.length} — ¡Ronda completada!`}</h2>
        <Button size="lg" className="mt-6 w-full" onClick={onNext}>Continuar</Button>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="text-sm font-bold text-muted-foreground">{r + 1} de {rounds.length}</div>
      <div key={r} className="animate-pop">
        <div className="card-chunky mt-4 p-6 text-center font-display text-2xl font-bold">{round.prompt}</div>
        <div className="mt-4 grid gap-3">
          {round.options.map((o, i) => (
            <button
              key={o}
              onClick={() => pick(i)}
              className={cn(
                "card-chunky p-4 text-lg font-bold transition-all active:translate-y-1",
                picked !== null && i === round.correct && "border-primary bg-accent text-accent-foreground",
                picked === i && i !== round.correct && "border-destructive bg-destructive/10 text-destructive",
              )}
            >
              {o}
            </button>
          ))}
        </div>
        {picked !== null && <Feedback ok={picked === round.correct} text={picked !== round.correct ? `Era ${round.options[round.correct]}.` : undefined} />}
      </div>
    </div>
  );
}

function Who({ onNext }: { onNext: () => void }) {
  return (
    <ChoiceRounds
      title="¿Quién enseña esto?"
      onNext={onNext}
      doneText="¡Muy bien! Sigamos"
      rounds={[
        { prompt: "“Jesús es el Hijo de Dios, el Mesías y Salvador.”", options: ["Islam", "Cristianismo", "Budismo"], correct: 1 },
        { prompt: "“Mahoma es considerado el último profeta.”", options: ["Islam", "Judaísmo", "Cristianismo"], correct: 0 },
        { prompt: "“El Noble Camino Óctuple forma parte de sus enseñanzas.”", options: ["Hinduismo", "Budismo", "Judaísmo"], correct: 1 },
        { prompt: "“La Torá ocupa un lugar central en esta tradición.”", options: ["Judaísmo", "Islam", "Budismo"], correct: 0 },
      ]}
    />
  );
}

function Noticed({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <h2 className="text-3xl font-bold">¿Notaste algo? 🤔</h2>
      <div className="card-chunky mt-6 space-y-3 p-5 text-lg">
        <p>Estas religiones pueden compartir algunas ideas sobre la moral, la espiritualidad o la importancia de vivir correctamente.</p>
        <p className="font-bold">Pero sus respuestas a preguntas fundamentales son diferentes.</p>
        <p>Especialmente cuando hablamos de <span className="font-bold text-flame">quién es Jesús</span> y cómo podemos ser reconciliados con Dios.</p>
      </div>
      <Button size="lg" className="mt-6 w-full" onClick={onNext}>Continuar</Button>
    </div>
  );
}

const compareRows: { label: string; key: string; highlight?: boolean; vals: Record<RK, string> }[] = [
  { label: "Dios", key: "dios", vals: { cri: "Un solo Dios: Padre, Hijo y Espíritu Santo.", isl: "Un solo Dios (Alá).", jud: "Un solo Dios.", hin: "Diversas concepciones de lo divino.", bud: "No se centra en un Dios creador." } },
  { label: "Jesús", key: "jesus", highlight: true, vals: { cri: "Jesús es el Hijo de Dios, Mesías y Salvador.", isl: "Jesús es profeta, pero no Dios ni Hijo de Dios.", jud: "No reconoce a Jesús como el Mesías.", hin: "Jesús no ocupa un lugar central único y existen distintas interpretaciones.", bud: "Jesús no ocupa un lugar central dentro de la tradición." } },
  { label: "Salvación / liberación", key: "salv", vals: { cri: "Por gracia, mediante la fe en Cristo.", isl: "Sumisión a Dios y buenas obras.", jud: "Fidelidad al pacto y a la Ley.", hin: "Liberación del ciclo de renacimientos (moksha).", bud: "Liberación del sufrimiento (nirvana)." } },
  { label: "Después de la muerte", key: "muerte", vals: { cri: "Vida eterna con Dios por la resurrección.", isl: "Juicio final: paraíso o castigo.", jud: "Diversas perspectivas; esperanza en Dios.", hin: "Reencarnación según el karma.", bud: "Renacimiento hasta alcanzar el nirvana." } },
];

function Compare({ onNext }: { onNext: () => void }) {
  const [tab, setTab] = useState("jesus");
  const row = compareRows.find((r) => r.key === tab)!;
  return (
    <div>
      <h2 className="text-3xl font-bold">Ahora comparemos</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {compareRows.map((r) => (
          <button
            key={r.key}
            onClick={() => setTab(r.key)}
            className={cn("rounded-xl border-2 px-3 py-2 text-sm font-extrabold", tab === r.key && (r.highlight ? "border-flame bg-flame text-primary-foreground" : "border-secondary bg-secondary/10 text-secondary"))}
          >
            {r.highlight && "⭐ "}{r.label}
          </button>
        ))}
      </div>
      <div key={tab} className="mt-4 space-y-2">
        {RKEYS.map((k, idx) => (
          <div
            key={k}
            className={cn("card-chunky flex animate-pop items-start gap-3 p-4", row.highlight && k === "cri" && "border-flame bg-flame/10")}
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <ReligionBadge k={k} />
            <div>
              <div className="text-xs font-extrabold uppercase text-muted-foreground">{R[k].name}</div>
              <div className="font-bold">{row.vals[k]}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl bg-muted p-4 font-bold">
        Las religiones pueden compartir algunas ideas, pero hacen afirmaciones diferentes sobre Dios, Jesús y la salvación.
      </div>
      <Button size="lg" className="mt-6 w-full" onClick={onNext}>Poner a prueba lo aprendido</Button>
    </div>
  );
}

const dragItems: { label: string; to: RK }[] = [
  { label: "Corán", to: "isl" }, { label: "Torá", to: "jud" }, { label: "Gracia", to: "cri" },
  { label: "Noble Camino Óctuple", to: "bud" }, { label: "Reencarnación", to: "hin" },
  { label: "Resurrección de Jesús", to: "cri" }, { label: "Mahoma", to: "isl" }, { label: "Buda", to: "bud" },
];

function DragDrop({ onNext }: { onNext: () => void }) {
  const [placed, setPlaced] = useState<Record<string, RK>>({});
  const [drag, setDrag] = useState<{ label: string; x: number; y: number } | null>(null);
  const [hover, setHover] = useState<RK | null>(null);
  const [flash, setFlash] = useState<{ zone: RK; ok: boolean } | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const zoneRefs = useRef<Partial<Record<RK, HTMLDivElement | null>>>({});
  const remaining = dragItems.filter((d) => !placed[d.label]);

  // Hit-test against the real on-screen box of each zone, slightly enlarged for touch.
  function zoneAt(x: number, y: number): RK | null {
    const PAD = 14;
    for (const k of RKEYS) {
      const el = zoneRefs.current[k];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left - PAD && x <= r.right + PAD && y >= r.top - PAD && y <= r.bottom + PAD) return k;
    }
    return null;
  }

  useEffect(() => {
    if (!drag) return;
    const label = drag.label;
    const move = (e: PointerEvent) => {
      e.preventDefault();
      setDrag({ label, x: e.clientX, y: e.clientY });
      setHover(zoneAt(e.clientX, e.clientY));
    };
    const up = (e: PointerEvent) => {
      const zone = zoneAt(e.clientX, e.clientY);
      const item = dragItems.find((d) => d.label === label)!;
      if (zone) {
        const ok = zone === item.to;
        setFlash({ zone, ok });
        setTimeout(() => setFlash(null), 600);
        if (ok) { setPlaced((p) => ({ ...p, [item.label]: zone })); setMsg({ ok: true, text: `${item.label} → ${R[zone].name}` }); }
        else setMsg({ ok: false, text: `${item.label} no va en ${R[zone].name}. ¡Intenta otra vez!` });
      }
      setDrag(null);
      setHover(null);
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [drag?.label]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="select-none">
      <h2 className="text-2xl font-bold">Ponlo en su lugar</h2>
      <p className="text-muted-foreground">Arrastra cada concepto a la religión correspondiente.</p>
      <div className="mt-4 flex min-h-16 flex-wrap gap-2">
        {remaining.map((d) => (
          <div
            key={d.label}
            data-testid="drag-item"
            onPointerDown={(e) => { e.preventDefault(); setDrag({ label: d.label, x: e.clientX, y: e.clientY }); }}
            className={cn("cursor-grab touch-none rounded-full border-2 border-primary bg-card px-4 py-2 font-bold text-primary", drag?.label === d.label && "opacity-30")}
          >
            {d.label}
          </div>
        ))}
        {remaining.length === 0 && <div className="font-display text-xl font-bold text-primary">¡Todo en su lugar!</div>}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {RKEYS.map((k) => (
          <div
            key={k}
            ref={(el) => { zoneRefs.current[k] = el; }}
            data-zone={k}
            className={cn(
              "card-chunky min-h-28 p-3 transition-all",
              hover === k && "scale-[1.03] border-primary bg-primary/5",
              flash?.zone === k && (flash.ok ? "border-green bg-accent" : "border-destructive bg-destructive/10"),
            )}
          >
            <div className="flex items-center gap-2 font-display font-bold"><ReligionBadge k={k} size="sm" /> {R[k].name}</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {Object.entries(placed).filter(([, z]) => z === k).map(([l]) => (
                <span key={l} className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">{l}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {drag && typeof document !== "undefined" && createPortal(
        <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rotate-3 rounded-full border-2 border-primary bg-card px-4 py-2 font-bold text-primary shadow-xl" style={{ left: drag.x, top: drag.y }}>
          {drag.label}
        </div>,
        document.body,
      )}
      {msg && <Feedback ok={msg.ok} text={msg.text} />}
      <Button size="lg" className="mt-6 w-full" disabled={remaining.length > 0} onClick={onNext}>Continuar</Button>
    </div>
  );
}


function Quick({ onNext }: { onNext: () => void }) {
  return (
    <ChoiceRounds
      title="🔥 Ronda rápida"
      onNext={onNext}
      rounds={[
        { prompt: "CORÁN", options: ["Cristianismo", "Islam", "Judaísmo"], correct: 1 },
        { prompt: "GRACIA", options: ["Cristianismo", "Hinduismo", "Budismo"], correct: 0 },
        { prompt: "NOBLE CAMINO ÓCTUPLE", options: ["Islam", "Budismo", "Judaísmo"], correct: 1 },
        { prompt: "TORÁ", options: ["Judaísmo", "Cristianismo", "Islam"], correct: 0 },
      ]}
    />
  );
}

function Final({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-black">¿Qué descubriste?</h2>
      <div className="mt-6 space-y-4 rounded-3xl bg-card p-6 text-left text-lg leading-relaxed shadow-[var(--shadow-soft)]">
        <p>El cristianismo no se sostiene simplemente en una serie de enseñanzas o reglas. Se sostiene en una persona: <b className="font-black text-primary">Jesucristo</b>.</p>
        <p>Mientras otras religiones pueden reconocer a Jesús como profeta, maestro o figura espiritual, el cristianismo afirma algo mucho más radical:</p>
      </div>
      <div className="mt-4 animate-pop rounded-3xl bg-primary p-6 text-primary-foreground">
        <ReligionBadge k="cri" size="lg" />
        <p className="mt-3 text-2xl font-black leading-snug">Jesús es el Hijo de Dios, el Salvador y el único camino hacia el Padre.</p>
      </div>
      <p className="mt-6 text-lg">Por eso, entender el cristianismo comienza con una pregunta fundamental:</p>
      <p className="mt-3 text-4xl font-black text-secondary">¿Quién es Jesús para ti?</p>
      <div className="mt-6 font-extrabold text-gold">+20 XP</div>
      <Button size="lg" className="mt-4 w-full" onClick={onNext}>Siguiente lección →</Button>
    </div>
  );
}
