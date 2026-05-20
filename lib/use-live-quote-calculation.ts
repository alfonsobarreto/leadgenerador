"use client";

import { useMemo } from "react";
import { calcularCotizacion } from "@/lib/cotizacion-calculator";
import type { CurrencyId, InvestmentPctId, TermId } from "@/lib/cotizador-ui-store";
import { useCotizadorUiStore } from "@/lib/cotizador-ui-store";
import { precioMetroCuadradoMock } from "@/lib/tarifas-m2-mock";

function plazoAnosDesdeTerm(term: TermId): number {
  if (term === "spot") return 1;
  return Number.parseInt(term, 10);
}

function monedaEfectiva(currency: CurrencyId | null): "USD" | "MXN" {
  return currency === "usd" ? "USD" : "MXN";
}

function engancheNumericoPct(id: InvestmentPctId | null): number {
  if (id == null) return 10;
  return Number.parseInt(id, 10);
}

/** Misma lógica que el panel financiero para mostrar valores alineados (modal paso 4, etc.). */
export function useLiveQuoteCalculation(): ReturnType<typeof calcularCotizacion> {
  const metrosCuadradosStr = useCotizadorUiStore((s) => s.metrosCuadradosStr);
  const ubicacionSeleccionada = useCotizadorUiStore((s) => s.ubicacionSeleccionada);
  const termSelected = useCotizadorUiStore((s) => s.termSelected);
  const purpose = useCotizadorUiStore((s) => s.purpose);
  const investmentPct = useCotizadorUiStore((s) => s.investmentPct);
  const currency = useCotizadorUiStore((s) => s.currency);
  const tasaCambioMXNPerUSD = useCotizadorUiStore((s) => s.tasaCambioMXNPerUSD);

  return useMemo(() => {
    const precioM2 = precioMetroCuadradoMock(ubicacionSeleccionada, purpose);
    const m2Floored = Number.isFinite(Number.parseFloat(metrosCuadradosStr))
      ? Math.trunc(Number.parseFloat(metrosCuadradosStr))
      : 0;

    return calcularCotizacion(
      precioM2,
      m2Floored,
      engancheNumericoPct(investmentPct),
      plazoAnosDesdeTerm(termSelected),
      tasaCambioMXNPerUSD,
      monedaEfectiva(currency),
    );
  }, [
    currency,
    investmentPct,
    metrosCuadradosStr,
    purpose,
    tasaCambioMXNPerUSD,
    termSelected,
    ubicacionSeleccionada,
  ]);
}
