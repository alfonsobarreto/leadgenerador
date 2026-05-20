"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { JSX } from "react";

/** Escala 1.5× respecto al rango anterior (11–17px → 17–26px); shrink solo si no cabe. */
const HEADLINE_SCALE = 1.5;
const MIN_FONT_PX = Math.round(11 * HEADLINE_SCALE);
const MAX_FONT_PX = Math.round(17 * HEADLINE_SCALE);

type DynamicHeadlineProps = {
  text: string;
};

/**
 * Título dinámico centrado en su celda (eje X y Y), con wrap y tamaño que
 * crece o reduce hasta llenar el espacio disponible sin desbordar.
 */
export function DynamicHeadline({ text }: DynamicHeadlineProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [fontPx, setFontPx] = useState(MAX_FONT_PX);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;

    const fit = (): void => {
      let lo = MIN_FONT_PX;
      let hi = MAX_FONT_PX;
      let best = MIN_FONT_PX;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        el.style.fontSize = `${mid}px`;

        const overflows =
          el.scrollHeight > container.clientHeight + 1 ||
          el.scrollWidth > container.clientWidth + 1;

        if (overflows) {
          hi = mid - 1;
        } else {
          best = mid;
          lo = mid + 1;
        }
      }

      setFontPx(best);
    };

    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(container);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div
      ref={containerRef}
      className="flex min-h-[5.25rem] min-w-0 flex-1 items-center justify-center px-0.5 sm:min-h-[5.75rem] sm:px-1"
      aria-live="polite"
    >
      <h1
        ref={textRef}
        className="max-h-full w-full text-center font-extrabold leading-[1.15] tracking-tight text-white text-balance break-words hyphens-auto drop-shadow-[0_1px_12px_rgba(0,0,0,0.4)]"
        style={{ fontSize: `${fontPx}px` }}
      >
        {text}
      </h1>
    </div>
  );
}
