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
    <div className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.17] bg-white/[0.11] px-2.5 py-1.5 shadow-inner shadow-black/25 backdrop-blur-md sm:gap-3 sm:px-3 sm:py-2">
      <span className="text-[11px] font-bold leading-snug text-white sm:text-xs">{label}</span>
      <span className="max-w-[55%] text-right text-[0.78rem] font-extrabold tabular-nums tracking-tight text-[#87e9db] drop-shadow-[0_0_10px_rgba(135,233,219,0.38)] sm:text-[0.85rem]">
        {value}
      </span>
    </div>
  );
}

/** Moneda efectiva para cálculos (USD sólo después de clic explícito). */
function monedaEfectiva(currency: CurrencyId | null): "USD" | "MXN" {
  return currency === "usd" ? "USD" : "MXN";
}

/** Enganche efectivo antes de primera selección (= 10% como antes). */
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
    <div className="relative shrink-0 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
      <div className="relative mx-auto flex max-w-xl items-start justify-center pb-6 pr-[5.125rem] pl-3 sm:pr-[6.125rem]">
        <h1 className="line-clamp-3 max-h-[5.55rem] text-left text-[0.93rem] font-extrabold leading-snug tracking-tight text-white drop-shadow-[0_1px_18px_rgba(0,0,0,0.35)] sm:max-h-none sm:text-[1.1rem] sm:leading-snug [@media(min-width:380px)]:[text-align:center]">
          {dynamicMessage}
        </h1>

        <div className="absolute right-0 top-0 flex items-start justify-center sm:right-2">
          <button
            type="button"
            aria-label={`Guardian del sueño: ${COTIZADOR_PANEL_MESSAGES.guardianGreeting}`}
            onClick={guardianTap}
            className="relative flex size-[4.4375rem] shrink-0 items-center justify-center overflow-hidden rounded-[1.125rem] border border-white/35 bg-purple-950/45 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.52)] ring-2 ring-purple-950/55 backdrop-blur-md transition-[transform,filter] hover:brightness-110 active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ddd6fe] sm:size-[4.9375rem] sm:rounded-[1.2rem]"
          >
            <Image
              src={avatarUrl}
              alt=""
              fill
              unoptimized
              sizes="124px"
              className="object-cover"
              key={avatarUrl}
            />
          </button>
        </div>
      </div>

      <div
        role="region"
        aria-label="Resumen financiero"
        className="relative z-[1] mx-auto -mt-10 max-w-xl space-y-1 rounded-xl border border-white/12 bg-black/38 px-2 pb-2 pt-2 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:-mt-[2.375rem]"
      >
        <MetricRow label="Precio de lista" value={cotizada.precioLista} />
        <MetricRow label="Inversión inicial" value={cotizada.montoEnganche} />
        <MetricRow label="Monto a financiar" value={cotizada.montoAFinanciar} />
        <MetricRow label="Mensualidades S.I." value={cotizada.pagoMensualInicial} />
      </div>
    </div>
  );
}
