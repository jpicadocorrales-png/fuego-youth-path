import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Lock } from "lucide-react";
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

      <div className="relative mx-auto mt-6 overflow-hidden rounded-[2rem] bg-cream" style={{ maxWidth: W + 40 }}>
        {/* map texture */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full text-foreground/10" aria-hidden>
          <defs>
            <pattern id="map-dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.6" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-dots)" />
        </svg>
        {pts.map((p, i) => (
          <span
            key={`d${i}`}
            aria-hidden
            className={cn("pointer-events-none absolute rounded-full opacity-40 animate-floaty", i % 3 === 0 ? "bg-yellow" : i % 3 === 1 ? "bg-pink" : "bg-secondary")}
            style={{ width: 10 + (i % 3) * 6, height: 10 + (i % 3) * 6, top: p.y + 40, left: p.x > W / 2 ? 24 : W - 10, animationDelay: `${i * 0.4}s` }}
          />
        ))}
        <div className="relative mx-auto" style={{ width: W, height }}>
          <svg className="absolute inset-0" width={W} height={height} aria-hidden>
            <path d={pathD} fill="none" className="stroke-card" strokeWidth={26} strokeLinecap="round" />
            <path d={pathD} fill="none" className="stroke-muted-foreground/40" strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" />
            {doneCount > 0 && <path d={walked} fill="none" className="stroke-primary" strokeWidth={8} strokeLinecap="round" />}
          </svg>
          {course.lessons.map((l, i) => {
            const p = pts[i]!;
            const isNext = i === nextIdx;
            const locked = !l.done && !isNext;
            const node = (
              <div
                className={cn(
                  "relative flex items-center justify-center rounded-full font-black transition-transform",
                  l.done && "size-16 bg-green text-primary-foreground shadow-[0_5px_0_oklch(0.42_0.12_155)]",
                  isNext && "size-20 bg-primary text-3xl text-primary-foreground shadow-[0_6px_0_var(--color-primary-shade)] ring-8 ring-primary/20 hover:scale-105",
                  locked && "size-16 cursor-not-allowed bg-muted text-2xl text-muted-foreground/70 shadow-[0_4px_0_var(--color-border)]",
                )}
              >
                {l.done ? <Check className="!size-8" strokeWidth={3.5} /> : locked ? "?" : i + 1}
                {!isNext && (
                  <span className={cn("absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full text-xs font-black", l.done ? "bg-yellow text-foreground" : "bg-card text-muted-foreground")}>
                    {locked ? <Lock className="!size-3.5" /> : i + 1}
                  </span>
                )}
              </div>
            );
            const labelLeft = p.x > W / 2;
            return (
              <div key={l.id} className="absolute" style={{ left: p.x, top: p.y, transform: "translate(-50%, -50%)" }}>
                {isNext && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce whitespace-nowrap rounded-full bg-foreground px-3 py-1 text-xs font-bold text-background">
                    Continuar · Lección {i + 1}
                  </div>
                )}
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
                    "absolute top-1/2 w-32 -translate-y-1/2 text-sm font-bold leading-tight",
                    labelLeft ? "right-full mr-4 text-right" : "left-full ml-4",
                    locked ? "text-muted-foreground/60" : "text-foreground",
                  )}
                >
                  {locked ? (
                    <span className="inline-block rounded-full bg-muted px-3 py-1 text-base">? ? ?</span>
                  ) : (
                    <>
                      <span className="block text-xs font-semibold text-muted-foreground">
                        {l.done ? "Completada · 100%" : "Disponible"}
                      </span>
                      {l.title}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
