import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const courseColor: Record<string, string> = {
  green: "bg-green",
  sky: "bg-sky",
  orange: "bg-orange",
  pink: "bg-pink",
  yellow: "bg-yellow",
};
export const courseText: Record<string, string> = {
  green: "text-green",
  sky: "text-sky",
  orange: "text-orange",
  pink: "text-pink",
  yellow: "text-yellow",
};

async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("No session");
  return data.user.id;
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const id = await uid();
      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", id),
      ]);
      const { data: u } = await supabase.auth.getUser();
      return {
        id,
        email: u.user?.email ?? "",
        profile,
        isAdmin: !!roles?.some((r) => r.role === "admin"),
      };
    },
  });
}

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const id = await uid();
      const [{ data: courses }, { data: lessons }, { data: done }] = await Promise.all([
        supabase.from("courses").select("*").order("order_index"),
        supabase.from("lessons").select("id, course_id, title, order_index, xp").order("order_index"),
        supabase.from("lesson_completions").select("lesson_id, course_id, completed_at").eq("user_id", id),
      ]);
      const doneSet = new Set((done ?? []).map((d) => d.lesson_id));
      return (courses ?? []).map((c) => {
        const ls = (lessons ?? []).filter((l) => l.course_id === c.id);
        const completed = ls.filter((l) => doneSet.has(l.id)).length;
        return {
          ...c,
          lessons: ls.map((l) => ({ ...l, done: doneSet.has(l.id) })),
          total: ls.length,
          completed,
          pct: ls.length ? Math.round((completed / ls.length) * 100) : 0,
        };
      });
    },
  });
}

export function useCompletions() {
  return useQuery({
    queryKey: ["completions"],
    queryFn: async () => {
      const id = await uid();
      const { data } = await supabase
        .from("lesson_completions")
        .select("completed_at, score")
        .eq("user_id", id);
      return data ?? [];
    },
  });
}

export function useBadges() {
  return useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      const id = await uid();
      const [{ data: badges }, { data: mine }] = await Promise.all([
        supabase.from("badges").select("*").order("threshold"),
        supabase.from("user_badges").select("badge_id, earned_at").eq("user_id", id),
      ]);
      const m = new Map((mine ?? []).map((b) => [b.badge_id, b.earned_at]));
      return (badges ?? []).map((b) => ({ ...b, earnedAt: m.get(b.id) ?? null }));
    },
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
  });
}

export function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}
