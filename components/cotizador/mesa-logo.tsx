"use client";

import type { JSX } from "react";
import { useTranslation } from "@/lib/i18n/use-translation";

/** Logo Mesa de diseño en fila horizontal (menos alto verticalmente). */
export function MesaDeDisenoLogo(): JSX.Element {
  const t = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-xl shrink-0 flex-row items-center justify-center gap-2 pb-1 pt-1">
      <div
        aria-hidden
        className="flex size-[2.65rem] shrink-0 items-center justify-center rounded-xl border border-white/25 bg-black/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md sm:size-[2.875rem]"
      >
        <svg
          viewBox="0 0 64 64"
          className="size-[1.625rem] text-white/95 sm:size-7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" opacity="0.35" />
          <path d="M32 14v34M46 34H18" stroke="currentColor" strokeWidth="2.5" opacity="0.45" />
          <path d="M32 20 38 42 32 37 26 42 32 20Z" fill="currentColor" opacity="0.92" />
          <circle cx="32" cy="32" r="3.25" fill="currentColor" />
          <path d="M54 54 44 46" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </svg>
      </div>
      <div className="text-left uppercase tracking-[0.22em] text-[0.55rem] font-bold leading-tight text-white/95 shadow-black/40 drop-shadow-sm sm:text-[0.62rem] sm:tracking-[0.26em]">
        <span className="block">{t("designBoardLine1")}</span>
        <span className="block">{t("designBoardLine2")}</span>
      </div>
    </div>
  );
}
