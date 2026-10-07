import { Link } from "@tanstack/react-router";
import { Flame, Zap, Home, BookOpen, Award, Settings, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { useMe } from "@/lib/app-data";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/home", label: "Inicio", icon: Home },
  { to: "/courses", label: "Cursos", icon: BookOpen },
  { to: "/badges", label: "Insignias", icon: Award },
  { to: "/settings", label: "Ajustes", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { data: me } = useMe();
  const items = me?.isAdmin ? [...nav, { to: "/admin", label: "Admin", icon: ShieldCheck } as const] : nav;
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-60">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col gap-2 bg-sidebar p-4 md:flex">
        <span className="mb-6 px-3 font-display text-3xl font-black tracking-tight">fuego<span className="text-secondary">+</span></span>
        {items.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-muted-foreground hover:bg-muted"
            activeProps={{ className: "bg-primary !text-primary-foreground" }}
          >
            <n.icon className="size-6" /> {n.label}
          </Link>
        ))}
      </aside>
      <header className="sticky top-0 z-10 flex items-center justify-end gap-5 bg-background/90 px-5 py-3 backdrop-blur">
        <span className="mr-auto font-display text-2xl font-black tracking-tight md:hidden">fuego<span className="text-secondary">+</span></span>
        <span className="flex items-center gap-1 font-extrabold text-flame">
          <Flame className="size-5 fill-current" /> {me?.profile?.streak ?? 0}
        </span>
        <span className="flex items-center gap-1 font-extrabold text-gold">
          <Zap className="size-5 fill-current" /> {me?.profile?.xp ?? 0}
        </span>
        <span className="text-2xl">{me?.profile?.avatar_emoji ?? "🦁"}</span>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-10 flex justify-around border-t bg-background py-2 md:hidden">
        {items.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={cn("flex flex-col items-center rounded-xl px-3 py-1 text-[11px] font-semibold text-muted-foreground")}
            activeProps={{ className: "!text-primary bg-primary/10" }}
          >
            <n.icon className="size-6" />
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-4 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className="relative h-full rounded-full bg-primary transition-all duration-700"
        style={{ width: `${Math.max(value, 0)}%` }}
      >
        <div className="absolute inset-x-2 top-1 h-1 rounded-full bg-primary-foreground/30" />
      </div>
    </div>
  );
}
