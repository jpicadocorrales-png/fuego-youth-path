// Piezas comunes de las escenas «YO SOY».
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { prefersReducedMotion } from "./lessonProgress";

export const V = "#5c30ff";
export const V2 = "#8a6bff";
export const NIGHT = "#22145e";
export const C = "#e63c23";
export const P = "#f971c3";
export const Y = "#f6bc3f";
export const G = "#008c47";
export const G2 = "#3fae6a";
export const G3 = "#8ed19f";
export const CR = "#ffe8ce";
export const INK = "#3b2a4a";
export const SAND = "#f2d7b3";
export const SAND2 = "#d9b98f";
export const STONE = "#c9bfd6";
export const STONE2 = "#9a8db0";
export const WOOD = "#b8652f";
export const WOOD2 = "#8f4a22";

export type SceneProps = { onDone: () => void };

// Marca la escena como resuelta y avisa al terminar la animación de transformación.
export function useFinish(onDone: () => void, delay: number) {
  const [complete, setComplete] = useState(false);
  const cb = useRef(onDone);
  cb.current = onDone;
  useEffect(() => {
    if (!complete) return;
    const t = setTimeout(() => cb.current(), prefersReducedMotion() ? 0 : delay);
    return () => clearTimeout(t);
  }, [complete, delay]);
  return [complete, () => setComplete(true)] as const;
}

export function Stage({
  svgRef,
  label,
  height = 300,
  hint,
  children,
}: {
  svgRef: RefObject<SVGSVGElement | null>;
  label: string;
  height?: number;
  hint?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-soft)]">
        <svg
          ref={svgRef}
          viewBox={`0 0 360 ${height}`}
          className="block h-auto w-full select-none"
          role="group"
          aria-label={label}
        >
          {children}
        </svg>
      </div>
      <p className="mt-2 min-h-5 text-center text-sm text-muted-foreground" aria-live="polite">
        {hint ?? ""}
      </p>
    </div>
  );
}
