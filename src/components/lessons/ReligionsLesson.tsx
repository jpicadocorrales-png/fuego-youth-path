import { useEffect, useRef, useState, type ReactNode } from "react";
import { Test as OddOne, Discard as Swipe } from "./ReligionsGames";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/AppShell";
import { createPortal } from "react-dom";
import { useLang, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ReligionBadge } from "./ReligionIcons";

const R: Record<Lang, Record<"cri" | "isl" | "jud" | "hin" | "bud", { name: string }>> = {
  es: {
    cri: { name: "Cristianismo" },
    isl: { name: "Islam" },
    jud: { name: "Judaísmo" },
    hin: { name: "Hinduismo" },
    bud: { name: "Budismo" },
  },
  en: {
    cri: { name: "Christianity" },
    isl: { name: "Islam" },
    jud: { name: "Judaism" },
    hin: { name: "Hinduism" },
    bud: { name: "Buddhism" },
  },
};
type RK = keyof (typeof R)["es"];
const RKEYS = Object.keys(R.es) as RK[];

const flipText: Record<Lang, Record<RK, ReactNode>> = {
  es: {
    cri: <>Cree en <b>un solo Dios</b> y afirma que <b>Jesús es el Hijo de Dios</b>, el Mesías y Salvador. Su <b>muerte y resurrección</b> son centrales para la fe cristiana. La salvación se recibe <b>por gracia</b> mediante la fe en Cristo.</>,
    isl: <>Cree en <b>un solo Dios</b> y considera a <b>Mahoma</b> como su último profeta. Jesús es considerado <b>un profeta</b>, pero no Dios ni Hijo de Dios. El <b>Corán</b> es su texto sagrado central.</>,
    jud: <>Cree en <b>un solo Dios</b> y reconoce las <b>Escrituras hebreas</b>. <b>Espera al Mesías</b> y no reconoce a Jesús como el Mesías ni como Hijo de Dios.</>,
    hin: <>Es una <b>tradición diversa</b> con distintas concepciones de lo divino. En muchas de sus corrientes son importantes conceptos como el <b>karma</b>, la <b>reencarnación</b> y la liberación del ciclo de renacimientos.</>,
    bud: <>Se centra en comprender y <b>superar el sufrimiento</b> mediante enseñanzas como las <b>Cuatro Nobles Verdades</b> y el <b>Noble Camino Óctuple</b>. No se basa en la adoración de un Dios creador como elemento central.</>,
  },
  en: {
    cri: <>Believes in <b>one God</b> and affirms that <b>Jesus is the Son of God</b>, the Messiah and Savior. His <b>death and resurrection</b> are central to the Christian faith. Salvation is received <b>by grace</b> through faith in Christ.</>,
    isl: <>Believes in <b>one God</b> and regards <b>Muhammad</b> as the final prophet. Jesus is considered <b>a prophet</b>, but not God or the Son of God. The <b>Quran</b> is its central sacred text.</>,
    jud: <>Believes in <b>one God</b> and holds to the <b>Hebrew Scriptures</b>. It <b>awaits the Messiah</b> and does not recognize Jesus as the Messiah or as the Son of God.</>,
    hin: <>A <b>diverse tradition</b> with different understandings of the divine. Many of its branches emphasize ideas such as <b>karma</b>, <b>reincarnation</b> and liberation from the cycle of rebirth.</>,
    bud: <>Focuses on understanding and <b>overcoming suffering</b> through teachings such as the <b>Four Noble Truths</b> and the <b>Noble Eightfold Path</b>. Worship of a creator God is not a central element.</>,
  },
};

const STEPS = ["intro", "explore", "who", "noticed", "compare", "drag", "odd", "swipe", "final"] as const;

type Props = { onComplete: () => void; onNext: () => void; onExit: () => void };

export function ReligionsLesson({ onComplete, onNext, onExit }: Props) {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const next = () => setI((x) => Math.min(x + 1, STEPS.length - 1));
  useEffect(() => {
    if (step === "final") onComplete();
    window.scrollTo({ top: 0 });
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps
  const testing = i >= 5 && i < 8;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-4 p-5">
        <button onClick={() => (i > 0 ? setI(i - 1) : onExit())} aria-label={t("Atrás", "Back")}><ArrowLeft className="size-7 text-muted-foreground" /></button>
        <ProgressBar value={(i / (STEPS.length - 1)) * 100} />
        <button onClick={onExit} aria-label={t("Salir", "Exit")}><X className="size-7 text-muted-foreground" /></button>
      </div>
      <div className="mx-auto w-full max-w-2xl px-5 text-xs font-extrabold uppercase tracking-widest text-flame">
        {step === "final"
          ? t("Lección completada", "Lesson complete")
          : testing
            ? t("Fase de prueba", "Practice phase")
            : t("Fase de aprendizaje", "Learning phase")}
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
        {step === "final" && <Final onNext={onNext} />}
      </div>
    </div>
  );
}

function Feedback({ ok, text }: { ok: boolean; text?: string | undefined }) {
  const { t } = useLang();
  return (
    <div className={cn("mt-4 animate-pop rounded-2xl p-4 font-display text-lg font-bold", ok ? "bg-accent text-accent-foreground" : "bg-destructive/10 text-destructive")}>
      {ok ? t("¡Correcto! 🎉", "Correct! 🎉") : t("Casi…", "Almost…")} {text}
    </div>
  );
}

function Intro({ onNext }: { onNext: () => void }) {
  const { t } = useLang();
  const questions = t(
    ["¿Quién es Dios?", "¿Qué está mal con la humanidad?", "¿Cómo podemos reconciliarnos con Dios?", "¿Qué ocurre después de la muerte?"],
    ["Who is God?", "What is wrong with humanity?", "How can we be reconciled with God?", "What happens after death?"],
  );
  return (
    <div>
      <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">{t("Fundamentos · Religiones", "Foundations · Religions")}</div>
      <h1 className="text-3xl font-black">{t("¿Por qué el cristianismo?", "Why Christianity?")}</h1>
      <div className="card-chunky mt-6 space-y-3 p-5 text-lg">
        <p>
          {t(
            "Muchas religiones hablan de Dios, espiritualidad, moralidad o de cómo vivir una buena vida. Pero no todas responden de la misma manera a preguntas fundamentales:",
            "Many religions talk about God, spirituality, morality or how to live a good life. But they don't all answer the fundamental questions the same way:",
          )}
        </p>
        <ul className="space-y-2 font-bold">
          {questions.map((q) => (
            <li key={q} className="rounded-xl bg-primary/10 px-4 py-3 text-primary">{q}</li>
          ))}
        </ul>
        <p>
          {t(
            "Conocer estas diferencias nos ayuda a entender qué afirma realmente el cristianismo.",
            "Knowing these differences helps us understand what Christianity really claims.",
          )}
        </p>
      </div>
      <Button size="lg" className="mt-6 w-full" onClick={onNext}>{t("Explorar religiones", "Explore religions")}</Button>
    </div>
  );
}

function Explore({ onNext }: { onNext: () => void }) {
  const { lang, t } = useLang();
  const [seen, setSeen] = useState<Set<RK>>(new Set());
  const [open, setOpen] = useState<Set<RK>>(new Set());
  const toggle = (k: RK) => {
    setOpen((o) => { const n = new Set(o); n.has(k) ? n.delete(k) : n.add(k); return n; });
    setSeen((s) => new Set(s).add(k));
  };
  return (
    <div>
      <h2 className="text-2xl font-bold">{t("Explora las religiones", "Explore the religions")}</h2>
      <p className="text-muted-foreground">{t("Toca cada tarjeta para voltearla", "Tap each card to flip it")} ({seen.size}/5)</p>
      <div className="mt-4 space-y-3">
        {RKEYS.map((k) => (
          <button key={k} onClick={() => toggle(k)} className="block w-full [perspective:1000px]">
            <div className={cn("relative min-h-64 transition-transform duration-500 [transform-style:preserve-3d]", open.has(k) && "[transform:rotateY(180deg)]")}>
              <div className="card-chunky absolute inset-0 flex items-center gap-4 p-5 [backface-visibility:hidden]">
                <ReligionBadge k={k} size="lg" />
                <span className="font-display text-2xl font-bold">{R[lang][k].name}</span>
                {seen.has(k) && <Check className="ml-auto !size-6 text-primary" />}
              </div>
              <div className="card-chunky absolute inset-0 overflow-auto border-primary/30 bg-card p-5 text-left text-lg leading-relaxed [&_b]:font-extrabold [&_b]:text-primary [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="mb-2 flex items-center gap-2 font-display text-xl font-black"><ReligionBadge k={k} size="sm" /> {R[lang][k].name}</div>
                {flipText[lang][k]}
              </div>
            </div>
          </button>
        ))}
      </div>
      <Button size="lg" className="mt-6 w-full" disabled={seen.size < 5} onClick={onNext}>
        {seen.size < 5 ? t(`Explora ${5 - seen.size} más`, `Explore ${5 - seen.size} more`) : t("Continuar", "Continue")}
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
  const { t } = useLang();
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
        <h2 className="mt-3 text-3xl font-bold">{doneText ?? `${score}/${rounds.length} — ${t("¡Ronda completada!", "Round complete!")}`}</h2>
        <Button size="lg" className="mt-6 w-full" onClick={onNext}>{t("Continuar", "Continue")}</Button>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="text-sm font-bold text-muted-foreground">{r + 1} {t("de", "of")} {rounds.length}</div>
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
        {picked !== null && (
          <Feedback
            ok={picked === round.correct}
            text={picked !== round.correct ? t(`Era ${round.options[round.correct]}.`, `It was ${round.options[round.correct]}.`) : undefined}
          />
        )}
      </div>
    </div>
  );
}

function Who({ onNext }: { onNext: () => void }) {
  const { t } = useLang();
  return (
    <ChoiceRounds
      title={t("¿Quién enseña esto?", "Who teaches this?")}
      onNext={onNext}
      doneText={t("¡Muy bien! Sigamos", "Great job! Let's keep going")}
      rounds={t(
        [
          { prompt: "“Jesús es el Hijo de Dios, el Mesías y Salvador.”", options: ["Islam", "Cristianismo", "Budismo"], correct: 1 },
          { prompt: "“Mahoma es considerado el último profeta.”", options: ["Islam", "Judaísmo", "Cristianismo"], correct: 0 },
          { prompt: "“El Noble Camino Óctuple forma parte de sus enseñanzas.”", options: ["Hinduismo", "Budismo", "Judaísmo"], correct: 1 },
          { prompt: "“La Torá ocupa un lugar central en esta tradición.”", options: ["Judaísmo", "Islam", "Budismo"], correct: 0 },
        ],
        [
          { prompt: "“Jesus is the Son of God, the Messiah and Savior.”", options: ["Islam", "Christianity", "Buddhism"], correct: 1 },
          { prompt: "“Muhammad is regarded as the final prophet.”", options: ["Islam", "Judaism", "Christianity"], correct: 0 },
          { prompt: "“The Noble Eightfold Path is part of its teachings.”", options: ["Hinduism", "Buddhism", "Judaism"], correct: 1 },
          { prompt: "“The Torah holds a central place in this tradition.”", options: ["Judaism", "Islam", "Buddhism"], correct: 0 },
        ],
      )}
    />
  );
}

function Noticed({ onNext }: { onNext: () => void }) {
  const { t } = useLang();
  return (
    <div>
      <h2 className="text-3xl font-bold">{t("¿Notaste algo? 🤔", "Did you notice something? 🤔")}</h2>
      <div className="card-chunky mt-6 space-y-3 p-5 text-lg">
        <p>
          {t(
            "Estas religiones pueden compartir algunas ideas sobre la moral, la espiritualidad o la importancia de vivir correctamente.",
            "These religions may share some ideas about morality, spirituality or the importance of living rightly.",
          )}
        </p>
        <p className="font-bold">{t("Pero sus respuestas a preguntas fundamentales son diferentes.", "But their answers to the fundamental questions are different.")}</p>
        <p>
          {t("Especialmente cuando hablamos de ", "Especially when we talk about ")}
          <span className="font-bold text-flame">{t("quién es Jesús", "who Jesus is")}</span>
          {t(" y cómo podemos ser reconciliados con Dios.", " and how we can be reconciled with God.")}
        </p>
      </div>
      <Button size="lg" className="mt-6 w-full" onClick={onNext}>{t("Continuar", "Continue")}</Button>
    </div>
  );
}

type CompareRow = { label: string; key: string; highlight?: boolean; vals: Record<RK, string> };
const compareRows: Record<Lang, CompareRow[]> = {
  es: [
    { label: "Dios", key: "dios", vals: { cri: "Un solo Dios: Padre, Hijo y Espíritu Santo.", isl: "Un solo Dios (Alá).", jud: "Un solo Dios.", hin: "Diversas concepciones de lo divino.", bud: "No se centra en un Dios creador." } },
    { label: "Jesús", key: "jesus", highlight: true, vals: { cri: "Jesús es el Hijo de Dios, Mesías y Salvador.", isl: "Jesús es profeta, pero no Dios ni Hijo de Dios.", jud: "No reconoce a Jesús como el Mesías.", hin: "Jesús no ocupa un lugar central único y existen distintas interpretaciones.", bud: "Jesús no ocupa un lugar central dentro de la tradición." } },
    { label: "Salvación / liberación", key: "salv", vals: { cri: "Por gracia, mediante la fe en Cristo.", isl: "Sumisión a Dios y buenas obras.", jud: "Fidelidad al pacto y a la Ley.", hin: "Liberación del ciclo de renacimientos (moksha).", bud: "Liberación del sufrimiento (nirvana)." } },
    { label: "Después de la muerte", key: "muerte", vals: { cri: "Vida eterna con Dios por la resurrección.", isl: "Juicio final: paraíso o castigo.", jud: "Diversas perspectivas; esperanza en Dios.", hin: "Reencarnación según el karma.", bud: "Renacimiento hasta alcanzar el nirvana." } },
  ],
  en: [
    { label: "God", key: "dios", vals: { cri: "One God: Father, Son and Holy Spirit.", isl: "One God (Allah).", jud: "One God.", hin: "Different understandings of the divine.", bud: "Not centered on a creator God." } },
    { label: "Jesus", key: "jesus", highlight: true, vals: { cri: "Jesus is the Son of God, Messiah and Savior.", isl: "Jesus is a prophet, but not God or the Son of God.", jud: "Does not recognize Jesus as the Messiah.", hin: "Jesus has no unique central place, and interpretations vary.", bud: "Jesus has no central place in the tradition." } },
    { label: "Salvation / liberation", key: "salv", vals: { cri: "By grace, through faith in Christ.", isl: "Submission to God and good works.", jud: "Faithfulness to the covenant and the Law.", hin: "Liberation from the cycle of rebirth (moksha).", bud: "Liberation from suffering (nirvana)." } },
    { label: "After death", key: "muerte", vals: { cri: "Eternal life with God through the resurrection.", isl: "Final judgment: paradise or punishment.", jud: "Various views; hope in God.", hin: "Reincarnation according to karma.", bud: "Rebirth until reaching nirvana." } },
  ],
};

function Compare({ onNext }: { onNext: () => void }) {
  const { lang, t } = useLang();
  const rows = compareRows[lang];
  const [tab, setTab] = useState(rows[0]!.key);
  const [seen, setSeen] = useState<Set<string>>(() => new Set([rows[0]!.key]));
  const hint = rows.find((r) => !seen.has(r.key))?.key;
  const row = rows.find((r) => r.key === tab)!;
  return (
    <div>
      <h2 className="text-3xl font-bold">{t("Ahora comparemos", "Now let's compare")}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {rows.map((r) => (
          <button
            key={r.key}
            onClick={() => { setTab(r.key); setSeen((x) => new Set(x).add(r.key)); }}
            className={cn("rounded-xl border-2 px-3 py-2 text-sm font-extrabold", hint === r.key && "animate-floaty border-primary text-primary", tab === r.key && (r.highlight ? "border-flame bg-flame text-primary-foreground" : "border-secondary bg-secondary/10 text-secondary"))}
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
              <div className="text-xs font-extrabold uppercase text-muted-foreground">{R[lang][k].name}</div>
              <div className="font-bold">{row.vals[k]}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl bg-muted p-4 font-bold">
        {t(
          "Las religiones pueden compartir algunas ideas, pero hacen afirmaciones diferentes sobre Dios, Jesús y la salvación.",
          "Religions may share some ideas, but they make different claims about God, Jesus and salvation.",
        )}
      </div>
      <Button size="lg" className="mt-6 w-full" onClick={onNext}>{t("Poner a prueba lo aprendido", "Test what you learned")}</Button>
    </div>
  );
}

// Cada concepto tiene un id fijo para que cambiar de idioma a mitad de la actividad no pierda lo ya colocado.
const dragItems: { id: string; label: Record<Lang, string>; to: RK }[] = [
  { id: "coran", label: { es: "Corán", en: "Quran" }, to: "isl" },
  { id: "tora", label: { es: "Torá", en: "Torah" }, to: "jud" },
  { id: "gracia", label: { es: "Gracia", en: "Grace" }, to: "cri" },
  { id: "camino", label: { es: "Noble Camino Óctuple", en: "Noble Eightfold Path" }, to: "bud" },
  { id: "reencarnacion", label: { es: "Reencarnación", en: "Reincarnation" }, to: "hin" },
  { id: "resurreccion", label: { es: "Resurrección de Jesús", en: "Resurrection of Jesus" }, to: "cri" },
  { id: "mahoma", label: { es: "Mahoma", en: "Muhammad" }, to: "isl" },
  { id: "buda", label: { es: "Buda", en: "Buddha" }, to: "bud" },
];

function DragDrop({ onNext }: { onNext: () => void }) {
  const { lang, t } = useLang();
  const [placed, setPlaced] = useState<Record<string, RK>>({});
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [hover, setHover] = useState<RK | null>(null);
  const [flash, setFlash] = useState<{ zone: RK; ok: boolean } | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const zoneRefs = useRef<Partial<Record<RK, HTMLDivElement | null>>>({});
  const remaining = dragItems.filter((d) => !placed[d.id]);
  const labelOf = (id: string) => dragItems.find((d) => d.id === id)!.label[lang];

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
    const id = drag.id;
    const move = (e: PointerEvent) => {
      e.preventDefault();
      setDrag({ id, x: e.clientX, y: e.clientY });
      setHover(zoneAt(e.clientX, e.clientY));
    };
    const up = (e: PointerEvent) => {
      const zone = zoneAt(e.clientX, e.clientY);
      const item = dragItems.find((d) => d.id === id)!;
      if (zone) {
        const ok = zone === item.to;
        const label = item.label[lang];
        const religion = R[lang][zone].name;
        setFlash({ zone, ok });
        setTimeout(() => setFlash(null), 600);
        if (ok) {
          setPlaced((p) => ({ ...p, [item.id]: zone }));
          setMsg({ ok: true, text: `${label} → ${religion}` });
        } else {
          setMsg({ ok: false, text: t(`${label} no va en ${religion}. ¡Intenta otra vez!`, `${label} doesn't go with ${religion}. Try again!`) });
        }
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
  }, [drag?.id, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="select-none">
      <h2 className="text-2xl font-bold">{t("Ponlo en su lugar", "Put it in its place")}</h2>
      <p className="text-muted-foreground">{t("Arrastra cada concepto a la religión correspondiente.", "Drag each concept to the religion it belongs to.")}</p>
      <div className="mt-4 flex min-h-16 flex-wrap gap-2">
        {remaining.map((d) => (
          <div
            key={d.id}
            data-testid="drag-item"
            onPointerDown={(e) => { e.preventDefault(); setDrag({ id: d.id, x: e.clientX, y: e.clientY }); }}
            className={cn("cursor-grab touch-none rounded-full border-2 border-primary bg-card px-4 py-2 font-bold text-primary", drag?.id === d.id && "opacity-30")}
          >
            {d.label[lang]}
          </div>
        ))}
        {remaining.length === 0 && <div className="font-display text-xl font-bold text-primary">{t("¡Todo en su lugar!", "Everything in its place!")}</div>}
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
            <div className="flex items-center gap-2 font-display font-bold"><ReligionBadge k={k} size="sm" /> {R[lang][k].name}</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {Object.entries(placed).filter(([, z]) => z === k).map(([id]) => (
                <span key={id} className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">{labelOf(id)}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {drag && typeof document !== "undefined" && createPortal(
        <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rotate-3 rounded-full border-2 border-primary bg-card px-4 py-2 font-bold text-primary shadow-xl" style={{ left: drag.x, top: drag.y }}>
          {labelOf(drag.id)}
        </div>,
        document.body,
      )}
      {msg && <Feedback ok={msg.ok} text={msg.text} />}
      <Button size="lg" className="mt-6 w-full" disabled={remaining.length > 0} onClick={onNext}>{t("Continuar", "Continue")}</Button>
    </div>
  );
}


function Final({ onNext }: { onNext: () => void }) {
  const { t } = useLang();
  return (
    <div className="text-center">
      <h2 className="text-3xl font-black">{t("¿Qué descubriste?", "What did you discover?")}</h2>
      <div className="mt-6 space-y-4 rounded-3xl bg-card p-6 text-left text-lg leading-relaxed shadow-[var(--shadow-soft)]">
        <p>
          {t(
            "El cristianismo no se sostiene simplemente en una serie de enseñanzas o reglas. Se sostiene en una persona: ",
            "Christianity doesn't simply rest on a set of teachings or rules. It rests on a person: ",
          )}
          <b className="font-black text-primary">{t("Jesucristo", "Jesus Christ")}</b>.
        </p>
        <p>
          {t(
            "Mientras otras religiones pueden reconocer a Jesús como profeta, maestro o figura espiritual, el cristianismo afirma algo mucho más radical:",
            "While other religions may recognize Jesus as a prophet, teacher or spiritual figure, Christianity claims something far more radical:",
          )}
        </p>
      </div>
      <div className="mt-4 animate-pop rounded-3xl bg-primary p-6 text-primary-foreground">
        <ReligionBadge k="cri" size="lg" />
        <p className="mt-3 text-2xl font-black leading-snug">
          {t(
            "Jesús es el Hijo de Dios, el Salvador y el único camino hacia el Padre.",
            "Jesus is the Son of God, the Savior and the only way to the Father.",
          )}
        </p>
      </div>
      <p className="mt-6 text-lg">
        {t(
          "Por eso, entender el cristianismo comienza con una pregunta fundamental:",
          "That's why understanding Christianity begins with one fundamental question:",
        )}
      </p>
      <p className="mt-3 text-4xl font-black text-secondary">{t("¿Quién es Jesús para ti?", "Who is Jesus to you?")}</p>
      <div className="mt-6 font-extrabold text-gold">+20 XP</div>
      <Button size="lg" className="mt-4 w-full" onClick={onNext}>{t("Siguiente lección →", "Next lesson →")}</Button>
    </div>
  );
}
