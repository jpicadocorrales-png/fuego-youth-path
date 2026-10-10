import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Lock, BookOpen } from "lucide-react";
import imgReligiones from "@/assets/lessons/religiones.jpg";
import imgJesus from "@/assets/lessons/jesus.jpg";
import imgDios from "@/assets/lessons/dios.jpg";
import imgEspiritu from "@/assets/lessons/espiritu.jpg";
import imgPecado from "@/assets/lessons/pecado.jpg";
import imgSalvacion from "@/assets/lessons/salvacion.jpg";
import imgOracion from "@/assets/lessons/oracion.jpg";
import imgIglesia from "@/assets/lessons/iglesia.jpg";

const ILL: [RegExp, string][] = [
  [/religi/i, imgReligiones], [/jes[uú]s/i, imgJesus], [/esp[ií]ritu/i, imgEspiritu], [/^dios/i, imgDios],
  [/pecado/i, imgPecado], [/salvaci/i, imgSalvacion], [/oraci/i, imgOracion], [/iglesia/i, imgIglesia],
];
function illustrationFor(title: string) {
  return ILL.find(([re]) => re.test(title))?.[1];
}
import { AppShell } from "@/components/AppShell";
import { courseColor, useCourses } from "@/lib/app-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/courses/$courseId")({
  head: () => ({ meta: [{ title: "Curso — Fuego+" }, { name: "description", content: "Recorrido de lecciones del curso." }] }),
  component: CoursePath,
});

const STEP_Y = 150;
const W = 340;
// Horizontal positions (0-1) that make the path wind left and right
const xs = [0.5, 0.78, 0.62, 0.25, 0.4, 0.75, 0.55, 0.22];

function CoursePath() {
  const { courseId } = Route.useParams();
  const { data: courses = [] } = useCourses();
  const navigate = useNavigate();
  const [opening, setOpening] = useState<string | null>(null);
  const course = courses.find((c) => c.id === courseId);
  if (!course) return <AppShell><p>Cargando…</p></AppShell>;
  const nextIdx = course.lessons.findIndex((l) => !l.done);
  const n = course.lessons.length;
  const height = n * STEP_Y + 60;
  const pts = course.lessons.map((_, i) => ({ x: (xs[i % xs.length] ?? 0.5) * W, y: 70 + i * STEP_Y }));
  const doneCount = course.completed;
  const pathD = pts.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1]!;
    const my = (prev.y + p.y) / 2;
    return `${d} C ${prev.x} ${my}, ${p.x} ${my}, ${p.x} ${p.y}`;
  }, "");
  // Portion of path walked so far
  const walked = pts.slice(0, Math.min(doneCount + 1, n)).reduce((d, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1]!;
    const my = (prev.y + p.y) / 2;
    return `${d} C ${prev.x} ${my}, ${p.x} ${my}, ${p.x} ${p.y}`;
  }, "");
  const nextLesson = nextIdx >= 0 ? course.lessons[nextIdx] : undefined;

  return (
    <AppShell>
      <div className={`rounded-3xl p-6 text-primary-foreground ${courseColor[course.color] ?? "bg-primary"}`}>
        <Link to="/courses" className="text-sm font-semibold opacity-90">← Cursos</Link>
        <h1 className="mt-2 text-3xl font-black">{course.title}</h1>
        <p className="mt-1 opacity-90">{course.description}</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-primary-foreground/30">
          <div className="h-full rounded-full bg-primary-foreground transition-all duration-700" style={{ width: `${course.pct}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm font-bold">
          <span>{course.completed} de {course.total} lecciones completadas</span>
          {nextLesson && (
            <Link to="/lesson/$lessonId" params={{ lessonId: nextLesson.id }} className="rounded-full bg-primary-foreground px-4 py-2 text-foreground">
              {course.completed ? "Continuar" : "Comenzar"}
            </Link>
          )}
        </div>
      </div>

      <div className="relative mx-auto mt-6 rounded-[2rem] bg-card" style={{ maxWidth: W + 40 }}>
        <div className="relative mx-auto" style={{ width: W, height }}>
          <svg className="absolute inset-0" width={W} height={height} aria-hidden>
            <path d={pathD} fill="none" className="stroke-border" strokeWidth={22} strokeLinecap="round" />
            <path d={pathD} fill="none" className="stroke-background" strokeWidth={18} strokeLinecap="round" />
            {doneCount > 0 && <path d={walked} fill="none" className="stroke-green/40" strokeWidth={8} strokeLinecap="round" />}
          </svg>
          {course.lessons.map((l, i) => {
            const p = pts[i]!;
            const isNext = i === nextIdx;
            const locked = !l.done && !isNext;
            const img = illustrationFor(l.title);
            const node = (
              <div
                className={cn(
                  "relative flex items-center justify-center rounded-full bg-cream shadow-[var(--shadow-soft)] transition-transform",
                  isNext ? "size-24 ring-4 ring-primary ring-offset-4 ring-offset-card hover:scale-105" : "size-20",
                  l.done && "ring-4 ring-green ring-offset-2 ring-offset-card",
                  locked && "cursor-not-allowed opacity-60 grayscale",
                )}
              >
                {img ? (
                  <img src={img} alt="" width={816} height={816} loading="lazy" className="size-full rounded-full object-cover" />
                ) : (
                  <BookOpen className="!size-9 text-primary" />
                )}
                {l.done && (
                  <span className="absolute -right-1.5 -top-1.5 flex size-7 items-center justify-center rounded-full bg-green text-primary-foreground ring-2 ring-card">
                    <Check className="!size-4" strokeWidth={3.5} />
                  </span>
                )}
                {locked && (
                  <span className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-foreground text-background ring-2 ring-card">
                    <Lock className="!size-3.5" />
                  </span>
                )}
              </div>
            );
            const labelLeft = p.x > W / 2;
            return (
              <div key={l.id} className="absolute" style={{ left: p.x, top: p.y, transform: "translate(-50%, -50%)" }}>
                <button
                  type="button"
                  aria-label={locked ? `Lección ${i + 1} bloqueada` : `Lección ${i + 1}: ${l.title}`}
                  className={cn("block transition-transform duration-300", opening === l.id && "scale-125 opacity-0")}
                  onClick={() => {
                    if (locked) {
                      toast(`Completa la lección ${i} para desbloquear esta etapa`, { icon: "🔒" });
                      return;
                    }
                    setOpening(l.id);
                    setTimeout(() => navigate({ to: "/lesson/$lessonId", params: { lessonId: l.id } }), 280);
                  }}
                >
                  {node}
                </button>
                <div
                  className={cn(
                    "absolute top-1/2 w-28 -translate-y-1/2 leading-tight",
                    labelLeft ? "right-full mr-4 text-right" : "left-full ml-4",
                  )}
                >
                  {!locked && <span className="block text-base font-extrabold text-foreground">{l.title}</span>}
                  {isNext && <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">Continuar →</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
