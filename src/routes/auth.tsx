import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import mascot from "@/assets/mascot.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Sendero" },
      { name: "description", content: "Inicia sesión o crea tu cuenta en Sendero." },
      { property: "og:title", content: "Entrar — Sendero" },
      { property: "og:description", content: "Inicia sesión o crea tu cuenta en Sendero." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (mode === "up") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/home", data: { display_name: name } },
      });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      if (!data.session) { toast.success("¡Listo! Revisa tu correo para confirmar tu cuenta."); return; }
      navigate({ to: "/home" });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) { toast.error("Correo o contraseña incorrectos"); return; }
      navigate({ to: "/home" });
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) { toast.error("No se pudo entrar con Google"); return; }
    if (r.redirected) return;
    navigate({ to: "/home" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <img src={mascot} alt="" width={1024} height={1024} className="mx-auto w-28 animate-floaty" />
        <h1 className="mt-2 text-center text-3xl font-bold">
          {mode === "in" ? "¡Hola de nuevo!" : "Crea tu perfil"}
        </h1>
        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode === "up" && (
            <Input className="h-12 rounded-xl border-2" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <Input className="h-12 rounded-xl border-2" type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input className="h-12 rounded-xl border-2" type="password" placeholder="Contraseña" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {mode === "in" ? "Entrar" : "Crear cuenta"}
          </Button>
        </form>
        <Button variant="outline" className="mt-3 w-full" size="lg" onClick={google}>
          Continuar con Google
        </Button>
        <button
          className="mt-6 w-full text-center text-sm font-bold text-secondary"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
        >
          {mode === "in" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Entra"}
        </button>
      </div>
    </div>
  );
}
