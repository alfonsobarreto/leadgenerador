import type { JSX } from "react";

/** Logo texto + brújula estilo mesa de diseño (aprox., sin asset externo). */
export function MesaDeDisenoLogo(): JSX.Element {
  return (
    <div className="mx-auto flex w-full flex-col items-center gap-3 py-6">
      <div
        aria-hidden
        className="flex size-24 items-center justify-center rounded-[1.5rem] border border-white/25 bg-black/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md"
      >
        <svg
          viewBox="0 0 64 64"
          className="size-14 text-white/95"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" opacity="0.35" />
          <path d="M32 14v34M46 34H18" stroke="currentColor" strokeWidth="2.5" opacity="0.45" />
          <path
            d="M32 20 38 42 32 37 26 42 32 20Z"
            fill="currentColor"
            opacity="0.92"
          />
          <circle cx="32" cy="32" r="3.25" fill="currentColor" />
          <path
            d="M54 54 44 46"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>
      <div className="text-center uppercase tracking-[0.28em] text-[0.72rem] font-bold text-white drop-shadow-sm">
        <span className="block leading-tight text-white">Mesa de diseño</span>
      </div>
    </div>
  );
}
