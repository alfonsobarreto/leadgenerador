import type { PurposeId } from "@/lib/cotizador-ui-store";

/** Valores sólo demo; enlaza con ubicación/propósito. */
export type UbicacionCodigo = "qro" | "cancun";

const TABLA_PRECIO_M2_MXN: Record<UbicacionCodigo, Record<PurposeId, number>> = {
  qro: {
    "lote-habitacional": 9800,
    terreno: 7600,
    negocio: 12400,
  },
  cancun: {
    "lote-habitacional": 11200,
    terreno: 8900,
    negocio: 14600,
  },
};

/** Si aún no eligen ubicación válida en el `<select>`, usamos tarifa Querétaro. */
export function precioMetroCuadradoMock(
  ubicacion: UbicacionCodigo | "",
  propósito: PurposeId | null,
): number {
  const u: UbicacionCodigo = ubicacion === "" ? "qro" : ubicacion;
  const p = propósito ?? "lote-habitacional";
  return TABLA_PRECIO_M2_MXN[u][p];
}
