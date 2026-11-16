import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import mascot from "@/assets/fuego-mascot.png";
import { LangSwitch, useLang } from "@/lib/i18n";

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
  const { t } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="font-display text-3xl font-black tracking-tight">fuego<span className="text-secondary">+</span></span>
        <div className="flex items-center gap-3">
          <LangSwitch />
          <Button asChild variant="outline" size="sm">
            <Link to="/admin">{t("Ver panel admin", "View admin panel")}</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-12 md:grid-cols-2">
        <img src={mascot} alt={t("Fuego+, la llama sonriente", "Fuego+, the smiling flame")} width={800} height={800} className="mx-auto w-72 animate-floaty rounded-[3rem] bg-cream p-8 md:w-96" />
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
            {t("Conoce su Palabra.", "Know His Word.")} <span className="text-primary">{t("Arde por Él.", "Burn for Him.")}</span>
          </h1>
          <blockquote className="mt-6 border-l-4 border-secondary pl-4 text-left text-lg leading-relaxed text-muted-foreground">
            {t("“¿No ardía nuestro corazón… mientras nos hablaba en el camino y nos abría las", "“Did not our heart burn within us, while he talked with us by the way, and while he opened to us the")}{" "}
            <strong className="font-extrabold text-foreground">{t("Escrituras", "scriptures")}</strong>?”
            <span className="mt-2 block text-sm font-bold text-secondary">— {t("Lucas 24:32", "Luke 24:32 (KJV)")}</span>
          </blockquote>
          <div className="mt-8 flex flex-col gap-3 sm:max-w-xs">
            <Button asChild size="lg"><Link to="/home">{t("Empezar ahora", "Start now")}</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/courses">{t("Ver cursos", "Browse courses")}</Link></Button>
          </div>
        </div>
      </main>
    </div>
  );
}
