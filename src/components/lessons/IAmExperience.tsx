// Experiencia 2 de la lección de Jesús: «¿Qué dijo Jesús de sí mismo?».
// Siete escenas interactivas, una por pantalla; la declaración se revela solo al completar cada escena.
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { I_AM_DECLARATIONS, I_AM_EXODUS, I_AM_REVELATION, type IAmDeclaration, type IAmId } from "./jesusContent";
import {
  activityActions,
  prefersReducedMotion,
  useBackStep,
  type ActivitySession,
  type BackRef,
  type SetActivity,
} from "./lessonProgress";
import { CR, G, G2, INK, SAND, SAND2, V, V2, WOOD, Y, type SceneProps } from "./IAmShared";
import { BreadScene, DoorScene, LightScene, ShepherdScene } from "./IAmScenesA";
import { PathScene, StoneScene, VineScene } from "./IAmScenesB";
import { ProphecySymbol } from "./ProphecyArt";
import { StepNav } from "./StepNav";

export const I_AM_TOTAL = I_AM_DECLARATIONS.length;
const TOTAL = I_AM_TOTAL;

const SCENES: Record<IAmId, ComponentType<SceneProps>> = {
  pan: BreadScene,
  luz: LightScene,
  puerta: DoorScene,
  pastor: ShepherdScene,
  resurreccion: StoneScene,
  camino: PathScene,
  vid: VineScene,
};

export function IAmExperience({
  session,
  setSession,
  onNext,
  backRef,
}: {
  // index: -1 = introducción; 0..6 = escena actual; 7 = pantalla final.
  session: ActivitySession;
  setSession: SetActivity;
  onNext: () => void;
  backRef?: BackRef;
}) {
  const { index, done, rounds } = session;
  const act = activityActions(setSession);

  useBackStep(backRef, () => {
    if (index < 0) return false;
    act.go(index - 1);
    return true;
  });

  if (index < 0) return <Intro onStart={() => act.go(0)} />;
  if (index >= TOTAL) return <Finale onNext={onNext} onBack={() => act.go(TOTAL - 1)} />;
  return (
    <DeclarationStep
      key={`${index}-${rounds[index] ?? 0}`}
      d={I_AM_DECLARATIONS[index]!}
      n={index}
      solved={done[index] ?? false}
      onSolved={() => act.complete(index)}
      onNext={() => act.go(index + 1)}
      onBack={() => act.go(index - 1)}
      onRepeat={() => act.repeat(index)}
    />
  );
}

function Heading({ n }: { n: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-xl font-black">¿Qué dijo Jesús de sí mismo?</h2>
      <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-extrabold text-primary">
        {n}/{TOTAL}
      </span>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <h2 className="text-3xl font-black">¿Qué dijo Jesús de sí mismo?</h2>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        Jesús utilizó imágenes de la vida cotidiana para revelar quién es Él. Pero sus palabras tenían un significado
        mucho más profundo. Descubre lo que Jesús dijo sobre sí mismo.
      </p>
      <Button size="lg" className="mt-6 w-full" onClick={onStart}>
        Comenzar
      </Button>
    </div>
  );
}

function DeclarationStep({
  d,
  n,
  solved,
  onSolved,
  onNext,
  onBack,
  onRepeat,
}: {
  d: IAmDeclaration;
  n: number;
  // Ya completada en esta sesión: la escena se abre resuelta y la declaración se muestra de una vez.
  solved: boolean;
  onSolved: () => void;
  onNext: () => void;
  onBack: () => void;
  onRepeat: () => void;
}) {
  const [wasSolved] = useState(solved);
  const [revealed, setRevealed] = useState(solved);
  const panel = useRef<HTMLDivElement>(null);
  const Scene = SCENES[d.id];

  useEffect(() => {
    if (revealed && !wasSolved) panel.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }, [revealed, wasSolved]);

  return (
    <div>
      <Heading n={n + 1} />
      <p className="mt-2 text-lg font-bold">{d.instruction}</p>
      <div className="mt-3">
        <Scene
          solved={wasSolved}
          onDone={() => {
            onSolved();
            setRevealed(true);
          }}
        />
      </div>
      {revealed && (
        <div ref={panel} className="pr-rise scroll-mt-4 pt-2 text-center" aria-live="polite">
          <p className="font-display text-2xl font-black leading-tight text-primary sm:text-3xl">«{d.statement}»</p>
          <p className="mx-auto mt-3 max-w-md text-lg font-semibold italic leading-relaxed">«{d.quote}»</p>
          <p className="mt-2 text-sm font-extrabold uppercase tracking-wide text-secondary">{d.ref}</p>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">{d.explanation}</p>
          <Button size="lg" className="mt-6 w-full" onClick={onNext}>
            {d.button}
          </Button>
        </div>
      )}
      <StepNav onBack={onBack} onRepeat={revealed ? onRepeat : undefined} />
    </div>
  );
}

/* ───────────── Pantalla final ───────────── */

const symbols: Record<IAmId, ReactNode> = {
  pan: (
    <>
      <ellipse cx="32" cy="40" rx="26" ry="15" fill="#b86d27" />
      <ellipse cx="32" cy="36" rx="25" ry="14" fill="#d9893a" />
      <path d="M21 30q4 6 0 12M31 27q4 8 0 16M41 29q4 6 0 12" fill="none" stroke="#b86d27" strokeWidth="3" strokeLinecap="round" />
      <path d="M13 34q6-10 19-10" fill="none" stroke="#eeb067" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  luz: (
    <>
      <circle cx="32" cy="33" r="24" fill={Y} opacity="0.3" />
      <path d="M24 14a8 8 0 0 1 16 0" fill="none" stroke={INK} strokeWidth="3" />
      <rect x="20" y="14" width="24" height="7" rx="2" fill={INK} />
      <rect x="22" y="21" width="20" height="24" rx="5" fill={Y} stroke={INK} strokeWidth="2.5" />
      <path d="M32 41c-4 0-6-4-3-8 1-2 3-3 3-7 3 3 5 5 5 9 0 4-2 6-5 6z" fill="#fff6ea" />
      <rect x="20" y="45" width="24" height="6" rx="2" fill={INK} />
    </>
  ),
  puerta: (
    <>
      <path d="M14 58V27a18 18 0 0 1 36 0v31z" fill="#ffd98a" />
      <path d="M26 58l6-14h4l8 14z" fill={G2} />
      <path d="M14 58V25l13-7v46z" fill={WOOD} />
      <path d="M14 58V27a18 18 0 0 1 36 0v31" fill="none" stroke="#c98f5e" strokeWidth="4" />
      <path d="M22 60h28l10 3H14z" fill={Y} opacity="0.6" />
    </>
  ),
  pastor: (
    <>
      <path d="M40 60V18a10 10 0 0 0-20 0v4" fill="none" stroke={WOOD} strokeWidth="5" strokeLinecap="round" />
      {([[16, 48, 7], [24, 46, 8], [30, 50, 6], [21, 53, 6]] as const).map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#fff" stroke="#e3d9cc" strokeWidth="1.5" />
      ))}
      <ellipse cx="9" cy="45" rx="4.5" ry="5.5" fill={INK} />
    </>
  ),
  resurreccion: null,
  camino: (
    <>
      <circle cx="32" cy="14" r="9" fill={Y} />
      <path d="M0 60V34c20-6 44-6 64 0v26z" fill={G2} />
      <path d="M14 62L28 26h8l14 36z" fill={SAND} stroke={SAND2} strokeWidth="1.5" />
      <path d="M32 58V32" stroke="#fff6ea" strokeWidth="2.5" strokeDasharray="4 4" />
    </>
  ),
  vid: (
    <>
      <path d="M32 6c12 0 20 8 18 18-12 2-20-6-18-18z" fill={G} />
      <path d="M30 8c-10 2-16 10-12 18 10 0 14-8 12-18z" fill={G2} />
      <path d="M32 18v10" stroke="#8f4a22" strokeWidth="3" />
      {([[24, 32], [32, 32], [40, 32], [28, 40], [36, 40], [32, 48]] as const).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={i % 2 ? V2 : V} />
      ))}
    </>
  ),
};

function IAmSymbol({ id, className }: { id: IAmId; className: string }) {
  if (id === "resurreccion") return <ProphecySymbol id="open-tomb" className={className} />;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {symbols[id]}
    </svg>
  );
}

function Finale({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [gathered, setGathered] = useState(prefersReducedMotion);

  useEffect(() => {
    const t = setTimeout(() => setGathered(true), 2100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="text-center">
      <Heading n={TOTAL} />
      <h2 className="mt-6 text-3xl font-black">Siete declaraciones. Una misma persona.</h2>
      <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-muted-foreground">
        Jesús es el pan que da vida, la luz que vence las tinieblas, la puerta de salvación, el buen pastor, la
        resurrección y la vida, el camino al Padre y la vid verdadera.
      </p>

      {/* Los siete símbolos aparecen uno por uno y luego rodean «YO SOY» */}
      <div className="relative mx-auto mt-6 h-[300px] w-full max-w-sm" aria-hidden="true">
        {I_AM_DECLARATIONS.map((d, i) => {
          const a = ((-90 + (i * 360) / TOTAL) * Math.PI) / 180;
          const x = gathered ? Math.cos(a) * 108 : (i - 3) * 46;
          const y = gathered ? Math.sin(a) * 108 - 10 : 118;
          return (
            <div
              key={d.id}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${gathered ? 1 : 0.85})`,
                transition: `transform 1s cubic-bezier(.2,.9,.3,1.1) ${i * 0.05}s`,
              }}
            >
              <div
                className="pr-seal flex size-12 items-center justify-center rounded-full border-[3px] border-[#f6bc3f] shadow-[0_0_16px_rgba(246,188,63,.55)]"
                style={{ animationDelay: `${i * 0.25}s`, background: CR }}
              >
                <IAmSymbol id={d.id} className="size-9" />
              </div>
              <span
                className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-background text-white"
                style={{ background: G }}
              >
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
          <span className="pr-name font-display text-4xl font-black tracking-wider text-[#5c30ff]">YO SOY</span>
        </div>
      </div>

      {gathered && (
        <div>
          <div className="pr-rise" style={{ animationDelay: "0.2s" }}>
            <p className="text-xl font-black">«{I_AM_REVELATION.text}»</p>
            <p className="mt-1 text-sm font-extrabold uppercase tracking-wide text-secondary">{I_AM_REVELATION.ref}</p>
          </div>
          <div className="pr-rise mt-4" style={{ animationDelay: "1s" }}>
            <p className="text-lg font-bold">
              <span className="text-sm font-extrabold uppercase tracking-wide text-secondary">{I_AM_EXODUS.ref}</span> — «
              {I_AM_EXODUS.text}»
            </p>
          </div>
          <div className="pr-rise" style={{ animationDelay: "1.8s" }}>
            <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted-foreground">
              Las palabras de Jesús no solamente describen lo que Él hace por nosotros. Revelan quién es. En el
              Evangelio de Juan, sus declaraciones nos muestran su identidad, su autoridad y su relación única con el
              Padre.
            </p>
            <Button size="lg" className="mt-6 w-full" onClick={onNext}>
              Continuar la lección
            </Button>
            <StepNav onBack={onBack} />
          </div>
        </div>
      )}
    </div>
  );
}
