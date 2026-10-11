import { useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReligionBadge, type ReligionKey } from "./ReligionIcons";

const NAME: Record<ReligionKey, string> = { cri: "Cristianismo", isl: "Islam", jud: "Judaísmo", hin: "Hinduismo", bud: "Budismo" };

type Q = { options: { text: string; r: ReligionKey; fb: string }[]; correct: number };
const PROMPT = "¿Cuál de estas afirmaciones es una enseñanza del cristianismo?";

export const testQuestions: Q[] = [
  { correct: 1, options: [
    { text: "Jesús fue un maestro espiritual que mostró un camino de iluminación.", r: "bud", fb: "No exactamente. Esta interpretación presenta a Jesús como un maestro espiritual, pero no refleja la enseñanza cristiana sobre quién es Jesús." },
    { text: "Jesús es el Hijo de Dios y el Salvador de la humanidad.", r: "cri", fb: "¡Correcto! El cristianismo enseña que Jesús es el Hijo de Dios y el Salvador de la humanidad." },
    { text: "Jesús fue un profeta de Dios, pero no es divino.", r: "isl", fb: "No exactamente. El islam reconoce a Jesús como profeta, pero no como Hijo de Dios ni como Salvador." },
    { text: "Jesús es una manifestación de lo divino entre muchas otras.", r: "hin", fb: "No exactamente. Algunas interpretaciones hinduistas pueden entender a Jesús dentro de una concepción amplia de lo divino." },
  ] },
  { correct: 3, options: [
    { text: "La salvación se alcanza mediante el camino hacia el nirvana.", r: "bud", fb: "No exactamente. El nirvana es un concepto central del budismo y no equivale a la salvación cristiana mediante Jesucristo." },
    { text: "La liberación espiritual consiste en escapar del ciclo de renacimientos.", r: "hin", fb: "No exactamente. La liberación del ciclo de renacimientos es una meta presente en tradiciones hinduistas. El cristianismo enseña la salvación por medio de Jesucristo." },
    { text: "Las acciones de una persona determinan su destino mediante el karma.", r: "hin", fb: "No exactamente. El karma tiene un papel importante en distintas tradiciones de origen indio. El cristianismo enseña que la salvación se recibe por gracia mediante la fe en Jesucristo." },
    { text: "La salvación se recibe por gracia mediante la fe en Jesucristo.", r: "cri", fb: "¡Correcto! El cristianismo enseña que la salvación es un regalo de la gracia de Dios, recibido por medio de la fe en Jesucristo." },
  ] },
  { correct: 0, options: [
    { text: "Habrá resurrección y vida eterna.", r: "cri", fb: "¡Correcto! El cristianismo enseña la resurrección y la esperanza de vida eterna con Dios." },
    { text: "El alma puede atravesar múltiples vidas.", r: "hin", fb: "No exactamente. La reencarnación forma parte de diversas tradiciones hinduistas. La esperanza cristiana se centra en la resurrección y la vida eterna." },
    { text: "La existencia continúa mediante diferentes ciclos de renacimiento.", r: "hin", fb: "No exactamente. El ciclo de renacimientos es una idea presente en distintas tradiciones de origen indio. El cristianismo enseña la resurrección." },
    { text: "La meta final es alcanzar el nirvana.", r: "bud", fb: "No exactamente. El nirvana es un concepto central del budismo. El cristianismo enseña la resurrección y la vida eterna con Dios." },
  ] },
  { correct: 2, options: [
    { text: "Dios es uno y no tiene Hijo.", r: "isl", fb: "No exactamente. El islam afirma la unidad absoluta de Dios y rechaza que tenga un Hijo divino. El cristianismo confiesa a un solo Dios: Padre, Hijo y Espíritu Santo." },
    { text: "Lo divino se manifiesta de diferentes maneras y formas.", r: "hin", fb: "No exactamente. Las tradiciones hinduistas tienen concepciones diversas de lo divino. La enseñanza cristiana afirma un solo Dios: Padre, Hijo y Espíritu Santo." },
    { text: "Existe un solo Dios: Padre, Hijo y Espíritu Santo.", r: "cri", fb: "¡Correcto! El cristianismo enseña que hay un solo Dios, revelado como Padre, Hijo y Espíritu Santo." },
    { text: "No existe un Dios creador; la realidad se comprende mediante un camino espiritual.", r: "bud", fb: "No exactamente. Muchas tradiciones budistas no sitúan a un Dios creador en el centro de sus enseñanzas. El cristianismo sí cree en un Dios creador." },
  ] },
  { correct: 0, options: [
    { text: "Las buenas obras son fruto de una fe verdadera.", r: "cri", fb: "¡Correcto! El cristianismo enseña que no somos salvados por acumular buenas obras. Las buenas obras son fruto de una fe verdadera y de una vida transformada por Dios." },
    { text: "Las acciones determinan el karma y las futuras vidas.", r: "hin", fb: "No exactamente. El karma influye en las explicaciones sobre las acciones y sus consecuencias en diversas tradiciones hinduistas. En el cristianismo, las buenas obras son fruto de la fe, no una forma de comprar la salvación." },
    { text: "La salvación depende de acumular suficientes buenas obras.", r: "cri", fb: "No exactamente. El cristianismo enseña que la salvación es por gracia, no algo que se gana acumulando buenas obras. Estas son fruto de la fe." },
    { text: "La liberación se alcanza siguiendo un camino de iluminación.", r: "bud", fb: "No exactamente. El budismo propone un camino de práctica para alcanzar la liberación del sufrimiento. El cristianismo enseña la salvación por gracia mediante la fe en Jesucristo." },
  ] },
];

export function Test({ onNext }: { onNext: () => void }) {
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const q = testQuestions[n]!;
  const sel = picked !== null ? q.options[picked]! : null;
  const ok = picked === q.correct;
  const go = () => {
    if (n + 1 >= testQuestions.length) return onNext();
    setN(n + 1);
    setPicked(null);
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">Selección única</h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-extrabold text-primary">{n + 1} de {testQuestions.length}</span>
      </div>
      <div key={n} className="animate-pop">
        <p className="mt-4 text-xl font-bold">{PROMPT}</p>
        <div className="mt-4 grid gap-3">
          {q.options.map((o, i) => (
            <button
              key={i}
              disabled={picked !== null}
              onClick={() => setPicked(i)}
              className={cn(
                "card-chunky flex items-start gap-3 p-4 text-left text-base font-semibold transition-all active:translate-y-0.5",
                picked === i && (ok ? "border-green bg-green/10" : "border-secondary bg-secondary/10"),
                picked !== null && picked !== i && "opacity-60",
              )}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-black">{"ABCD"[i]}</span>
              <span>{o.text}</span>
            </button>
          ))}
        </div>
        {sel && (
          <div className={cn("mt-4 animate-pop rounded-2xl p-4", ok ? "bg-green/10" : "bg-secondary/10")}>
            <div className="flex items-center gap-2 font-black">
              <ReligionBadge k={sel.r} size="sm" /> {NAME[sel.r]}
            </div>
            <p className={cn("mt-2 font-semibold", ok ? "text-green" : "text-foreground")}>{sel.fb}</p>
          </div>
        )}
        {picked !== null && <Button size="lg" className="mt-5 w-full" onClick={go}>Continuar →</Button>}
      </div>
    </div>
  );
}

type Round = { a: string; b: string; cri: "a" | "b"; other: ReligionKey; exp: string };
export const discardRounds: Round[] = [
  { a: "Jesús es un profeta de Dios, pero no es divino.", b: "Jesús es el Hijo de Dios y Salvador.", cri: "b", other: "isl", exp: "El cristianismo enseña que Jesús no es solamente un profeta: es el Hijo de Dios y el Salvador." },
  { a: "La salvación se recibe por gracia mediante la fe en Jesucristo.", b: "La liberación se alcanza mediante el camino hacia el nirvana.", cri: "a", other: "bud", exp: "El cristianismo enseña que la salvación es un regalo de la gracia de Dios, recibido por medio de la fe en Jesucristo." },
  { a: "El alma puede atravesar múltiples vidas.", b: "Habrá resurrección y vida eterna.", cri: "b", other: "hin", exp: "La esperanza cristiana no está en la reencarnación, sino en la resurrección y la vida eterna con Dios." },
  { a: "Un solo Dios que no tiene Hijo.", b: "Un solo Dios: Padre, Hijo y Espíritu Santo.", cri: "b", other: "isl", exp: "El cristianismo enseña que existe un solo Dios: Padre, Hijo y Espíritu Santo." },
  { a: "Las buenas obras son fruto de una fe verdadera.", b: "Las acciones determinan el karma y las futuras vidas.", cri: "a", other: "hin", exp: "El cristianismo enseña que las buenas obras no compran nuestra salvación; son fruto de una vida transformada por Dios." },
];

export function Discard({ onNext }: { onNext: () => void }) {
  const [n, setN] = useState(0);
  const [sel, setSel] = useState<"a" | "b" | null>(null);
  const [drag, setDrag] = useState<{ k: "a" | "b"; dx: number; dy: number } | null>(null);
  const [over, setOver] = useState(false);
  const [gone, setGone] = useState<"a" | "b" | null>(null);
  const [wrong, setWrong] = useState(false);
  const start = useRef({ x: 0, y: 0 });
  const trash = useRef<HTMLDivElement>(null);
  const r = discardRounds[n]!;
  const solved = gone !== null;

  const inTrash = (x: number, y: number) => {
    const b = trash.current?.getBoundingClientRect();
    return !!b && x >= b.left - 20 && x <= b.right + 20 && y >= b.top - 20 && y <= b.bottom + 20;
  };
  function discard(k: "a" | "b") {
    if (solved) return;
    if (k === r.cri) { setWrong(true); setSel(null); return; }
    setWrong(false);
    setGone(k);
  }
  function down(k: "a" | "b", e: RPointerEvent) {
    if (solved) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDrag({ k, dx: 0, dy: 0 });
  }
  function move(e: RPointerEvent) {
    if (!drag) return;
    setDrag({ ...drag, dx: e.clientX - start.current.x, dy: e.clientY - start.current.y });
    setOver(inTrash(e.clientX, e.clientY));
  }
  function up(e: RPointerEvent) {
    if (!drag) return;
    const moved = Math.hypot(drag.dx, drag.dy) > 8;
    const k = drag.k;
    setDrag(null);
    setOver(false);
    if (inTrash(e.clientX, e.clientY)) discard(k);
    else if (!moved) setSel(sel === k ? null : k);
  }
  function go() {
    if (n + 1 >= discardRounds.length) return onNext();
    setN(n + 1); setGone(null); setSel(null); setWrong(false);
  }

  const card = (k: "a" | "b") => {
    const isDrag = drag?.k === k;
    const isGone = gone === k;
    if (solved && !isGone) {
      return (
        <div key={k} className="animate-pop rounded-3xl bg-primary p-6 text-center text-primary-foreground transition-all duration-500 sm:col-span-2">
          <div className="text-xl font-black leading-snug">«{r[k]}»</div>
        </div>
      );
    }
    return (
      <div
        key={k}
        data-testid={`discard-${k}`}
        onPointerDown={(e) => down(k, e)}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={() => { setDrag(null); setOver(false); }}
        className={cn(
          "card-chunky min-h-36 cursor-grab touch-none select-none p-5 text-lg font-bold leading-snug active:cursor-grabbing",
          sel === k && "border-primary ring-4 ring-primary/20",
          isDrag && "z-20 shadow-xl",
          isGone && "pointer-events-none",
        )}
        style={{
          transform: isGone ? "translateY(220px) scale(0.1) rotate(-12deg)" : isDrag ? `translate(${drag.dx}px, ${drag.dy}px) rotate(${drag.dx / 25}deg)` : undefined,
          opacity: isGone ? 0 : 1,
          transition: isDrag ? "none" : "transform .5s cubic-bezier(.2,.9,.3,1.1), opacity .5s",
        }}
      >
        «{r[k]}»
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">¿Cuál no representa al cristianismo?</h2>
        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-extrabold text-primary">{n + 1} de {discardRounds.length}</span>
      </div>
      <p className="mt-1 text-muted-foreground">Descarta la afirmación que NO representa al cristianismo.</p>
      <div key={n} className="mt-5 grid gap-3 sm:grid-cols-2">
        {card("a")}
        {card("b")}
      </div>
      {!solved && (
        <>
          <div
            ref={trash}
            className={cn(
              "mt-6 flex h-24 items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-secondary/40 font-bold text-secondary transition-all",
              over && "scale-105 border-secondary bg-secondary/10",
            )}
          >
            <Trash2 className="!size-8" /> Arrastra aquí para descartar
          </div>
          <Button size="lg" variant="outline" className="mt-4 w-full" disabled={!sel} onClick={() => sel && discard(sel)}>
            <Trash2 /> Descartar
          </Button>
        </>
      )}
      {wrong && (
        <div className="mt-4 animate-pop rounded-2xl bg-yellow/30 p-4">
          <div className="text-lg font-black">Mmm… 👀</div>
          <p className="font-semibold">Esa es la afirmación cristiana. Intenta de nuevo.</p>
        </div>
      )}
      {solved && (
        <div className="mt-4 animate-pop rounded-2xl bg-green/10 p-4">
          <div className="text-lg font-black text-green">✨ ¡Correcto!</div>
          <div className="mt-2 flex items-center gap-2 font-black"><ReligionBadge k="cri" size="sm" /> Cristianismo</div>
          <p className="mt-2 font-semibold">{r.exp}</p>
          <Button size="lg" className="mt-4 w-full" onClick={go}>Continuar →</Button>
        </div>
      )}
    </div>
  );
}
