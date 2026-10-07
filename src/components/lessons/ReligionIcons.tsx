import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ReligionKey = "cri" | "isl" | "jud" | "hin" | "bud";

const paths: Record<ReligionKey, ReactNode> = {
  cri: <path d="M12 3v18M6.5 8.5h11" />,
  isl: (
    <>
      <path d="M14.5 4.2a8 8 0 1 0 5.3 12.6A6.6 6.6 0 1 1 14.5 4.2z" />
      <path d="M18 6.5l.7 1.6 1.7.2-1.3 1.1.4 1.7-1.5-.9-1.5.9.4-1.7-1.3-1.1 1.7-.2z" />
    </>
  ),
  jud: (
    <>
      <path d="M12 3.2l7.6 13.1H4.4z" />
      <path d="M12 20.8L4.4 7.7h15.2z" />
    </>
  ),
  hin: (
    <>
      <path d="M12 5.5c2.2 2.6 2.2 6.6 0 10.5-2.2-3.9-2.2-7.9 0-10.5z" />
      <path d="M12 16c-3.4 0-6.4-2.1-7.8-5.2 3.4 0 6 1.9 7.8 5.2z" />
      <path d="M12 16c3.4 0 6.4-2.1 7.8-5.2-3.4 0-6 1.9-7.8 5.2z" />
      <path d="M5.5 19.5h13" />
    </>
  ),
  bud: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 4v6M12 14v6M4 12h6M14 12h6M6.3 6.3l4.3 4.3M13.4 13.4l4.3 4.3M17.7 6.3l-4.3 4.3M10.6 13.4l-4.3 4.3" />
    </>
  ),
};

export const religionTone: Record<ReligionKey, string> = {
  cri: "bg-primary text-primary-foreground",
  isl: "bg-green text-primary-foreground",
  jud: "bg-secondary text-secondary-foreground",
  hin: "bg-yellow text-foreground",
  bud: "bg-pink text-foreground",
};

export function ReligionIcon({ k, className }: { k: ReligionKey; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cn("size-6", className)} aria-hidden>
      {paths[k]}
    </svg>
  );
}

/** Icon inside a colored rounded chip */
export function ReligionBadge({ k, size = "md" }: { k: ReligionKey; size?: "sm" | "md" | "lg" }) {
  const box = size === "lg" ? "size-16 rounded-2xl" : size === "sm" ? "size-7 rounded-lg" : "size-11 rounded-xl";
  const icon = size === "lg" ? "size-9" : size === "sm" ? "size-4" : "size-6";
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center", box, religionTone[k])}>
      <ReligionIcon k={k} className={icon} />
    </span>
  );
}
