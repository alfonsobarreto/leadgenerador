"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { JSX } from "react";

const MIN_FONT_PX = 8;
const MAX_FONT_PX = 26;

const HEADLINE_BOX_H = "h-[5.25rem] sm:h-[5.75rem]";

type DynamicHeadlineProps = {
  text: string;
};

export function DynamicHeadline({ text }: DynamicHeadlineProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontPx, setFontPx] = useState(MIN_FONT_PX);
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;

    const fit = (): void => {
      const boxH = container.clientHeight;
      const boxW = container.clientWidth;
      if (boxH <= 0 || boxW <= 0) return;

      el.style.transform = "none";
      el.style.width = `${boxW}px`;
      el.style.maxWidth = `${boxW}px`;

      let lo = MIN_FONT_PX;
      let hi = MAX_FONT_PX;
      let best = MIN_FONT_PX;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        el.style.fontSize = `${mid}px`;
        el.style.lineHeight = "1.1";

        const overflows =
          el.scrollHeight > boxH + 1 || el.scrollWidth > boxW + 1;

        if (overflows) {
          hi = mid - 1;
        } else {
          best = mid;
          lo = mid + 1;
        }
      }

      el.style.fontSize = `${best}px`;

      let nextScale = 1;
      if (el.scrollHeight > boxH + 1 || el.scrollWidth > boxW + 1) {
        nextScale = Math.min(
          (boxW / el.scrollWidth) * 0.97,
          (boxH / el.scrollHeight) * 0.97,
          1,
        );
        nextScale = Math.max(nextScale, 0.5);
      }

      setFontPx(best);
      setScale(nextScale);
      setReady(true);
    };

    setReady(false);
    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(container);
    window.addEventListener("orientationchange", fit);

    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", fit);
    };
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`relative ${HEADLINE_BOX_H} min-w-0 w-full overflow-hidden`}
      aria-live="polite"
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-px">
        <span
          ref={textRef}
          className="inline-block max-w-full origin-center text-center font-extrabold tracking-tight text-white break-words hyphens-auto drop-shadow-[0_1px_12px_rgba(0,0,0,0.4)]"
          style={{
            fontSize: `${fontPx}px`,
            lineHeight: 1.1,
            transform: ready ? `scale(${scale})` : undefined,
            opacity: ready ? 1 : 0,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
