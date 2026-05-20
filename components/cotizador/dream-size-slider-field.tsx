"use client";

import { useCallback, useRef } from "react";
import type { JSX, KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";

type DreamSizeSliderFieldProps = {
  min: number;
  max: number;
  value: number;
  fillPct: number;
  ariaLabelledBy: string;
  ariaValueText: string;
  onValueChange: (value: number) => void;
};

function clampValue(clientX: number, rect: DOMRect, min: number, max: number): number {
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  return Math.round(min + ratio * (max - min));
}

/**
 * Barra m² con hit-area alta: el dedo puede tocar en cualquier punto de la pista
 * y el thumb salta / sigue esa posición (no hace falta acertar al círculo).
 */
export function DreamSizeSliderField({
  min,
  max,
  value,
  fillPct,
  ariaLabelledBy,
  ariaValueText,
  onValueChange,
}: DreamSizeSliderFieldProps): JSX.Element {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const applyFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const next = clampValue(clientX, track.getBoundingClientRect(), min, max);
      onValueChange(next);
    },
    [max, min, onValueChange],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    applyFromClientX(event.clientX);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (!draggingRef.current) return;
    applyFromClientX(event.clientX);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    draggingRef.current = false;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onValueChange(Math.min(max, value + 1));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onValueChange(Math.max(min, value - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      onValueChange(min);
    } else if (event.key === "End") {
      event.preventDefault();
      onValueChange(max);
    }
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-labelledby={ariaLabelledBy}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={ariaValueText}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      className="dream-size-track-zone relative flex w-full cursor-pointer touch-none select-none items-center py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#ddd6fe] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
    >
      {/* Pista visual (delgada) centrada en zona táctil amplia */}
      <div className="pointer-events-none relative h-[0.3rem] w-full rounded-full bg-white/20">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[#8b2cf5]"
          style={{ width: `${fillPct}%` }}
        />
        <div
          className="absolute top-1/2 size-[1.02rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-white bg-[#8b2cf5] shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_3px_10px_rgba(139,44,245,0.45)] transition-[left] duration-75 sm:size-[1.09rem]"
          style={{ left: `${fillPct}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
