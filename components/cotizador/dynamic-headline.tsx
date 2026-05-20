"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { JSX } from "react";

const HEADLINE_SCALE = 1.5;
const MIN_FONT_PX = Math.round(10 * HEADLINE_SCALE);
const MAX_FONT_PX = Math.round(18 * HEADLINE_SCALE);

/** Altura fija del cuadro — no depende del contenido. */
const HEADLINE_BOX_H = "h-[5.25rem] sm:h-[5.75rem]";

type DynamicHeadlineProps = {
  text: string;
};

/**
 * Contenedor de tamaño fijo; el texto hace wrap y reduce font-size (shrink-to-fit) para caber dentro.
 */
export function DynamicHeadline({ text }: DynamicHeadlineProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontPx, setFontPx] = useState(MAX_FONT_PX);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;

    const fit = (): void => {
      const boxH = container.clientHeight;
      const boxW = container.clientWidth;
      if (boxH <= 0 || boxW <= 0) return;

      let lo = MIN_FONT_PX;
      let hi = MAX_FONT_PX;
      let best = MIN_FONT_PX;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        el.style.fontSize = `${mid}px`;

        const overflows =
          el.scrollHeight > boxH + 1 || el.scrollWidth > boxW + 1;

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
      className={`relative ${HEADLINE_BOX_H} min-w-0 flex-1 shrink overflow-hidden px-0.5 sm:px-1`}
      aria-live="polite"
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-0.5">
        <span
          ref={textRef}
          className="block w-full max-h-full text-center font-extrabold leading-[1.12] tracking-tight text-white text-balance break-words hyphens-auto drop-shadow-[0_1px_12px_rgba(0,0,0,0.4)]"
          style={{ fontSize: `${fontPx}px` }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
