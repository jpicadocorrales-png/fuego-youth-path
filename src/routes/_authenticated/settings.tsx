import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { KeyRound, LogOut, Mail, Moon, Target, Volume2, type LucideIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { applyTheme, useMe } from "@/lib/app-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Ajustes — Fuego+" }, { name: "description", content: "Perfil, contraseña y preferencias." }] }),
  component: SettingsPage,
});

const avatars = ["🦁", "🐑", "🕊️", "🐟", "🌟", "🔥", "🌿", "👑"];
const field = "h-12 rounded-2xl border-2 bg-background px-4 text-base";

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-4 mt-12 text-2xl font-black md:text-3xl">{children}</h2>;
}

// Fila de ajuste con el mismo estilo que los anuncios: ícono en un color de la paleta,
// título, descripción y el control a la derecha.
function SettingRow({
  icon: Icon,
  tone,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  tone: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-[1.5rem] bg-card p-5 shadow-[var(--shadow-soft)]">
      <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", tone)}>
        <Icon className="size-6" strokeWidth={2.25} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-lg font-extrabold">{title}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: me } = useMe();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🦁");
  const [goal, setGoal] = useState(1);
  const [sound, setSound] = useState(true);
  const [emailN, setEmailN] = useState(true);
  const [dark, setDark] = useState(false);
  const [curPw, setCurPw] = useState("");
  const [pw, setPw] = useState("");

  useEffect(() => {
    if (me?.profile) {
      setName(me.profile.display_name);
      setAvatar(me.profile.avatar_emoji);
      setGoal(me.profile.daily_goal);
      setSound(me.profile.sound_enabled);
      setEmailN(me.profile.email_notifications);
    }
  }, [me?.profile]);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  async function save() {
    const { error } = await supabase.from("profiles").update({
      display_name: name, avatar_emoji: avatar, daily_goal: goal, sound_enabled: sound, email_notifications: emailN,
    }).eq("id", me!.id);
    if (error) { toast.error("No se pudo guardar"); return; }
    toast.success("¡Guardado!");
    qc.invalidateQueries({ queryKey: ["me"] });
  }

  async function changePw() {
    const { error } = await supabase.auth.updateUser({ password: pw, current_password: curPw } as never);
    if (error) { toast.error(error.message); return; }
    setPw(""); setCurPw("");
    toast.success("Contraseña actualizada");
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <AppShell>
      <h1 className="text-4xl font-black md:text-5xl">Ajustes</h1>

      {/* Perfil */}
      <section className="mt-8 rounded-[1.5rem] bg-card p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-4">
          <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-5xl">{avatar}</span>
          <div className="min-w-0">
            <div className="truncate text-2xl font-black">{name || "Tu nombre"}</div>
            <div className="truncate text-sm text-muted-foreground">{me?.email}</div>
          </div>
        </div>
        <label className="mt-6 block text-sm font-extrabold" htmlFor="nombre">Nombre</label>
        <Input id="nombre" className={cn(field, "mt-2")} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
        <div className="mt-5 text-sm font-extrabold">Avatar</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {avatars.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={avatar === a}
              onClick={() => setAvatar(a)}
              className={cn(
                "flex size-12 items-center justify-center rounded-2xl bg-muted text-2xl transition-transform hover:scale-105",
                avatar === a && "bg-primary/15 ring-2 ring-primary",
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </section>

      {/* Preferencias */}
      <SectionTitle>Preferencias</SectionTitle>
      <div className="space-y-3">
        <SettingRow icon={Target} tone="bg-orange/15 text-orange" title="Meta diaria" description="Lecciones que quieres completar cada día.">
          <div className="flex gap-1.5">
            {[1, 2, 3, 5].map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={goal === g}
                onClick={() => setGoal(g)}
                className={cn(
                  "size-10 rounded-xl text-sm font-extrabold transition-colors",
                  goal === g ? "bg-orange text-white" : "bg-muted text-foreground hover:bg-orange/15",
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </SettingRow>
        <SettingRow icon={Moon} tone="bg-primary/15 text-primary" title="Modo oscuro" description="Colores oscuros para estudiar de noche.">
          <Switch checked={dark} onCheckedChange={(v) => { setDark(v); applyTheme(v); }} aria-label="Modo oscuro" />
        </SettingRow>
        <SettingRow icon={Volume2} tone="bg-yellow/25 text-[#a8740f]" title="Efectos de sonido" description="Sonidos al responder y completar lecciones.">
          <Switch checked={sound} onCheckedChange={setSound} aria-label="Efectos de sonido" />
        </SettingRow>
        <SettingRow icon={Mail} tone="bg-green/15 text-green" title="Recordatorios por correo" description="Te avisamos para que no pierdas tu racha.">
          <Switch checked={emailN} onCheckedChange={setEmailN} aria-label="Recordatorios por correo" />
        </SettingRow>
      </div>
      <Button size="lg" className="mt-5 w-full rounded-full" onClick={save}>
        Guardar cambios
      </Button>

      {/* Contraseña */}
      <SectionTitle>Contraseña</SectionTitle>
      <section className="rounded-[1.5rem] bg-card p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-pink/20 text-[#d13f95]">
            <KeyRound className="size-6" strokeWidth={2.25} />
          </span>
          <p className="text-sm text-muted-foreground">Usa al menos 6 caracteres.</p>
        </div>
        <div className="mt-5 space-y-3">
          <Input className={field} type="password" placeholder="Contraseña actual" value={curPw} onChange={(e) => setCurPw(e.target.value)} />
          <Input className={field} type="password" placeholder="Nueva contraseña" minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <Button variant="secondary" className="mt-4 w-full rounded-full" disabled={pw.length < 6} onClick={changePw}>
          Cambiar contraseña
        </Button>
      </section>

      {/* Sesión */}
      <button
        type="button"
        onClick={signOut}
        className="mb-6 mt-12 flex w-full items-center gap-4 rounded-[1.5rem] bg-card p-5 text-left shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-orange/15 text-orange">
          <LogOut className="size-6" strokeWidth={2.25} />
        </span>
        <span className="text-lg font-extrabold">Cerrar sesión</span>
      </button>
    </AppShell>
  );
}
