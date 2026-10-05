import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, ProgressBar } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { courseColor, useMe } from "@/lib/app-data";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Administración — Sendero" }, { name: "description", content: "Seguimiento de los jóvenes y sus cursos." }] }),
  component: AdminPage,
});

const field = "h-11 rounded-xl border-2";

function AdminPage() {
  const { data: me, isLoading } = useMe();
  if (isLoading) return <AppShell><p>Cargando…</p></AppShell>;
  if (!me?.isAdmin) return <AppShell><p className="font-bold">Solo los administradores pueden ver esta página.</p></AppShell>;
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Administración</h1>
      <Tabs defaultValue="students" className="mt-4">
        <TabsList className="h-auto flex-wrap rounded-xl">
          <TabsTrigger value="students" className="font-bold">Jóvenes</TabsTrigger>
          <TabsTrigger value="announce" className="font-bold">Anuncios</TabsTrigger>
          <TabsTrigger value="content" className="font-bold">Crear contenido</TabsTrigger>
        </TabsList>
        <TabsContent value="students"><Students /></TabsContent>
        <TabsContent value="announce"><Announce /></TabsContent>
        <TabsContent value="content"><Content /></TabsContent>
      </Tabs>
    </AppShell>
  );
}

function Students() {
  const { data } = useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const [{ data: profiles }, { data: courses }, { data: lessons }, { data: comps }, { data: ub }] = await Promise.all([
        supabase.from("profiles").select("*").order("xp", { ascending: false }),
        supabase.from("courses").select("id, title, emoji").order("order_index"),
        supabase.from("lessons").select("id, course_id"),
        supabase.from("lesson_completions").select("user_id, course_id"),
        supabase.from("user_badges").select("user_id"),
      ]);
      return { profiles: profiles ?? [], courses: courses ?? [], lessons: lessons ?? [], comps: comps ?? [], ub: ub ?? [] };
    },
  });
  const [open, setOpen] = useState<string | null>(null);
  if (!data) return null;
  const today = new Date();
  const active = data.profiles.filter((p) => p.last_activity_date && (today.getTime() - new Date(p.last_activity_date).getTime()) / 864e5 < 7).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Jóvenes" value={data.profiles.length} emoji="👥" />
        <Stat label="Activos (7 días)" value={active} emoji="🔥" />
        <Stat label="Lecciones hechas" value={data.comps.length} emoji="📖" />
      </div>
      {data.profiles.map((p) => {
        const mine = data.comps.filter((c) => c.user_id === p.id);
        const inactive = !p.last_activity_date || (today.getTime() - new Date(p.last_activity_date).getTime()) / 864e5 >= 7;
        return (
          <div key={p.id} className="card-chunky p-4">
            <button className="flex w-full items-center gap-3 text-left" onClick={() => setOpen(open === p.id ? null : p.id)}>
              <span className="text-3xl">{p.avatar_emoji}</span>
              <div className="flex-1">
                <div className="font-bold">{p.display_name}</div>
                <div className="text-xs text-muted-foreground">
                  Última actividad: {p.last_activity_date ? new Date(p.last_activity_date).toLocaleDateString("es") : "nunca"}
                  {inactive && <span className="ml-2 font-bold text-destructive">· inactivo</span>}
                </div>
              </div>
              <div className="text-right text-sm font-extrabold">
                <div className="text-gold">⚡ {p.xp}</div>
                <div className="text-flame">🔥 {p.streak}</div>
              </div>
              <div className="hidden text-sm font-bold sm:block">🏅 {data.ub.filter((b) => b.user_id === p.id).length}</div>
            </button>
            {open === p.id && (
              <div className="mt-4 space-y-2 border-t-2 pt-3">
                {data.courses.map((c) => {
                  const total = data.lessons.filter((l) => l.course_id === c.id).length;
                  const done = mine.filter((m) => m.course_id === c.id).length;
                  const pct = total ? Math.round((done / total) * 100) : 0;
                  return (
                    <div key={c.id}>
                      <div className="flex justify-between text-sm font-bold"><span>{c.emoji} {c.title}</span><span>{done}/{total} · {pct}%</span></div>
                      <ProgressBar value={pct} className="mt-1 h-2" />
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

function Stat({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  return (
    <div className="card-chunky p-4">
      <div className="text-2xl">{emoji}</div>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="text-xs font-extrabold uppercase text-muted-foreground">{label}</div>
    </div>
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
    <div className="card-chunky space-y-3 p-5">
      <h2 className="text-xl font-bold">Nuevo anuncio</h2>
      <Input className={field} placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea className="rounded-xl border-2" placeholder="Mensaje para todos los jóvenes" value={body} onChange={(e) => setBody(e.target.value)} />
      <Button disabled={!title || !body} onClick={post}>Publicar</Button>
    </div>
  );
}

type Q = { kind: string; prompt: string; options: string[]; correct: number };
const emptyQ = (): Q => ({ kind: "multiple", prompt: "", options: ["", "", ""], correct: 0 });

function Content() {
  const qc = useQueryClient();
  const { data: courses = [] } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => (await supabase.from("courses").select("id, title, emoji").order("order_index")).data ?? [],
  });
  const [c, setC] = useState({ title: "", description: "", emoji: "📖", color: "sky", level: "Principiante" });
  const [courseId, setCourseId] = useState("");
  const [l, setL] = useState({ title: "", passage: "", reference: "" });
  const [qs, setQs] = useState<Q[]>([emptyQ()]);

  async function createCourse() {
    const { error } = await supabase.from("courses").insert({ ...c, order_index: courses.length + 1 });
    if (error) { toast.error("Error al crear el curso"); return; }
    toast.success("Curso creado");
    setC({ ...c, title: "", description: "" });
    qc.invalidateQueries();
  }

  async function createLesson() {
    const { count } = await supabase.from("lessons").select("id", { count: "exact", head: true }).eq("course_id", courseId);
    const { data: lesson, error } = await supabase.from("lessons").insert({ ...l, course_id: courseId, order_index: (count ?? 0) + 1 }).select().single();
    if (error || !lesson) { toast.error("Error al crear la lección"); return; }
    const rows = qs.filter((q) => q.prompt).map((q, i) => ({
      lesson_id: lesson.id, kind: q.kind, prompt: q.prompt,
      options: q.kind === "truefalse" ? ["Verdadero", "Falso"] : q.options.filter(Boolean),
      correct_index: q.correct, order_index: i + 1,
    }));
    if (rows.length) await supabase.from("questions").insert(rows);
    toast.success("Lección creada");
    setL({ title: "", passage: "", reference: "" });
    setQs([emptyQ()]);
    qc.invalidateQueries();
  }

  const upd = (i: number, patch: Partial<Q>) => setQs(qs.map((q, j) => (j === i ? { ...q, ...patch } : q)));

  return (
    <div className="space-y-4">
      <div className="card-chunky space-y-3 p-5">
        <h2 className="text-xl font-bold">Nuevo curso</h2>
        <div className="flex gap-2">
          <Input className={`${field} w-20 text-center text-xl`} value={c.emoji} onChange={(e) => setC({ ...c, emoji: e.target.value })} />
          <Input className={field} placeholder="Título del curso" value={c.title} onChange={(e) => setC({ ...c, title: e.target.value })} />
        </div>
        <Textarea className="rounded-xl border-2" placeholder="Descripción" value={c.description} onChange={(e) => setC({ ...c, description: e.target.value })} />
        <div className="flex flex-wrap gap-2">
          {["green", "sky", "orange", "pink"].map((col) => (
            <button key={col} onClick={() => setC({ ...c, color: col })} className={`size-10 rounded-full ${courseColor[col]} ${c.color === col ? "ring-4 ring-ring" : ""}`} aria-label={col} />
          ))}
          <select className="rounded-xl border-2 bg-card px-3 font-bold" value={c.level} onChange={(e) => setC({ ...c, level: e.target.value })}>
            <option>Principiante</option><option>Intermedio</option><option>Avanzado</option>
          </select>
        </div>
        <Button disabled={!c.title} onClick={createCourse}>Crear curso</Button>
      </div>

      <div className="card-chunky space-y-3 p-5">
        <h2 className="text-xl font-bold">Nueva lección</h2>
        <select className="h-11 w-full rounded-xl border-2 bg-card px-3 font-bold" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">Elige un curso…</option>
          {courses.map((x) => <option key={x.id} value={x.id}>{x.emoji} {x.title}</option>)}
        </select>
        <Input className={field} placeholder="Título de la lección" value={l.title} onChange={(e) => setL({ ...l, title: e.target.value })} />
        <Textarea className="rounded-xl border-2" placeholder="Pasaje bíblico" value={l.passage} onChange={(e) => setL({ ...l, passage: e.target.value })} />
        <Input className={field} placeholder="Referencia (ej. Juan 3:16)" value={l.reference} onChange={(e) => setL({ ...l, reference: e.target.value })} />

        {qs.map((q, i) => (
          <div key={i} className="space-y-2 rounded-xl bg-muted p-3">
            <div className="flex gap-2">
              <select className="rounded-lg border-2 bg-card px-2 text-sm font-bold" value={q.kind} onChange={(e) => upd(i, { kind: e.target.value, correct: 0 })}>
                <option value="multiple">Opción múltiple</option>
                <option value="fill">Completar versículo</option>
                <option value="truefalse">Verdadero / Falso</option>
              </select>
              <Input className="rounded-lg border-2" placeholder={q.kind === "fill" ? "Texto con ___" : "Pregunta"} value={q.prompt} onChange={(e) => upd(i, { prompt: e.target.value })} />
            </div>
            {(q.kind === "truefalse" ? ["Verdadero", "Falso"] : q.options).map((o, k) => (
              <div key={k} className="flex items-center gap-2">
                <input type="radio" checked={q.correct === k} onChange={() => upd(i, { correct: k })} aria-label="Correcta" />
                {q.kind === "truefalse" ? <span className="font-bold">{o}</span> : (
                  <Input className="h-9 rounded-lg border-2" placeholder={`Opción ${k + 1}`} value={o} onChange={(e) => upd(i, { options: q.options.map((x, z) => (z === k ? e.target.value : x)) })} />
                )}
              </div>
            ))}
          </div>
        ))}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setQs([...qs, emptyQ()])}>+ Pregunta</Button>
          <Button disabled={!courseId || !l.title} onClick={createLesson}>Crear lección</Button>
        </div>
      </div>
    </div>
  );
}
