import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import mascot from "@/assets/fuego-mascot.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fuego+ — Aprende la Biblia jugando" },
      { name: "description", content: "Cursos bíblicos cortos y divertidos para jóvenes, con rachas, XP e insignias." },
      { property: "og:title", content: "Fuego+ — Aprende la Biblia jugando" },
      { property: "og:description", content: "Cursos bíblicos cortos y divertidos para jóvenes, con rachas, XP e insignias." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/home" });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="font-display text-3xl font-bold text-primary">fuego+</span>
        <Button asChild variant="outline" size="sm">
          <Link to="/auth">Iniciar sesión</Link>
        </Button>
      </header>
      <main className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-12 md:grid-cols-2">
        <img src={mascot} alt="Mascota oveja leyendo la Biblia" width={1024} height={1024} className="mx-auto w-72 animate-floaty md:w-96" />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            ¡La forma divertida de conocer la <span className="text-primary">Biblia</span>!
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Lecciones de 5 minutos, rachas diarias e insignias para jóvenes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:max-w-xs">
            <Button asChild size="lg"><Link to="/auth">Empezar ahora</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/auth">Ya tengo cuenta</Link></Button>
          </div>
        </div>
      </main>
    </div>
  );
}
