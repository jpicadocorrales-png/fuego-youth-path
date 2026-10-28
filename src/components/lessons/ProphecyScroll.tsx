// Experiencia 1 de la lección de Jesús: «El rollo de las profecías».
// Una profecía por pantalla: el usuario coloca el símbolo correcto en el pergamino para revelar su cumplimiento.
import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PROPHECIES, type Prophecy, type SymbolId } from "./jesusContent";
import { ProphecyScene, ProphecySymbol } from "./ProphecyArt";

const TOTAL = PROPHECIES.length;
const STORAGE_KEY = "fuego.jesus.profecias";

// Cantidad de profecías completadas, guardada para no perder el avance al navegar.
function loadDone() {
  try {
    const n = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(n) ? Math.min(Math.max(Math.floor(n), 0), TOTAL) : 0;
  } catch {
    return 0;
  }
}
function saveDone(n: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(n));
  } catch {
    // Sin almacenamiento disponible: el avance solo dura mientras la pantalla esté abierta.
  }
}

const reducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function ProphecyScroll({ onNext }: { onNext: () => void }) {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    setIndex(loadDone());
  }, []);

  if (index === null) return null;
  if (index >= TOTAL) return <Finale onNext={onNext} onReplay={() => setIndex(0)} />;
  return (
    <ProphecyStep
      key={index}
      p={PROPHECIES[index]!}
      n={index}
      onSolved={() => saveDone(Math.max(loadDone(), index + 1))}
      onNext={() => {
        setIndex(index + 1);
        window.scrollTo({ top: 0 });
      }}
    />
  );
}

function Heading({ n }: { n: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-2xl font-black">Profecías cumplidas</h2>
      <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-extrabold text-primary">
        {n}/{TOTAL}
      </span>
    </div>
  );
}

function ScrollText({ text, highlight }: { text: string; highlight?: string | undefined }) {
  const at = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded-md bg-[#f6bc3f]/60 px-1 font-black text-inherit">{highlight}</mark>
      {text.slice(at + highlight.length)}
    </>
  );
}

function ProphecyStep({
  p,
  n,
  onSolved,
  onNext,
}: {
  p: Prophecy;
  n: number;
  onSolved: () => void;
  onNext: () => void;
}) {
  const [drag, setDrag] = useState<{ id: SymbolId; dx: number; dy: number } | null>(null);
  const [over, setOver] = useState(false);
  const [sel, setSel] = useState<SymbolId | null>(null);
  const [miss, setMiss] = useState<SymbolId | null>(null);
  const [hint, setHint] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const start = useRef({ x: 0, y: 0 });
  const slot = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!placed) return;
    const t = setTimeout(() => setRevealed(true), reducedMotion() ? 0 : 900);
    return () => clearTimeout(t);
  }, [placed]);

  useEffect(() => {
    if (!miss) return;
    const t = setTimeout(() => setMiss(null), 550);
    return () => clearTimeout(t);
  }, [miss]);

  function attempt(id: SymbolId) {
    if (placed) return;
    setSel(null);
    if (id !== p.correct) {
      setMiss(id);
      setHint(true);
      return;
    }
    setHint(false);
    setPlaced(true);
    onSolved();
  }

  const inSlot = (x: number, y: number) => {
    const b = slot.current?.getBoundingClientRect();
    return !!b && x >= b.left - 24 && x <= b.right + 24 && y >= b.top - 24 && y <= b.bottom + 24;
  };
  function down(id: SymbolId, e: RPointerEvent) {
    if (placed) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDrag({ id, dx: 0, dy: 0 });
  }
  function move(e: RPointerEvent) {
    if (!drag) return;
    setDrag({ ...drag, dx: e.clientX - start.current.x, dy: e.clientY - start.current.y });
    setOver(inSlot(e.clientX, e.clientY));
  }
  function up(e: RPointerEvent) {
    if (!drag) return;
    const moved = Math.hypot(drag.dx, drag.dy) > 8;
    const id = drag.id;
    setDrag(null);
    setOver(false);
    if (moved && inSlot(e.clientX, e.clientY)) attempt(id);
    else if (!moved) setSel(sel === id ? null : id);
  }

  const tile = (o: Prophecy["options"][number]) => {
    const isDrag = drag?.id === o.id;
    return (
      <div
        key={o.id}
        role="button"
        tabIndex={placed ? -1 : 0}
        aria-pressed={sel === o.id}
        aria-label={o.label}
        onPointerDown={(e) => down(o.id, e)}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={() => {
          setDrag(null);
          setOver(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSel(sel === o.id ? null : o.id);
          }
        }}
        className={cn(
          "flex min-h-32 cursor-grab touch-none select-none flex-col items-center justify-center gap-2 rounded-3xl border-2 bg-card p-3 text-center shadow-[var(--shadow-soft)] outline-none focus-visible:ring-4 focus-visible:ring-primary/30 active:cursor-grabbing",
          sel === o.id && "border-primary ring-4 ring-primary/20",
          isDrag && "relative z-20 shadow-xl",
          miss === o.id && "pr-nudge",
          placed && "pointer-events-none opacity-0",
        )}
        style={{
          transform: isDrag ? `translate(${drag.dx}px, ${drag.dy}px) scale(1.06)` : undefined,
          transition: isDrag ? "none" : "transform .5s cubic-bezier(.2,.9,.3,1.1), opacity .4s",
        }}
      >
        <ProphecySymbol id={o.id} className="pointer-events-none size-16 sm:size-20" />
        <span className="text-sm font-extrabold leading-tight">{o.label}</span>
      </div>
    );
  };

  return (
    <div>
      <Heading n={n + 1} />
      {n === 0 && (
        <p className="mt-1 text-muted-foreground">
          Mucho antes de que Jesús naciera, Dios ya había anunciado su llegada. Descubre las promesas y cómo se
          cumplieron.
        </p>
      )}

      {/* El pergamino */}
      <div className="pr-unroll relative mx-auto mt-5 max-w-xl px-3 py-2">
        <span
          aria-hidden="true"
          className="pr-rod-l absolute bottom-0 left-0 top-0 z-10 w-5 rounded-full"
          style={{ background: "linear-gradient(90deg, #d99a2b, #f6bc3f 45%, #d99a2b)" }}
        />
        <span
          aria-hidden="true"
          className="pr-rod-r absolute bottom-0 right-0 top-0 z-10 w-5 rounded-full"
          style={{ background: "linear-gradient(90deg, #d99a2b, #f6bc3f 55%, #d99a2b)" }}
        />
        <div className="pr-paper relative min-h-[300px] overflow-hidden rounded-[18px] bg-[#ffe8ce] text-[#3b2a4a] shadow-[inset_0_14px_18px_-14px_rgba(120,70,20,.35),inset_0_-14px_18px_-14px_rgba(120,70,20,.35)]">
          <div
            className={cn(
              "pr-ink flex flex-col items-center gap-3 px-8 py-6 text-center transition-all duration-700",
              revealed && "pointer-events-none absolute inset-0 opacity-0",
            )}
          >
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#e63c23]">
              Profecía {n + 1} · {p.title}
            </div>
            <div className="text-sm font-extrabold text-[#5c30ff]">{p.ot.ref}</div>
            <p className="text-lg font-semibold leading-relaxed sm:text-xl">
              «<ScrollText text={p.ot.text} highlight={p.ot.highlight} />»
            </p>
            <button
              ref={slot}
              type="button"
              disabled={placed}
              onClick={() => sel && attempt(sel)}
              aria-label={sel ? "Colocar el símbolo elegido en el pergamino" : "Espacio vacío del pergamino"}
              className={cn(
                "mt-1 flex size-24 items-center justify-center rounded-2xl border-[3px] border-dashed border-[#5c30ff]/35 bg-white/40 transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-[#5c30ff]/30",
                over && "scale-110 border-[#5c30ff] bg-[#5c30ff]/10",
                sel && !placed && "pr-breathe border-[#5c30ff]",
                placed && "border-solid border-[#f6bc3f] bg-[#f6bc3f]/30",
              )}
            >
              {placed ? (
                <ProphecySymbol id={p.correct} className="size-16 animate-pop" />
              ) : (
                <span className="px-2 text-xs font-extrabold uppercase leading-tight text-[#5c30ff]/60">
                  {sel ? "Toca para colocar" : "Suelta aquí"}
                </span>
              )}
            </button>
          </div>
          {placed && (
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 z-10 rounded-[18px] opacity-0",
                p.id === "resurreccion" ? "pr-shine pr-shine-strong" : "pr-shine",
              )}
              style={{
                background: "radial-gradient(circle at 50% 60%, rgba(255,251,232,.95), rgba(246,188,63,.55) 45%, transparent 75%)",
                boxShadow: "inset 0 0 0 4px #f6bc3f",
              }}
            />
          )}
          {revealed && (
            <ProphecyScene id={p.id} className="pr-reveal absolute inset-0 h-full w-full" />
          )}
        </div>
      </div>

      {revealed ? (
        <div className="pr-rise mt-6 text-center" aria-live="polite">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#008c47]/10 px-4 py-1.5 font-extrabold text-[#008c47]">
            <Check className="size-5" strokeWidth={3} /> La promesa se cumplió
          </div>
          <div className="mt-3 text-sm font-extrabold uppercase tracking-wide text-primary">{p.nt.ref}</div>
          <p className="mx-auto mt-2 max-w-md text-lg leading-relaxed">{p.nt.text}</p>
          <Button size="lg" className="mt-6 w-full" onClick={onNext}>
            {p.button}
          </Button>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-center text-lg font-bold">{p.prompt}</p>
          <p className="mt-1 min-h-5 text-center text-sm text-muted-foreground" aria-live="polite">
            {hint
              ? "Ese símbolo no corresponde. Intenta con otro."
              : "Arrastra un símbolo al pergamino, o tócalo y luego toca el espacio vacío."}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">{p.options.map(tile)}</div>
        </div>
      )}
    </div>
  );
}

function Finale({ onNext, onReplay }: { onNext: () => void; onReplay: () => void }) {
  const [gathered, setGathered] = useState(reducedMotion);

  useEffect(() => {
    const t = setTimeout(() => setGathered(true), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="text-center">
      <Heading n={TOTAL} />
      <h2 className="mt-6 text-3xl font-black">Una promesa. Un Salvador.</h2>
      <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-muted-foreground">
        Durante siglos, Dios anunció la llegada del Mesías. Su nacimiento, su vida, su sufrimiento y su resurrección
        forman parte de una misma historia: el plan de salvación cumplido en Jesucristo.
      </p>

      {/* Los siete sellos: primero en fila, luego se reúnen alrededor del nombre */}
      <div className="relative mx-auto mt-6 h-[300px] w-full max-w-sm" aria-hidden="true">
        {PROPHECIES.map((p, i) => {
          const a = ((-90 + (i * 360) / TOTAL) * Math.PI) / 180;
          const x = gathered ? Math.cos(a) * 108 : (i - 3) * 46;
          const y = gathered ? Math.sin(a) * 108 - 10 : 118;
          return (
            <div
              key={p.id}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${gathered ? 1 : 0.85})`,
                transition: `transform 1s cubic-bezier(.2,.9,.3,1.1) ${i * 0.05}s`,
              }}
            >
              <div
                className="pr-seal flex size-12 items-center justify-center rounded-full border-[3px] border-[#f6bc3f] bg-[#ffe8ce] shadow-[0_0_16px_rgba(246,188,63,.55)]"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <ProphecySymbol id={p.correct} className="size-8" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-background bg-[#008c47] text-white">
                <Check className="size-3" strokeWidth={4} />
              </span>
            </div>
          );
        })}
        <div
          className={cn(
            "absolute inset-0 flex -translate-y-[10px] items-center justify-center transition-all duration-700 motion-reduce:transition-none",
            gathered ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <span className="pr-name font-display text-4xl font-black tracking-wider text-[#5c30ff]">JESÚS</span>
        </div>
      </div>

      <div
        className={cn(
          "transition-opacity duration-700 motion-reduce:transition-none",
          gathered ? "opacity-100" : "opacity-0",
        )}
      >
        <p className="text-xl font-black text-primary">Lo que fue anunciado, en Él se cumplió.</p>
        <Button size="lg" className="mt-6 w-full" onClick={onNext}>
          Continuar la lección
        </Button>
        <button
          type="button"
          onClick={onReplay}
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-4" /> Repasar las profecías
        </button>
      </div>
    </div>
  );
}
