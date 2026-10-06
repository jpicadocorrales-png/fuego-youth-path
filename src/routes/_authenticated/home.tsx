import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Megaphone } from "lucide-react";
import { AppShell, ProgressBar } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  courseColor,
  useAnnouncements,
  useBadges,
  useCompletions,
  useCourses,
  useMe,
  useNotifications,
} from "@/lib/app-data";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({ meta: [{ title: "Inicio — Fuego+" }, { name: "description", content: "Tus estadísticas, anuncios y notificaciones." }] }),
  component: HomePage,
});

const days = ["D", "L", "M", "M", "J", "V", "S"];

function HomePage() {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data: courses = [] } = useCourses();
  const { data: completions = [] } = useCompletions();
  const { data: badges = [] } = useBadges();
  const { data: notifs = [] } = useNotifications();
  const { data: ann = [] } = useAnnouncements();

  const current = courses.find((c) => c.pct > 0 && c.pct < 100) ?? courses.find((c) => c.pct < 100);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toDateString();
    return { label: days[d.getDay()], count: completions.filter((c) => new Date(c.completed_at).toDateString() === key).length };
  });
  const max = Math.max(1, ...week.map((w) => w.count));
  const unread = notifs.filter((n) => !n.read);

  async function markRead() {
    await supabase.from("notifications").update({ read: true }).in("id", unread.map((n) => n.id));
    qc.invalidateQueries({ queryKey: ["notifications"] });
  }

  const stats = [
    { label: "Racha", value: `${me?.profile?.streak ?? 0} días`, emoji: "🔥" },
    { label: "XP total", value: me?.profile?.xp ?? 0, emoji: "⚡" },
    { label: "Lecciones", value: completions.length, emoji: "📖" },
    { label: "Insignias", value: badges.filter((b) => b.earnedAt).length, emoji: "🏅" },
  ];

  return (
    <AppShell>
      <h1 className="text-3xl font-bold">¡Hola, {me?.profile?.display_name ?? "joven"}! 👋</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="card-chunky animate-pop p-4" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="text-3xl">{s.emoji}</div>
            <div className="mt-1 font-display text-2xl font-bold">{s.value}</div>
            <div className="text-xs font-extrabold uppercase text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {current && (
        <div className={`mt-6 rounded-3xl p-6 text-primary-foreground ${courseColor[current.color] ?? "bg-primary"}`}>
          <div className="text-sm font-extrabold uppercase opacity-90">Continúa aprendiendo</div>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-5xl">{current.emoji}</span>
            <h2 className="text-2xl font-bold">{current.title}</h2>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-primary-foreground/30">
            <div className="h-full rounded-full bg-primary-foreground" style={{ width: `${current.pct}%` }} />
          </div>
          <div className="mt-1 text-sm font-bold">{current.pct}% completado</div>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/courses/$courseId" params={{ courseId: current.id }}>Continuar</Link>
          </Button>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="card-chunky p-5">
          <h3 className="text-lg font-bold">Actividad de la semana</h3>
          <div className="mt-4 flex h-32 items-end justify-between gap-2">
            {week.map((w, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-lg bg-secondary transition-all" style={{ height: `${(w.count / max) * 100}%`, minHeight: 6 }} />
                <span className="text-xs font-bold text-muted-foreground">{w.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card-chunky p-5">
          <h3 className="text-lg font-bold">Avance por curso</h3>
          <div className="mt-3 space-y-3">
            {courses.map((c) => (
              <div key={c.id}>
                <div className="flex justify-between text-sm font-bold">
                  <span>{c.emoji} {c.title}</span><span>{c.pct}%</span>
                </div>
                <ProgressBar value={c.pct} className="mt-1 h-3" />
              </div>
            ))}
          </div>
        </section>

        <section className="card-chunky p-5">
          <h3 className="flex items-center gap-2 text-lg font-bold"><Megaphone className="size-5 text-orange" /> Anuncios</h3>
          <div className="mt-3 space-y-3">
            {ann.map((a) => (
              <div key={a.id} className="rounded-xl bg-muted p-3">
                <div className="font-bold">{a.title}</div>
                <p className="text-sm text-muted-foreground">{a.body}</p>
              </div>
            ))}
            {!ann.length && <p className="text-sm text-muted-foreground">Sin anuncios por ahora.</p>}
          </div>
        </section>

        <section className="card-chunky p-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Bell className="size-5 text-secondary" /> Notificaciones
              {unread.length > 0 && <span className="rounded-full bg-destructive px-2 text-xs text-destructive-foreground">{unread.length}</span>}
            </h3>
            {unread.length > 0 && <Button variant="ghost" size="sm" onClick={markRead}>Marcar leídas</Button>}
          </div>
          <div className="mt-3 max-h-64 space-y-2 overflow-auto">
            {notifs.map((n) => (
              <div key={n.id} className={`rounded-xl p-3 ${n.read ? "bg-muted/50" : "bg-accent"}`}>
                <div className="font-bold">{n.title}</div>
                <p className="text-sm text-muted-foreground">{n.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
