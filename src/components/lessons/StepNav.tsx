import { ArrowLeft, RotateCcw } from "lucide-react";

// Navegación dentro de una actividad: volver a la experiencia anterior o repetir la actual.
export function StepNav({
  onBack,
  onRepeat,
}: {
  onBack?: (() => void) | undefined;
  onRepeat?: (() => void) | undefined;
}) {
  if (!onBack && !onRepeat) return null;
  return (
    <div className="mt-5 flex items-center justify-between gap-3 text-sm font-bold text-muted-foreground">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Anterior
        </button>
      ) : (
        <span />
      )}
      {onRepeat && (
        <button
          type="button"
          onClick={onRepeat}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="size-4" /> Repetir interacción
        </button>
      )}
    </div>
  );
}
