import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useBadges } from "@/lib/app-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/badges")({
  head: () => ({ meta: [{ title: "Insignias — Fuego+" }, { name: "description", content: "Premios por tus metas cumplidas." }] }),
  component: BadgesPage,
});

function BadgesPage() {
  const { data: badges = [] } = useBadges();
  const earned = badges.filter((b) => b.earnedAt).length;
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Insignias</h1>
      <p className="text-muted-foreground">Has ganado {earned} de {badges.length}</p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {badges.map((b, i) => (
          <div
            key={b.id}
            className={cn("card-chunky animate-pop p-5 text-center", b.earnedAt ? "border-gold" : "opacity-60 grayscale")}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className={cn("mx-auto flex size-20 items-center justify-center rounded-full text-5xl", b.earnedAt ? "bg-gold/30" : "bg-muted")}>
              {b.emoji}
            </div>
            <div className="mt-3 font-display text-lg font-bold">{b.name}</div>
            <p className="text-xs text-muted-foreground">{b.description}</p>
            {b.earnedAt && <div className="mt-2 text-xs font-extrabold uppercase text-gold">Ganada {new Date(b.earnedAt).toLocaleDateString("es")}</div>}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
