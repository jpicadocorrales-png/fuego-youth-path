// Arrastre con Pointer Events dentro de una escena SVG (mouse y pantallas táctiles).
// Las posiciones se reportan en coordenadas del viewBox, así la escena funciona a cualquier tamaño.
import { useRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type RefObject } from "react";

export type Pt = { x: number; y: number };

export const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
export const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

export function toSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number): Pt {
  const m = svg.getScreenCTM();
  if (!m) return { x: 0, y: 0 };
  const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
  return { x: p.x, y: p.y };
}

type DragHandlers<T> = {
  // `start` es el punto donde empezó el arrastre.
  onMove: (id: T, p: Pt, start: Pt) => void;
  // `moved` es false cuando el usuario solo tocó el objeto (sirve como alternativa a arrastrar).
  onEnd: (id: T, p: Pt, moved: boolean) => void;
};

export function useSvgDrag<T>(svg: RefObject<SVGSVGElement | null>, handlers: DragHandlers<T>) {
  const active = useRef<{ id: T; start: Pt; moved: boolean } | null>(null);
  const h = useRef(handlers);
  h.current = handlers;

  const point = (e: PointerEvent) =>
    svg.current ? toSvgPoint(svg.current, e.clientX, e.clientY) : { x: 0, y: 0 };

  return (id: T) => ({
    onPointerDown: (e: PointerEvent<SVGElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      active.current = { id, start: point(e), moved: false };
    },
    onPointerMove: (e: PointerEvent<SVGElement>) => {
      const a = active.current;
      if (!a) return;
      const p = point(e);
      if (!a.moved && dist(p, a.start) < 6) return;
      a.moved = true;
      h.current.onMove(a.id, p, a.start);
    },
    onPointerUp: (e: PointerEvent<SVGElement>) => {
      const a = active.current;
      if (!a) return;
      active.current = null;
      h.current.onEnd(a.id, point(e), a.moved);
    },
    onPointerCancel: () => {
      const a = active.current;
      if (!a) return;
      active.current = null;
      h.current.onEnd(a.id, a.start, true);
    },
  });
}

// Hace que un elemento SVG se pueda enfocar y activar con Enter o Espacio.
export function pressable(label: string, onPress: () => void) {
  return {
    role: "button",
    tabIndex: 0,
    "aria-label": label,
    onKeyDown: (e: KeyboardEvent<SVGElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onPress();
      }
    },
  };
}

// Posiciona un grupo SVG con CSS para que pueda volver a su lugar con una transición suave.
export function placeAt(p: Pt, dragging: boolean, rotate = 0, scale = 1, ms = 500): CSSProperties {
  return {
    transform: `translate(${p.x}px, ${p.y}px) rotate(${rotate}deg) scale(${scale})`,
    transformBox: "view-box",
    transformOrigin: "0 0",
    transition: dragging ? "none" : `transform ${ms}ms cubic-bezier(.2,.9,.3,1.1)`,
  };
}

// Divide una línea quebrada en puntos cada `step` unidades (para seguir senderos).
export function densify(points: Pt[], step: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    const n = Math.max(1, Math.round(dist(a, b) / step));
    for (let k = 0; k < n; k++) out.push({ x: a.x + ((b.x - a.x) * k) / n, y: a.y + ((b.y - a.y) * k) / n });
  }
  out.push(points[points.length - 1]!);
  return out;
}

export const polyline = (points: Pt[]) => points.map((p) => `${p.x},${p.y}`).join(" ");
