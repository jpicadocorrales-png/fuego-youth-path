import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { applyTheme, useMe } from "@/lib/app-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Ajustes — Sendero" }, { name: "description", content: "Perfil, contraseña y preferencias." }] }),
  component: SettingsPage,
});

const avatars = ["🦁", "🐑", "🕊️", "🐟", "🌟", "🔥", "🌿", "👑"];

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
      <h1 className="text-3xl font-bold">Ajustes</h1>

      <section className="card-chunky mt-6 space-y-4 p-5">
        <h2 className="text-xl font-bold">Usuario</h2>
        <div className="text-sm text-muted-foreground">{me?.email}</div>
        <Input className="h-12 rounded-xl border-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
        <div className="flex flex-wrap gap-2">
          {avatars.map((a) => (
            <button key={a} onClick={() => setAvatar(a)} className={cn("flex size-12 items-center justify-center rounded-xl border-2 text-2xl", avatar === a && "border-secondary bg-secondary/10")}>{a}</button>
          ))}
        </div>
      </section>

      <section className="card-chunky mt-4 space-y-4 p-5">
        <h2 className="text-xl font-bold">Preferencias</h2>
        <div>
          <div className="mb-2 font-bold">Meta diaria (lecciones)</div>
          <div className="flex gap-2">
            {[1, 2, 3, 5].map((g) => (
              <button key={g} onClick={() => setGoal(g)} className={cn("rounded-xl border-2 px-4 py-2 font-extrabold", goal === g && "border-primary bg-accent text-accent-foreground")}>{g}</button>
            ))}
          </div>
        </div>
        <label className="flex items-center justify-between font-bold">Modo oscuro <Switch checked={dark} onCheckedChange={(v) => { setDark(v); applyTheme(v); }} /></label>
        <label className="flex items-center justify-between font-bold">Efectos de sonido <Switch checked={sound} onCheckedChange={setSound} /></label>
        <label className="flex items-center justify-between font-bold">Recordatorios por correo <Switch checked={emailN} onCheckedChange={setEmailN} /></label>
        <Button onClick={save}>Guardar cambios</Button>
      </section>

      <section className="card-chunky mt-4 space-y-3 p-5">
        <h2 className="text-xl font-bold">Contraseña</h2>
        <Input className="h-12 rounded-xl border-2" type="password" placeholder="Contraseña actual" value={curPw} onChange={(e) => setCurPw(e.target.value)} />
        <Input className="h-12 rounded-xl border-2" type="password" placeholder="Nueva contraseña" minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} />
        <Button variant="secondary" disabled={pw.length < 6} onClick={changePw}>Cambiar contraseña</Button>
      </section>

      <Button variant="outline" className="mt-6 w-full" onClick={signOut}>Cerrar sesión</Button>
    </AppShell>
  );
}
