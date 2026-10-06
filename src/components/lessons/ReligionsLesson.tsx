import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/AppShell";
import { cn } from "@/lib/utils";

const R = {
  cri: { name: "Cristianismo", emoji: "✝️" },
  isl: { name: "Islam", emoji: "☪️" },
  jud: { name: "Judaísmo", emoji: "✡️" },
  hin: { name: "Hinduismo", emoji: "🕉️" },
  bud: { name: "Budismo", emoji: "☸️" },
} as const;
type RK = keyof typeof R;
const RKEYS = Object.keys(R) as RK[];

const flipText: Record<RK, string> = {
  cri: "Cree en un solo Dios y afirma que Jesús es el Hijo de Dios, el Mesías y Salvador. Su muerte y resurrección son centrales para la fe cristiana. La salvación se recibe por gracia mediante la fe en Cristo.",
  isl: "Cree en un solo Dios y considera a Mahoma como su último profeta. Jesús es considerado un profeta, pero no Dios ni Hijo de Dios. El Corán es su texto sagrado central.",
  jud: "Cree en un solo Dios y reconoce las Escrituras hebreas. Espera al Mesías y no reconoce a Jesús como el Mesías ni como Hijo de Dios.",
  hin: "Es una tradición diversa con distintas concepciones de lo divino. En muchas de sus corrientes son importantes conceptos como el karma, la reencarnación y la liberación del ciclo de renacimientos.",
  bud: "Se centra en comprender y superar el sufrimiento mediante enseñanzas como las Cuatro Nobles Verdades y el Noble Camino Óctuple. No se basa en la adoración de un Dios creador como elemento central.",
};

const STEPS = ["intro", "explore", "who", "noticed", "compare", "drag", "odd", "swipe", "memory", "quick", "final"] as const;

type Props = { onComplete: () => void; onNext: () => void; onExit: () => void };

export function ReligionsLesson({ onComplete, onNext, onExit }: Props) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const next = () => setI((x) => Math.min(x + 1, STEPS.length - 1));
  useEffect(() => {
    if (step === "final") onComplete();
    window.scrollTo({ top: 0 });
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps
  const testing = i >= 5 && i < 10;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-4 p-5">
        <button onClick={onExit} aria-label="Salir"><X className="size-7 text-muted-foreground" /></button>
        <ProgressBar value={(i / (STEPS.length - 1)) * 100} />
      </div>
      <div className="mx-auto w-full max-w-2xl px-5 text-xs font-extrabold uppercase tracking-widest text-flame">
        {step === "final" ? "Lección completada" : testing ? "🔥 Fase de prueba" : "📖 Fase de aprendizaje"}
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
        {step === "memory" && <Memory onNext={next} />}
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
      <h1 className="text-3xl font-bold">¿Todas las religiones creen lo mismo?</h1>
      <div className="card-chunky mt-6 space-y-3 p-5 text-lg">
        <p>Muchas religiones hablan de Dios, espiritualidad, moralidad o de cómo vivir una buena vida. Pero no todas responden de la misma manera a preguntas fundamentales:</p>
        <ul className="space-y-2 font-bold">
          {["¿Quién es Dios?", "¿Qué está mal con la humanidad?", "¿Cómo podemos reconciliarnos con Dios?", "¿Qué ocurre después de la muerte?"].map((q) => (
            <li key={q} className="rounded-xl bg-muted px-3 py-2">❓ {q}</li>
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
            <div className={cn("relative min-h-36 transition-transform duration-500 [transform-style:preserve-3d]", open.has(k) && "[transform:rotateY(180deg)]")}>
              <div className="card-chunky absolute inset-0 flex items-center gap-4 p-5 [backface-visibility:hidden]">
                <span className="text-5xl">{R[k].emoji}</span>
                <span className="font-display text-2xl font-bold">{R[k].name}</span>
                {seen.has(k) && <Check className="ml-auto !size-6 text-primary" />}
              </div>
              <div className="card-chunky absolute inset-0 overflow-auto border-secondary bg-secondary/10 p-4 text-left text-sm font-semibold [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="mb-1 font-display font-bold text-secondary">{R[k].emoji} {R[k].name}</div>
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
            <span className="text-3xl">{R[k].emoji}</span>
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
  const [flash, setFlash] = useState<{ zone: RK; ok: boolean } | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const remaining = dragItems.filter((d) => !placed[d.label]);

  function start(e: RPointerEvent, label: string) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ label, x: e.clientX, y: e.clientY });
  }
  function move(e: RPointerEvent) {
    if (drag) setDrag({ ...drag, x: e.clientX, y: e.clientY });
  }
  function end(e: RPointerEvent) {
    if (!drag) return;
    const el = document.elementsFromPoint(e.clientX, e.clientY).find((n) => (n as HTMLElement).dataset?.zone);
    const zone = (el as HTMLElement | undefined)?.dataset.zone as RK | undefined;
    const item = dragItems.find((d) => d.label === drag.label)!;
    if (zone) {
      const ok = zone === item.to;
      setFlash({ zone, ok });
      setTimeout(() => setFlash(null), 600);
      if (ok) { setPlaced((p) => ({ ...p, [item.label]: zone })); setMsg({ ok: true, text: `${item.label} → ${R[zone].name}` }); }
      else setMsg({ ok: false, text: `${item.label} no va en ${R[zone].name}. ¡Intenta otra vez!` });
    }
    setDrag(null);
  }

  return (
    <div onPointerMove={move} onPointerUp={end} className="touch-none select-none">
      <h2 className="text-2xl font-bold">Ponlo en su lugar</h2>
      <p className="text-muted-foreground">Arrastra cada concepto a la religión correspondiente.</p>
      <div className="mt-4 flex min-h-16 flex-wrap gap-2">
        {remaining.map((d) => (
          <div
            key={d.label}
            onPointerDown={(e) => start(e, d.label)}
            className={cn("cursor-grab rounded-xl border-2 border-b-4 border-secondary bg-card px-3 py-2 font-bold text-secondary", drag?.label === d.label && "opacity-30")}
          >
            {d.label}
          </div>
        ))}
        {remaining.length === 0 && <div className="font-display text-xl font-bold text-primary">🔥 ¡Todo en su lugar!</div>}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {RKEYS.map((k) => (
          <div
            key={k}
            data-zone={k}
            className={cn(
              "card-chunky min-h-28 p-3 transition-colors",
              flash?.zone === k && (flash.ok ? "border-primary bg-accent" : "border-destructive bg-destructive/10 animate-pulse"),
            )}
          >
            <div data-zone={k} className="font-display font-bold">{R[k].emoji} {R[k].name}</div>
            <div data-zone={k} className="mt-2 flex flex-wrap gap-1">
              {Object.entries(placed).filter(([, z]) => z === k).map(([l]) => (
                <span key={l} data-zone={k} className="rounded-lg bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">{l}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {drag && (
        <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rotate-3 rounded-xl border-2 border-b-4 border-secondary bg-card px-3 py-2 font-bold text-secondary shadow-xl" style={{ left: drag.x, top: drag.y }}>
          {drag.label}
        </div>
      )}
      {msg && <Feedback ok={msg.ok} text={msg.text} />}
      <Button size="lg" className="mt-6 w-full" disabled={remaining.length > 0} onClick={onNext}>Continuar</Button>
    </div>
  );
}

function OddOne({ onNext }: { onNext: () => void }) {
  return (
    <ChoiceRounds
      title="¿Cuál no pertenece?"
      onNext={onNext}
      doneText="¡Excelente ojo! 👀"
      rounds={[
        { prompt: "¿Cuál NO pertenece al cristianismo?", options: ["Jesús", "Gracia", "Resurrección", "Karma"], correct: 3 },
        { prompt: "¿Cuál NO pertenece al budismo?", options: ["Buda", "Noble Camino Óctuple", "Cuatro Nobles Verdades", "Cruz"], correct: 3 },
        { prompt: "¿Cuál NO pertenece al Islam?", options: ["Corán", "Mahoma", "Cinco pilares", "Torá"], correct: 3 },
      ]}
    />
  );
}

const swipeRounds: { card: string; left: RK; right: RK; correct: "left" | "right" }[] = [
  { card: "Corán", left: "cri", right: "isl", correct: "right" },
  { card: "Noble Camino Óctuple", left: "hin", right: "bud", correct: "right" },
  { card: "Torá", left: "isl", right: "jud", correct: "right" },
  { card: "Resurrección de Jesús", left: "isl", right: "cri", correct: "right" },
];

function Swipe({ onNext }: { onNext: () => void }) {
  const [r, setR] = useState(0);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<{ ok: boolean } | null>(null);
  const [fly, setFly] = useState<0 | 1 | -1>(0);
  const startX = useRef(0);
  const done = r >= swipeRounds.length;
  const round = swipeRounds[Math.min(r, swipeRounds.length - 1)]!;

  function down(e: RPointerEvent) {
    if (result) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    setDragging(true);
  }
  function move(e: RPointerEvent) { if (dragging) setDx(e.clientX - startX.current); }
  function up() {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(dx) < 90) { setDx(0); return; }
    const side = dx > 0 ? "right" : "left";
    const ok = side === round.correct;
    setResult({ ok });
    if (ok) {
      setFly(dx > 0 ? 1 : -1);
      setTimeout(() => { setR(r + 1); setDx(0); setFly(0); setResult(null); }, 900);
    } else {
      setDx(0);
      setTimeout(() => setResult(null), 1100);
    }
  }

  if (done) {
    return (
      <div className="py-10 text-center">
        <div className="animate-pop text-6xl">👏</div>
        <h2 className="mt-3 text-3xl font-bold">¡Deslizaste todo bien!</h2>
        <Button size="lg" className="mt-6 w-full" onClick={onNext}>Continuar</Button>
      </div>
    );
  }
  const x = fly ? fly * 600 : dx;
  return (
    <div className="select-none">
      <h2 className="text-2xl font-bold">Desliza hacia la religión correcta</h2>
      <p className="text-muted-foreground">Desliza la tarjeta hacia la opción correcta. ({r + 1}/{swipeRounds.length})</p>
      <div className="mt-6 flex justify-between font-display text-lg font-bold">
        <span className={cn("rounded-xl border-2 px-3 py-2 transition-all", dx < -40 && "border-secondary bg-secondary/10 text-secondary")}>← {R[round.left].emoji} {R[round.left].name}</span>
        <span className={cn("rounded-xl border-2 px-3 py-2 transition-all", dx > 40 && "border-secondary bg-secondary/10 text-secondary")}>{R[round.right].emoji} {R[round.right].name} →</span>
      </div>
      <div className="relative mt-8 flex h-64 items-center justify-center overflow-hidden">
        <div
          key={r}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          className={cn("card-chunky flex h-56 w-64 cursor-grab touch-none items-center justify-center p-6 text-center font-display text-3xl font-bold animate-pop", result && (result.ok ? "border-primary bg-accent" : "border-destructive bg-destructive/10"))}
          style={{ transform: `translateX(${x}px) rotate(${x / 15}deg)`, transition: dragging ? "none" : "transform 0.4s cubic-bezier(.2,.9,.3,1.2)" }}
        >
          {round.card}
        </div>
      </div>
      {result && <Feedback ok={result.ok} text={result.ok ? undefined : "Intenta hacia el otro lado."} />}
    </div>
  );
}

const memPairs: [string, string][] = [["Corán", "Islam"], ["Torá", "Judaísmo"], ["Gracia", "Cristianismo"], ["Noble Camino Óctuple", "Budismo"]];

function Memory({ onNext }: { onNext: () => void }) {
  const [cards] = useState(() =>
    memPairs.flatMap(([a, b], p) => [{ id: `${p}a`, text: a, pair: p }, { id: `${p}b`, text: b, pair: p }]).sort(() => Math.random() - 0.5),
  );
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [msg, setMsg] = useState<boolean | null>(null);
  const done = matched.size === memPairs.length;

  function flip(id: string) {
    if (open.length === 2 || open.includes(id)) return;
    const card = cards.find((c) => c.id === id)!;
    if (matched.has(card.pair)) return;
    const o = [...open, id];
    setOpen(o);
    if (o.length === 2) {
      const [a, b] = o.map((x) => cards.find((c) => c.id === x)!);
      if (a.pair === b.pair) {
        setMsg(true);
        setTimeout(() => { setMatched((m) => new Set(m).add(a.pair)); setOpen([]); }, 400);
      } else {
        setMsg(false);
        setTimeout(() => setOpen([]), 900);
      }
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Encuentra las parejas</h2>
      <p className="text-muted-foreground">Voltea dos tarjetas a la vez.</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => {
          const shown = open.includes(c.id) || matched.has(c.pair);
          return (
            <button key={c.id} onClick={() => flip(c.id)} className="h-28 [perspective:800px]">
              <div className={cn("relative h-full transition-transform duration-500 [transform-style:preserve-3d]", shown && "[transform:rotateY(180deg)]")}>
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl border-b-4 border-secondary-shade bg-secondary text-4xl [backface-visibility:hidden]">🔥</div>
                <div className={cn("card-chunky absolute inset-0 flex items-center justify-center p-2 text-center font-bold [backface-visibility:hidden] [transform:rotateY(180deg)]", matched.has(c.pair) && "border-primary bg-accent text-accent-foreground")}>
                  {c.text}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {done ? (
        <>
          <div className="mt-6 animate-pop text-center font-display text-3xl font-bold text-flame">🔥 ¡Encontraste todas!</div>
          <Button size="lg" className="mt-6 w-full" onClick={onNext}>Continuar</Button>
        </>
      ) : msg !== null && open.length === 2 && <Feedback ok={msg} text={msg ? "¡Es pareja!" : "No son pareja."} />}
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
      <div className="animate-pop text-7xl">🔥</div>
      <h2 className="mt-3 text-3xl font-bold">¿Qué descubriste?</h2>
      <div className="card-chunky mt-6 space-y-3 p-5 text-left text-lg">
        <p>Las religiones pueden compartir algunas ideas, pero no todas creen lo mismo.</p>
        <p>Sus respuestas sobre Dios, Jesús, la salvación y la vida después de la muerte pueden ser muy diferentes.</p>
        <p>Por eso, entender el cristianismo también significa preguntarnos:</p>
        <p className="font-display text-2xl font-bold text-flame">¿Quién es Jesús realmente?</p>
      </div>
      <div className="mt-4 font-extrabold text-gold">+20 XP</div>
      <Button size="lg" className="mt-6 w-full" onClick={onNext}>Siguiente lección →</Button>
    </div>
  );
}
