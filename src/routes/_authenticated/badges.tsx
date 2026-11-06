import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useBadges } from "@/lib/app-data";
import { badgeLook } from "@/lib/badge-look";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/badges")({
  head: () => ({ meta: [{ title: "Insignias — Fuego+" }, { name: "description", content: "Premios por tus metas cumplidas." }] }),
  component: BadgesPage,
});

function BadgesPage() {
  const { data: badges = [] } = useBadges();
  const earned = badges.filter((b) => b.earnedAt).length;
  const pct = badges.length ? Math.round((earned / badges.length) * 100) : 0;
  return (
    <AppShell>
      <h1 className="text-4xl font-black md:text-5xl">Insignias</h1>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-green transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <span className="shrink-0 text-sm font-extrabold">
          {earned} de {badges.length} ganadas
        </span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 pb-6 sm:grid-cols-3">
        {badges.map((b, i) => {
          const look = badgeLook(b);
          const won = !!b.earnedAt;
          return (
            <div
              key={b.id}
              className={cn(
                "flex animate-pop flex-col items-center rounded-[1.5rem] p-5 text-center",
                won ? "bg-card shadow-[var(--shadow-soft)]" : "bg-card/60",
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span
                className={cn(
                  "relative flex size-16 items-center justify-center rounded-2xl",
                  won ? look.solid : "bg-muted text-muted-foreground",
                )}
              >
                <look.icon className="size-8" strokeWidth={2.25} />
                {!won && (
                  <span className="absolute -bottom-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-card text-muted-foreground shadow-[var(--shadow-soft)]">
                    <Lock className="size-3.5" strokeWidth={2.5} />
                  </span>
                )}
              </span>
              <div className={cn("mt-3 text-lg font-extrabold leading-tight", !won && "text-muted-foreground")}>{b.name}</div>
              <p className="mt-1 text-sm text-muted-foreground">{b.description}</p>
              {won && (
                <div className={cn("mt-2 text-xs font-extrabold uppercase tracking-wide", look.fg)}>
                  Ganada el {new Date(b.earnedAt!).toLocaleDateString("es")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
