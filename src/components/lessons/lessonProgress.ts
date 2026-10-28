// Utilidades compartidas por las experiencias interactivas de las lecciones.
import { useEffect, type Dispatch, type RefObject, type SetStateAction } from "react";

// Avance de una actividad durante la sesión actual de la lección. Vive en el estado de la lección:
// se conserva al moverse entre pantallas y vuelve a empezar cada vez que la lección se abre desde el curso.
// La lección completada se registra aparte, en el progreso general del curso.
export type ActivitySession = {
  index: number; // experiencia actual (-1 = introducción de la actividad; total = conclusión)
  done: boolean[]; // experiencias completadas en esta sesión
  rounds: number[]; // veces que se repitió cada experiencia, para reiniciar solo esa
};
export type SetActivity = Dispatch<SetStateAction<ActivitySession>>;

export const newActivity = (total: number, start = 0): ActivitySession => ({
  index: start,
  done: Array<boolean>(total).fill(false),
  rounds: Array<number>(total).fill(0),
});

export function activityActions(set: SetActivity) {
  return {
    go(index: number) {
      set((s) => ({ ...s, index }));
      window.scrollTo({ top: 0 });
    },
    complete(i: number) {
      set((s) => ({ ...s, done: s.done.map((d, k) => d || k === i) }));
    },
    // Reinicia únicamente la experiencia i; las demás conservan su estado.
    repeat(i: number) {
      set((s) => ({
        ...s,
        done: s.done.map((d, k) => (k === i ? false : d)),
        rounds: s.rounds.map((r, k) => (k === i ? r + 1 : r)),
      }));
    },
  };
}

// Versiones anteriores guardaban este avance en el navegador, y por eso la lección
// reabría directamente en la conclusión. Se borra para que no quede rastro.
export function clearLegacyProgress() {
  try {
    localStorage.removeItem("fuego.jesus.profecias");
    localStorage.removeItem("fuego.jesus.yosoy");
  } catch {
    // Sin acceso al almacenamiento: no hay nada que limpiar.
  }
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Botón «Atrás» de la lección: cada actividad registra cómo retroceder un paso dentro de ella.
// El manejador devuelve true si retrocedió; si devuelve false, la lección vuelve a la actividad anterior.
export type BackRef = RefObject<(() => boolean) | null>;

export function useBackStep(backRef: BackRef | undefined, onBack: () => boolean) {
  useEffect(() => {
    if (!backRef) return;
    backRef.current = onBack;
    return () => {
      backRef.current = null;
    };
  });
}
