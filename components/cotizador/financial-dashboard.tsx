"use client";

import Image from "next/image";
import { useMemo } from "react";
import type { JSX } from "react";
import { calcularCotizacion } from "@/lib/cotizacion-calculator";
import { COTIZADOR_PANEL_MESSAGES } from "@/lib/cotizador-panel-messages";
import type { CurrencyId, InvestmentPctId, TermId } from "@/lib/cotizador-ui-store";
import { useCotizadorUiStore } from "@/lib/cotizador-ui-store";
import { precioMetroCuadradoMock } from "@/lib/tarifas-m2-mock";

function plazoAnosDesdeTerm(term: TermId): number {
  if (term === "spot") return 1;
  return Number.parseInt(term, 10);
}

function MetricRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.15] bg-white/[0.09] px-2.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:gap-3 sm:px-3 sm:py-2">
      <span className="text-[11px] font-bold leading-snug text-white sm:text-xs">{label}</span>
      <span className="max-w-[55%] text-right text-[0.78rem] font-extrabold tabular-nums tracking-tight text-[#87e9db] drop-shadow-[0_0_8px_rgba(135,233,219,0.28)] sm:text-[0.85rem]">
        {value}
      </span>
    </div>
  );
}

function monedaEfectiva(currency: CurrencyId | null): "USD" | "MXN" {
  return currency === "usd" ? "USD" : "MXN";
}

function engancheNumericoPct(id: InvestmentPctId | null): number {
  if (id == null) return 10;
  return Number.parseInt(id, 10);
}

export function FinancialDashboard(): JSX.Element {
  const dynamicMessage = useCotizadorUiStore((s) => s.dynamicMessage);
  const avatarUrl = useCotizadorUiStore((s) => s.avatarUrl);
  const guardianTap = useCotizadorUiStore((s) => s.guardianTap);

  const metrosCuadradosStr = useCotizadorUiStore((s) => s.metrosCuadradosStr);
  const ubicacionSeleccionada = useCotizadorUiStore((s) => s.ubicacionSeleccionada);
  const termSelected = useCotizadorUiStore((s) => s.termSelected);
  const purpose = useCotizadorUiStore((s) => s.purpose);
  const investmentPct = useCotizadorUiStore((s) => s.investmentPct);
  const currency = useCotizadorUiStore((s) => s.currency);
  const tasaCambioMXNPerUSD = useCotizadorUiStore((s) => s.tasaCambioMXNPerUSD);

  const cotizada = useMemo(() => {
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

  return (
    <div className="relative isolate shrink-0 pb-3 pt-[max(0.5rem,env(safe-area-inset-top))]">
      {/* Fila título + avatar: sin posición absoluta ni solapamiento con la tarjeta inferior */}
      <div className="mx-auto flex max-w-xl items-start gap-3 px-1 sm:gap-4 sm:px-2">
        <h1 className="min-h-0 min-w-0 flex-1 text-balance pt-0.5 text-[0.95rem] font-extrabold leading-snug tracking-tight text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.4)] sm:text-[1.08rem] sm:leading-snug">
          {dynamicMessage}
        </h1>

        <button
          type="button"
          aria-label={`Guardian del sueño: ${COTIZADOR_PANEL_MESSAGES.guardianGreeting}`}
          onClick={guardianTap}
          className="relative flex size-[4.25rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/40 bg-zinc-950/70 shadow-[0_10px_28px_-6px_rgba(0,0,0,0.55)] ring-1 ring-white/15 transition-[transform,filter] hover:brightness-110 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ddd6fe] sm:size-[4.75rem] sm:rounded-[1.25rem]"
        >
          <Image
            src={avatarUrl}
            alt=""
            fill
            unoptimized
            sizes="108px"
            className="object-cover"
            key={avatarUrl}
          />
        </button>
      </div>

      {/* Tarjeta de resultados: separación real; un solo capa de blur (no “doble vidrio” encima del título) */}
      <div
        role="region"
        aria-label="Resumen financiero"
        className="mx-auto mt-3 max-w-xl space-y-1 rounded-2xl border border-white/18 bg-zinc-950/60 px-2.5 py-2.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md sm:mt-3.5 sm:px-3"
      >
        <MetricRow label="Precio de lista" value={cotizada.precioLista} />
        <MetricRow label="Inversión inicial" value={cotizada.montoEnganche} />
        <MetricRow label="Monto a financiar" value={cotizada.montoAFinanciar} />
        <MetricRow label="Mensualidades S.I." value={cotizada.pagoMensualInicial} />
      </div>
    </div>
  );
}
