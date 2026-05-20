"use client";

import type { JSX } from "react";
import { useCotizadorUiStore } from "@/lib/cotizador-ui-store";

export function LanguageToggle(): JSX.Element {
  const language = useCotizadorUiStore((s) => s.language);
  const setLanguage = useCotizadorUiStore((s) => s.setLanguage);

  const label = language === "es" ? "ES" : "EN";
  const next = language === "es" ? "en" : "es";

  return (
    <button
      type="button"
      onClick={() => setLanguage(next)}
      aria-label={language === "es" ? "Cambiar idioma a inglés" : "Switch language to Spanish"}
      title={language === "es" ? "English" : "Español"}
      className="flex size-[2.35rem] shrink-0 items-center justify-center rounded-lg border border-white/30 bg-black/50 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_4px_16px_-6px_rgba(0,0,0,0.55)] backdrop-blur-md transition-[background,transform,box-shadow] hover:bg-[#8b2cf5]/35 hover:brightness-110 active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ddd6fe] sm:size-[2.5rem] sm:text-[0.66rem]"
    >
      {label}
    </button>
  );
}
