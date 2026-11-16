import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Languages, Mail, Moon, RotateCcw, Target, Volume2, type LucideIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { resetState, updateState } from "@/lib/demo-store";
import { applyTheme, useMe } from "@/lib/app-data";
import { LangSwitch, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Ajustes — Fuego+" }, { name: "description", content: "Perfil y preferencias." }] }),
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
  const { t } = useLang();
  const { data: me } = useMe();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🦁");
  const [goal, setGoal] = useState(1);
  const [sound, setSound] = useState(true);
  const [emailN, setEmailN] = useState(true);
  const [dark, setDark] = useState(false);

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

  function save() {
    updateState((s) => ({
      ...s,
      profile: { ...s.profile, display_name: name, avatar_emoji: avatar, daily_goal: goal, sound_enabled: sound, email_notifications: emailN },
    }));
    toast.success(t("¡Guardado!", "Saved!"));
    qc.invalidateQueries({ queryKey: ["me"] });
  }

  function reset() {
    resetState();
    qc.invalidateQueries();
    toast.success(t("Progreso reiniciado", "Progress reset"));
  }

  return (
    <AppShell>
      <h1 className="text-4xl font-black md:text-5xl">{t("Ajustes", "Settings")}</h1>

      {/* Perfil */}
      <section className="mt-8 rounded-[1.5rem] bg-card p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-4">
          <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-5xl">{avatar}</span>
          <div className="min-w-0">
            <div className="truncate text-2xl font-black">{name || t("Tu nombre", "Your name")}</div>
            <div className="text-sm text-muted-foreground">{t("Versión demo: tu progreso se guarda en este navegador.", "Demo version: your progress is saved in this browser.")}</div>
          </div>
        </div>
        <label className="mt-6 block text-sm font-extrabold" htmlFor="nombre">{t("Nombre", "Name")}</label>
        <Input id="nombre" className={cn(field, "mt-2")} value={name} onChange={(e) => setName(e.target.value)} placeholder={t("Nombre", "Name")} />
        <div className="mt-5 text-sm font-extrabold">{t("Avatar", "Avatar")}</div>
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
      <SectionTitle>{t("Preferencias", "Preferences")}</SectionTitle>
      <div className="space-y-3">
        <SettingRow icon={Languages} tone="bg-sky/15 text-sky" title={t("Idioma", "Language")} description={t("Español o inglés.", "Spanish or English.")}>
          <LangSwitch />
        </SettingRow>
        <SettingRow icon={Target} tone="bg-orange/15 text-orange" title={t("Meta diaria", "Daily goal")} description={t("Lecciones que quieres completar cada día.", "Lessons you want to complete each day.")}>
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
        <SettingRow icon={Moon} tone="bg-primary/15 text-primary" title={t("Modo oscuro", "Dark mode")} description={t("Colores oscuros para estudiar de noche.", "Dark colors for studying at night.")}>
          <Switch checked={dark} onCheckedChange={(v) => { setDark(v); applyTheme(v); }} aria-label={t("Modo oscuro", "Dark mode")} />
        </SettingRow>
        <SettingRow icon={Volume2} tone="bg-yellow/25 text-[#a8740f]" title={t("Efectos de sonido", "Sound effects")} description={t("Sonidos al responder y completar lecciones.", "Sounds when answering and finishing lessons.")}>
          <Switch checked={sound} onCheckedChange={setSound} aria-label={t("Efectos de sonido", "Sound effects")} />
        </SettingRow>
        <SettingRow icon={Mail} tone="bg-green/15 text-green" title={t("Recordatorios por correo", "Email reminders")} description={t("Te avisamos para que no pierdas tu racha.", "We remind you so you don't lose your streak.")}>
          <Switch checked={emailN} onCheckedChange={setEmailN} aria-label={t("Recordatorios por correo", "Email reminders")} />
        </SettingRow>
      </div>
      <Button size="lg" className="mt-5 w-full rounded-full" onClick={save}>
        {t("Guardar cambios", "Save changes")}
      </Button>

      {/* Reiniciar la demo */}
      <button
        type="button"
        onClick={reset}
        className="mb-6 mt-12 flex w-full items-center gap-4 rounded-[1.5rem] bg-card p-5 text-left shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-orange/15 text-orange">
          <RotateCcw className="size-6" strokeWidth={2.25} />
        </span>
        <span className="text-lg font-extrabold">{t("Reiniciar progreso de la demo", "Reset demo progress")}</span>
      </button>
    </AppShell>
  );
}
