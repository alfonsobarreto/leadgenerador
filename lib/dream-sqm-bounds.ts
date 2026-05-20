import type { PurposeId } from "@/lib/cotizador-ui-store";

export type SqmBounds = { min: number; max: number };

/** Mi negocio: 300–1500. Mi casa / Mi terreno (y sin selección): 125–400. */
export function sqmBoundsForPurpose(purpose: PurposeId | null): SqmBounds {
  if (purpose === "negocio") {
    return { min: 300, max: 1500 };
  }
  return { min: 125, max: 400 };
}

export function clampSqmToPurposeBounds(value: number, purpose: PurposeId | null): number {
  const { min, max } = sqmBoundsForPurpose(purpose);
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function parseSqmStored(raw: string, purpose: PurposeId | null): number {
  return clampSqmToPurposeBounds(Number.parseFloat(raw), purpose);
}
