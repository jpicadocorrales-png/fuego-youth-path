import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Award, BookOpen, ChevronDown, Flame, Megaphone, Users, Zap, type LucideIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/lib/app-data";
import { courseLook } from "@/lib/course-look";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Administración — Fuego+" }, { name: "description", content: "Seguimiento de los jóvenes y sus cursos." }] }),
  component: AdminPage,
});

const VIOLET = "#5c30ff";
const DAY = 864e5;
const field = "h-12 rounded-2xl border-2 bg-background px-4 text-base";
const tab = "rounded-full px-5 py-2 font-extrabold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none";

function AdminPage() {
  const { data: me, isLoading } = useMe();
  if (isLoading) return <AppShell><p>Cargando…</p></AppShell>;
  if (!me?.isAdmin) return <AppShell><p className="font-bold">Solo los administradores pueden ver esta página.</p></AppShell>;
  return (
    <AppShell>
      <h1 className="text-4xl font-black md:text-5xl">Administración</h1>
      <p className="mt-1 text-muted-foreground">Seguimiento de los jóvenes y sus cursos.</p>
      <Tabs defaultValue="stats" className="mt-6">
        <TabsList className="h-auto flex-wrap gap-1 rounded-full bg-card p-1.5 shadow-[var(--shadow-soft)]">
          <TabsTrigger value="stats" className={tab}>Estadísticas</TabsTrigger>
          <TabsTrigger value="students" className={tab}>Jóvenes</TabsTrigger>
          <TabsTrigger value="announce" className={tab}>Anuncios</TabsTrigger>
        </TabsList>
        <TabsContent value="stats"><Stats /></TabsContent>
        <TabsContent value="students"><Students /></TabsContent>
        <TabsContent value="announce"><Announce /></TabsContent>
      </Tabs>
    </AppShell>
  );
}

// Datos de seguimiento compartidos por Estadísticas y Jóvenes.
function useAdminData() {
  return useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const [{ data: profiles }, { data: courses }, { data: lessons }, { data: comps }, { data: ub }] = await Promise.all([
        supabase.from("profiles").select("*").order("xp", { ascending: false }),
        supabase.from("courses").select("id, title, color").order("order_index"),
        supabase.from("lessons").select("id, course_id"),
        supabase.from("lesson_completions").select("user_id, course_id, completed_at"),
        supabase.from("user_badges").select("user_id"),
      ]);
      return { profiles: profiles ?? [], courses: courses ?? [], lessons: lessons ?? [], comps: comps ?? [], ub: ub ?? [] };
    },
  });
}

const daysSince = (date: string | null) => (date ? (Date.now() - new Date(date).getTime()) / DAY : Infinity);

function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-4 mt-10 flex items-end justify-between gap-3">
      <h2 className="text-2xl font-black md:text-3xl">{children}</h2>
      {aside}
    </div>
  );
}

function StatTile({ icon: Icon, value, label, tile, chip }: { icon: LucideIcon; value: number; label: string; tile: string; chip: string }) {
  return (
    <div className={cn("flex min-h-40 flex-col gap-6 rounded-[1.75rem] p-5 md:p-6", tile)}>
      <span className={cn("flex size-11 items-center justify-center rounded-2xl", chip)}>
        <Icon className="size-6" strokeWidth={2.5} />
      </span>
      <div className="mt-auto">
        <div className="font-display text-4xl font-black leading-none">{value}</div>
        <div className="mt-2 text-sm font-extrabold leading-snug">{label}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.75rem] bg-card p-5 shadow-[var(--shadow-soft)] md:p-6">
      <h3 className="text-lg font-extrabold">{title}</h3>
      {note && <p className="text-sm text-muted-foreground">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

// Sin animación de los gráficos si el usuario pidió movimiento reducido.
const animate = () => typeof window !== "undefined" && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const axis = { fontSize: 12, fill: "var(--muted-foreground)" };
const tooltipStyle = {
  contentStyle: { borderRadius: 14, border: "none", boxShadow: "var(--shadow-soft)", fontWeight: 700 },
  cursor: { fill: "var(--muted)" },
};

function Stats() {
  const { data } = useAdminData();
  if (!data) return <p className="mt-6 text-muted-foreground">Cargando estadísticas…</p>;

  const active = data.profiles.filter((p) => daysSince(p.last_activity_date) < 7).length;
  const never = data.profiles.filter((p) => !p.last_activity_date).length;
  const inactive = data.profiles.length - active - never;

  // Lecciones completadas por día, últimos 14 días.
  const perDay = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = d.toDateString();
    return {
      dia: d.toLocaleDateString("es", { day: "numeric", month: "short" }),
      lecciones: data.comps.filter((c) => new Date(c.completed_at).toDateString() === key).length,
    };
  });

  // Avance promedio de los jóvenes en cada curso.
  const perCourse = data.courses.map((c) => {
    const total = data.lessons.filter((l) => l.course_id === c.id).length;
    const sum = data.profiles.reduce((s, p) => {
      const done = data.comps.filter((m) => m.user_id === p.id && m.course_id === c.id).length;
      return s + (total ? done / total : 0);
    }, 0);
    return {
      curso: c.title,
      avance: data.profiles.length ? Math.round((sum / data.profiles.length) * 100) : 0,
      color: courseLook(c).hex,
    };
  });

  const activity = [
    { estado: "Activos (7 días)", jovenes: active, color: "#008c47" },
    { estado: "Inactivos", jovenes: inactive, color: "#f6bc3f" },
    { estado: "Sin actividad", jovenes: never, color: "#e63c23" },
  ];

  const top = data.profiles.slice(0, 5).map((p) => ({ nombre: p.display_name, xp: p.xp }));

  return (
    <div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile icon={Users} value={data.profiles.length} label="jóvenes" tile="bg-primary text-primary-foreground" chip="bg-primary-foreground/20" />
        <StatTile icon={Flame} value={active} label="activos esta semana" tile="bg-yellow text-foreground" chip="bg-card/60" />
        <StatTile icon={BookOpen} value={data.comps.length} label="lecciones hechas" tile="bg-secondary/15 text-foreground" chip="bg-secondary text-secondary-foreground" />
        <StatTile icon={Award} value={data.ub.length} label="insignias ganadas" tile="bg-green/15 text-foreground" chip="bg-green text-primary-foreground" />
      </div>

      <SectionTitle>Estadísticas</SectionTitle>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Lecciones completadas" note="Últimos 14 días">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={perDay} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="dia" tick={axis} tickLine={false} axisLine={false} interval={2} />
              <YAxis allowDecimals={false} tick={axis} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} formatter={(v) => [v, "lecciones"]} />
              <Bar dataKey="lecciones" isAnimationActive={animate()} fill={VIOLET} radius={[4, 4, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Actividad de los jóvenes" note="Según su última lección">
          <div className="flex flex-wrap items-center gap-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie isAnimationActive={animate()} data={activity} dataKey="jovenes" nameKey="estado" innerRadius={52} outerRadius={80} paddingAngle={2} stroke="var(--card)" strokeWidth={2}>
                  {activity.map((a) => (
                    <Cell key={a.estado} fill={a.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={(v, n) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-2">
              {activity.map((a) => (
                <li key={a.estado} className="flex items-center gap-2 text-sm font-bold">
                  <span className="size-3 rounded-full" style={{ background: a.color }} />
                  {a.estado}
                  <span className="text-muted-foreground">· {a.jovenes}</span>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>

        <ChartCard title="Avance promedio por curso" note="Porcentaje medio de lecciones completadas">
          <ResponsiveContainer width="100%" height={Math.max(160, perCourse.length * 44)}>
            <BarChart data={perCourse} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" domain={[0, 100]} unit="%" tick={axis} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="curso" width={130} tick={axis} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, "avance"]} />
              <Bar dataKey="avance" isAnimationActive={animate()} radius={[0, 4, 4, 0]} maxBarSize={18}>
                {perCourse.map((c) => (
                  <Cell key={c.curso} fill={c.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 5 por XP">
          <ResponsiveContainer width="100%" height={Math.max(160, top.length * 44)}>
            <BarChart data={top} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" allowDecimals={false} tick={axis} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="nombre" width={110} tick={axis} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} formatter={(v) => [v, "XP"]} />
              <Bar dataKey="xp" isAnimationActive={animate()} fill="#f6bc3f" radius={[0, 4, 4, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function Students() {
  const { data } = useAdminData();
  const [open, setOpen] = useState<string | null>(null);
  if (!data) return null;

  return (
    <div className="mt-6 space-y-3 pb-6">
      {data.profiles.map((p) => {
        const mine = data.comps.filter((c) => c.user_id === p.id);
        const inactive = daysSince(p.last_activity_date) >= 7;
        const isOpen = open === p.id;
        return (
          <div key={p.id} className="rounded-[1.5rem] bg-card p-5 shadow-[var(--shadow-soft)]">
            <button className="flex w-full items-center gap-4 text-left" onClick={() => setOpen(isOpen ? null : p.id)} aria-expanded={isOpen}>
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl">{p.avatar_emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-extrabold">{p.display_name}</div>
                <div className="text-sm text-muted-foreground">
                  Última actividad: {p.last_activity_date ? new Date(p.last_activity_date).toLocaleDateString("es") : "nunca"}
                  {inactive && <span className="ml-2 font-bold text-destructive">· inactivo</span>}
                </div>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <Chip icon={Zap} value={p.xp} tone="bg-yellow/25" />
                <Chip icon={Flame} value={p.streak} tone="bg-orange/15" />
                <Chip icon={Award} value={data.ub.filter((b) => b.user_id === p.id).length} tone="bg-green/15" />
              </div>
              <ChevronDown className={cn("size-5 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
              <div className="mt-5 space-y-3 border-t pt-4">
                <div className="flex gap-2 sm:hidden">
                  <Chip icon={Zap} value={p.xp} tone="bg-yellow/25" />
                  <Chip icon={Flame} value={p.streak} tone="bg-orange/15" />
                  <Chip icon={Award} value={data.ub.filter((b) => b.user_id === p.id).length} tone="bg-green/15" />
                </div>
                {data.courses.map((c) => {
                  const look = courseLook(c);
                  const total = data.lessons.filter((l) => l.course_id === c.id).length;
                  const done = mine.filter((m) => m.course_id === c.id).length;
                  const pct = total ? Math.round((done / total) * 100) : 0;
                  return (
                    <div key={c.id} className="flex items-center gap-3">
                      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", look.tint, look.fg)}>
                        <look.icon className="size-5" strokeWidth={2.25} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="truncate">{c.title}</span>
                          <span className="shrink-0">{done}/{total} · {pct}%</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                          <div className={cn("h-full rounded-full", look.bg)} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Chip({ icon: Icon, value, tone }: { icon: LucideIcon; value: number; tone: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-extrabold", tone)}>
      <Icon className="size-4" strokeWidth={2.5} /> {value}
    </span>
  );
}

function Announce() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  async function post() {
    const { error } = await supabase.from("announcements").insert({ title, body });
    if (error) { toast.error("No se pudo publicar"); return; }
    setTitle(""); setBody("");
    toast.success("Anuncio publicado");
    qc.invalidateQueries({ queryKey: ["announcements"] });
  }
  return (
    <section className="mt-6 rounded-[1.5rem] bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-orange/15 text-orange">
          <Megaphone className="size-6" strokeWidth={2.25} />
        </span>
        <div>
          <h2 className="text-xl font-extrabold">Nuevo anuncio</h2>
          <p className="text-sm text-muted-foreground">Lo verán todos los jóvenes en su inicio.</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <Input className={field} placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea className="min-h-28 rounded-2xl border-2 bg-background px-4 py-3 text-base" placeholder="Mensaje para todos los jóvenes" value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <Button size="lg" className="mt-4 w-full rounded-full" disabled={!title || !body} onClick={post}>
        Publicar
      </Button>
    </section>
  );
}
