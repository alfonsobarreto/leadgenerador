import { ArrowRight } from "lucide-react";
import type { JSX } from "react";

/** CTA fijo inferior, estilo mock (violeta sólido, redondeado). */
export function QuoteCtaButton(): JSX.Element {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-10">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-24 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="pointer-events-auto relative mx-auto flex w-[min(100%,28rem)] justify-center px-4">
        <button
          type="button"
          className="group flex min-h-[3.65rem] w-full max-w-xl items-center justify-center gap-2.5 rounded-full bg-[#8b2cf5] px-6 text-[0.95rem] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_24px_50px_-8px_rgba(139,44,245,0.55)] outline-none ring-2 ring-transparent transition-[transform,filter] hover:brightness-110 active:scale-[0.987] focus-visible:ring-[#c4b5fd]"
        >
          <span className="text-center leading-snug drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]">
            ¡Quiero mi cotización YA!
          </span>
          <ArrowRight
            aria-hidden
            className="size-6 shrink-0 transition-transform group-hover:translate-x-1"
            strokeWidth={2.75}
          />
        </button>
      </div>
    </div>
  );
}
