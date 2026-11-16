import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// Idioma de la interfaz. Cada texto se escribe en los dos idiomas donde se usa:
//   const { t } = useLang();  t("Cursos", "Courses")
// El idioma se elige con ?lang=en / ?lang=es en la URL, luego lo guardado en el
// navegador y, si no hay nada, el idioma del navegador.

export type Lang = "es" | "en";

const KEY = "fuego-lang";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: <T>(es: T, en: T) => T;
};

const TITLES: Record<string, string> = {
  "Fuego+ — Aprende la Biblia jugando": "Fuego+ — Learn the Bible by playing",
  "Fuego+ — Cursos bíblicos para jóvenes": "Fuego+ — Bible courses for young people",
  "Inicio — Fuego+": "Home — Fuego+",
  "Cursos — Fuego+": "Courses — Fuego+",
  "Curso — Fuego+": "Course — Fuego+",
  "Lección — Fuego+": "Lesson — Fuego+",
  "Insignias — Fuego+": "Badges — Fuego+",
  "Ajustes — Fuego+": "Settings — Fuego+",
  "Administración — Fuego+": "Admin — Fuego+",
};
const TITLES_BACK = Object.fromEntries(Object.entries(TITLES).map(([es, en]) => [en, es]));

const LangContext =createContext<Ctx>({ lang: "es", setLang: () => {}, t: (es) => es });

function detect(): Lang {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl === "es" || fromUrl === "en") {
      // Se guarda para que el resto de páginas siga en ese idioma.
      localStorage.setItem(KEY, fromUrl);
      return fromUrl;
    }
    const saved = localStorage.getItem(KEY);
    if (saved === "es" || saved === "en") return saved;
  } catch {
    /* almacenamiento no disponible */
  }
  return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
}

export function LangProvider({ children }: { children: ReactNode }) {
  // En el servidor siempre es español; en el navegador se ajusta al montar.
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => setLangState(detect()), []);
  useEffect(() => {
    document.documentElement.lang = lang;
    // Los títulos de pestaña los fija cada ruta en español; aquí se traducen.
    const sync = () => {
      const target = lang === "en" ? TITLES[document.title] : TITLES_BACK[document.title];
      if (target && document.title !== target) document.title = target;
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* almacenamiento no disponible */
    }
  }, []);

  const value = useMemo<Ctx>(() => ({ lang, setLang, t: (es, en) => (lang === "es" ? es : en) }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Locale para fechas y números. */
export const locale = (lang: Lang) => (lang === "es" ? "es" : "en-US");

/** Selector de idioma ES / EN. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  return (
    <div
      role="group"
      aria-label={t("Idioma", "Language")}
      className={`inline-flex shrink-0 items-center rounded-full bg-card p-1 text-xs font-extrabold shadow-[var(--shadow-soft)] ${className}`}
    >
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
