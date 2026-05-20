"use client";

import type { JSX } from "react";
import type { LanguageId } from "@/lib/i18n/types";
import { useCotizadorUiStore } from "@/lib/cotizador-ui-store";

function LangChip({
  code,
  active,
  onClick,
}: {
  code: Uppercase<LanguageId>;
  active: boolean;
  onClick: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-w-[2.1rem] rounded-md px-2 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.12em] transition-[background,color,box-shadow] ${
        active
          ? "bg-[#8b2cf5] text-white shadow-[0_4px_14px_-4px_rgba(139,44,245,0.65)]"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {code}
    </button>
  );
}

export function LanguageToggle(): JSX.Element {
  const language = useCotizadorUiStore((s) => s.language);
  const setLanguage = useCotizadorUiStore((s) => s.setLanguage);

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex shrink-0 items-center gap-0.5 rounded-lg border border-white/25 bg-black/45 p-0.5 backdrop-blur-md"
    >
      <LangChip code="ES" active={language === "es"} onClick={() => setLanguage("es")} />
      <LangChip code="EN" active={language === "en"} onClick={() => setLanguage("en")} />
    </div>
  );
}
