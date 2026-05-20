"use client";

import type { JSX } from "react";
import { COTIZADOR_PANEL_MESSAGES } from "@/lib/cotizador-panel-messages";
import { useCotizadorUiStore } from "@/lib/cotizador-ui-store";

export type FinancialDashboardProps = {
  listPrice: string;
  initialInvestment: string;
  toFinance: string;
  monthlyPayment: string;
};

function MetricRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.17] bg-white/[0.11] px-4 py-3.5 shadow-inner shadow-black/25 backdrop-blur-md">
      <span className="text-sm font-bold leading-snug text-white">{label}</span>
      <span className="max-w-[58%] text-right text-[0.98rem] font-extrabold tabular-nums tracking-tight text-[#87e9db] drop-shadow-[0_0_12px_rgba(135,233,219,0.42)]">
        {value}
      </span>
    </div>
  );
}

export function FinancialDashboard({
  listPrice,
  initialInvestment,
  toFinance,
  monthlyPayment,
}: FinancialDashboardProps): JSX.Element {
  const dynamicMessage = useCotizadorUiStore((s) => s.dynamicMessage);
  const setDynamicMessage = useCotizadorUiStore((s) => s.setDynamicMessage);

  return (
    <div className="relative pb-5 pt-[max(1.85rem,env(safe-area-inset-top))]">
      <div className="relative mx-auto flex min-h-[4.25rem] max-w-xl items-start justify-center px-4 pb-10 pr-28 sm:pr-32">
        <h1 className="text-center text-[1.375rem] font-extrabold leading-[1.25] tracking-tight text-white drop-shadow-[0_1px_28px_rgba(0,0,0,0.35)] sm:text-[1.55rem]">
          {dynamicMessage}
        </h1>

        <div className="absolute right-4 top-[0.125rem] flex size-[6.625rem] items-center justify-center sm:right-12">
          <button
            type="button"
            aria-label={`Guardian del sueño: ${COTIZADOR_PANEL_MESSAGES.avatarGuardian}`}
            onClick={() => setDynamicMessage(COTIZADOR_PANEL_MESSAGES.avatarGuardian)}
            className="rounded-[1.625rem] border border-white/35 bg-purple-950/45 p-[0.6rem] shadow-[0_18px_50px_-8px_rgba(0,0,0,0.55)] ring-4 ring-purple-950/45 backdrop-blur-md transition-[transform,filter] hover:brightness-110 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ddd6fe]"
          >
            <span className="block text-[3.625rem] leading-none drop-shadow-[0_14px_30px_rgba(0,0,0,0.45)]" aria-hidden>
              🤠
            </span>
          </button>
        </div>
      </div>

      <div
        role="region"
        aria-label="Resumen financiero"
        className="relative z-[1] mx-auto -mt-6 max-w-xl space-y-2.5 rounded-[1.45rem] border border-white/12 bg-black/38 p-[0.975rem] shadow-[0_24px_70px_-20px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
      >
        <MetricRow label="Precio de lista" value={listPrice} />
        <MetricRow label="Inversión inicial" value={initialInvestment} />
        <MetricRow label="Monto a financiar" value={toFinance} />
        <MetricRow label="Mensualidades S.I." value={monthlyPayment} />
      </div>
    </div>
  );
}
