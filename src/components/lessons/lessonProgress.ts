// Utilidades compartidas por las experiencias interactivas de las lecciones.

// Cantidad de pasos completados de una experiencia, guardada para no perder el avance al navegar.
export function loadCount(key: string, max: number) {
  try {
    const n = Number(localStorage.getItem(key));
    return Number.isFinite(n) ? Math.min(Math.max(Math.floor(n), 0), max) : 0;
  } catch {
    return 0;
  }
}

export function saveCount(key: string, n: number) {
  try {
    localStorage.setItem(key, String(n));
  } catch {
    // Sin almacenamiento disponible: el avance solo dura mientras la pantalla esté abierta.
  }
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
