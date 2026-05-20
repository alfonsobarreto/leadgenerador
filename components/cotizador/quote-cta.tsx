import { ArrowRight } from "lucide-react";
import type { JSX } from "react";

/** CTA al pie del panel inferior (sin `fixed` global; forma parte del flex column del shell). */
export function QuoteCtaButton(): JSX.Element {
  return (
    <div className="w-full">
      <button
        type="button"
        className="group flex min-h-[2.875rem] w-full items-center justify-center gap-2 rounded-full bg-[#8b2cf5] px-4 py-2.5 text-[0.7rem] font-extrabold uppercase leading-snug tracking-[0.1em] text-white shadow-[0_16px_40px_-8px_rgba(139,44,245,0.5)] outline-none ring-2 ring-transparent transition-[transform,filter] hover:brightness-110 active:scale-[0.99] focus-visible:ring-[#c4b5fd] sm:text-[0.75rem]"
      >
        <span className="max-w-[20rem] text-center uppercase drop-shadow-[0_1px_0_rgba(0,0,0,0.22)]">
          ¡Quiero mi cotización YA!
        </span>
        <ArrowRight
          aria-hidden
          className="size-[1.125rem] shrink-0 transition-transform group-hover:translate-x-1 sm:size-5"
          strokeWidth={2.75}
        />
      </button>
    </div>
  );
}
