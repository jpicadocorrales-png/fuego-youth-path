import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ArrowRight, Award, Bell, BookOpen, Flame, Megaphone, Zap, type LucideIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  useAnnouncements,
  useBadges,
  useCompletions,
  useCourses,
  useMe,
  useNotifications,
} from "@/lib/app-data";
import { courseLook } from "@/lib/course-look";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({ meta: [{ title: "Inicio — Fuego+" }, { name: "description", content: "Tus estadísticas, anuncios y notificaciones." }] }),
  component: HomePage,
});

const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-4 mt-12 flex items-end justify-between gap-3">
      <h2 className="text-2xl font-black md:text-3xl">{children}</h2>
      {aside}
    </div>
  );
}

function StatTile({
  icon: Icon,
  value,
  label,
  tile,
  chip,
  delay,
}: {
  icon: LucideIcon;
  value: ReactNode;
  label: string;
  tile: string;
  chip: string;
  delay: number;
}) {
  return (
    <div
      className={cn("flex min-h-40 animate-pop flex-col justify-between rounded-[1.75rem] p-5", tile)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={cn("flex size-11 items-center justify-center rounded-2xl", chip)}>
        <Icon className="size-6" strokeWidth={2.5} />
      </span>
      <div>
        <div className="font-display text-4xl font-black leading-none">{value}</div>
        <div className="mt-1.5 text-sm font-bold opacity-70">{label}</div>
      </div>
    </div>
  );
}

function HomePage() {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data: courses = [] } = useCourses();
  const { data: completions = [] } = useCompletions();
  const { data: badges = [] } = useBadges();
  const { data: notifs = [] } = useNotifications();
  const { data: ann = [] } = useAnnouncements();

  const current = courses.find((c) => c.pct > 0 && c.pct < 100) ?? courses.find((c) => c.pct < 100);
  const currentLook = courseLook(current ?? { title: "", color: "" });
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toDateString();
    return { label: days[d.getDay()], count: completions.filter((c) => new Date(c.completed_at).toDateString() === key).length };
  });
  const max = Math.max(1, ...week.map((w) => w.count));
  const weekTotal = week.reduce((s, w) => s + w.count, 0);
  const unread = notifs.filter((n) => !n.read);
  const streak = me?.profile?.streak ?? 0;

  async function markRead() {
    await supabase.from("notifications").update({ read: true }).in("id", unread.map((n) => n.id));
    qc.invalidateQueries({ queryKey: ["notifications"] });
  }

  return (
    <AppShell>
      {/* Saludo */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-muted-foreground">¡Hola!</p>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">{me?.profile?.display_name ?? "joven"}</h1>
        </div>
        <a
          href="#notificaciones"
          aria-label={`Notificaciones: ${unread.length} sin leer`}
          className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-card shadow-[var(--shadow-soft)]"
        >
          <Bell className="size-5" />
          {unread.length > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[11px] font-black text-destructive-foreground">
              {unread.length}
            </span>
          )}
        </a>
      </div>

      {/* Estadísticas */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile icon={Flame} value={streak} label={streak === 1 ? "día de racha" : "días de racha"} tile="bg-primary text-primary-foreground" chip="bg-primary-foreground/20" delay={0} />
        <StatTile icon={Zap} value={me?.profile?.xp ?? 0} label="XP total" tile="bg-yellow text-foreground" chip="bg-card/60" delay={70} />
        <StatTile icon={BookOpen} value={completions.length} label="lecciones" tile="bg-secondary/15 text-foreground" chip="bg-secondary text-secondary-foreground" delay={140} />
        <StatTile icon={Award} value={badges.filter((b) => b.earnedAt).length} label="insignias" tile="bg-green/15 text-foreground" chip="bg-green text-primary-foreground" delay={210} />
      </div>

      {/* Continúa aprendiendo */}
      {current && (
        <>
          <SectionTitle>Continúa aprendiendo</SectionTitle>
          <div className={cn("relative overflow-hidden rounded-[2rem] p-6 md:p-8", currentLook.bg, currentLook.text)}>
            <currentLook.icon className="pointer-events-none absolute -right-8 -top-8 size-48 opacity-15" strokeWidth={1.75} />
            <div className="relative">
              <span className="inline-block rounded-full bg-card/25 px-3 py-1 text-xs font-extrabold uppercase tracking-wide">
                {current.completed} de {current.total} lecciones
              </span>
              <h3 className="mt-3 text-3xl font-extrabold tracking-normal md:text-4xl">{current.title}</h3>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-card/30">
                <div className="h-full rounded-full bg-card transition-all duration-700" style={{ width: `${current.pct}%` }} />
              </div>
              <div className="mt-2 text-sm font-bold opacity-90">{current.pct}% completado</div>
              <Link
                to="/courses/$courseId"
                params={{ courseId: current.id }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-extrabold text-background transition-transform hover:scale-[1.03]"
              >
                Continuar <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Actividad de la semana */}
      <SectionTitle aside={<span className="text-sm font-bold text-muted-foreground">{weekTotal} {weekTotal === 1 ? "lección" : "lecciones"} esta semana</span>}>
        Tu semana
      </SectionTitle>
      <section className="rounded-[2rem] bg-card p-5 shadow-[var(--shadow-soft)] md:p-6">
        <div className="flex h-44 items-end justify-between gap-2 md:gap-4">
          {week.map((w, i) => {
            const today = i === week.length - 1;
            return (
              <div key={i} className="flex h-full flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full max-w-12 flex-1 items-end overflow-visible rounded-full bg-primary/10">
                  {today && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 text-[11px] font-bold text-background">
                      Hoy: {w.count}
                    </span>
                  )}
                  <div
                    className={cn("w-full rounded-full transition-all duration-700", today ? "bg-primary" : "bg-primary/35")}
                    style={{ height: `${Math.max((w.count / max) * 100, 14)}%` }}
                  />
                </div>
                <span className={cn("text-xs font-bold", today ? "text-foreground" : "text-muted-foreground")}>{w.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Avance por curso */}
      <SectionTitle>Tus cursos</SectionTitle>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {courses.map((c) => {
          const look = courseLook(c);
          return (
          <Link
            key={c.id}
            to="/courses/$courseId"
            params={{ courseId: c.id }}
            className={cn(
              "flex min-h-44 flex-col justify-between rounded-[1.75rem] p-5 transition-transform hover:scale-[1.02]",
              look.bg,
              look.text,
            )}
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-card/25">
              <look.icon className="size-6" strokeWidth={2.5} />
            </span>
            <div>
              <div className="text-lg font-bold leading-snug">{c.title}</div>
              <div className="mt-1 text-sm font-bold opacity-80">
                {c.completed} de {c.total} lecciones
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-card/30">
                <div className="h-full rounded-full bg-card" style={{ width: `${c.pct}%` }} />
              </div>
            </div>
          </Link>
          );
        })}
      </div>

      {/* Anuncios */}
      <SectionTitle>Anuncios</SectionTitle>
      <div className="space-y-3">
        {ann.map((a) => (
          <div key={a.id} className="flex items-start gap-4 rounded-[1.5rem] bg-card p-5 shadow-[var(--shadow-soft)]">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-orange/15 text-orange">
              <Megaphone className="size-5" />
            </span>
            <div>
              <div className="text-lg font-extrabold">{a.title}</div>
              <p className="mt-0.5 text-muted-foreground">{a.body}</p>
            </div>
          </div>
        ))}
        {!ann.length && <p className="rounded-[1.5rem] bg-card p-5 text-muted-foreground">Sin anuncios por ahora.</p>}
      </div>

      {/* Notificaciones */}
      <div id="notificaciones" className="scroll-mt-6">
        <SectionTitle aside={unread.length > 0 && <Button variant="ghost" size="sm" onClick={markRead}>Marcar leídas</Button>}>
          Notificaciones
        </SectionTitle>
        <div className="space-y-3 pb-6">
          {notifs.map((n) => (
            <div
              key={n.id}
              className={cn("flex items-start gap-4 rounded-[1.5rem] p-5", n.read ? "bg-card/60" : "bg-card shadow-[var(--shadow-soft)]")}
            >
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                  n.read ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary",
                )}
              >
                <Bell className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-lg font-extrabold">
                  {n.title}
                  {!n.read && <span className="size-2 shrink-0 rounded-full bg-destructive" aria-label="sin leer" />}
                </div>
                <p className="mt-0.5 text-muted-foreground">{n.body}</p>
              </div>
            </div>
          ))}
          {!notifs.length && <p className="rounded-[1.5rem] bg-card p-5 text-muted-foreground">No tienes notificaciones.</p>}
        </div>
      </div>
    </AppShell>
  );
}
