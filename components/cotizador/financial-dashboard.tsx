"use client";

import Image from "next/image";
import type { JSX } from "react";
import { DynamicHeadline } from "@/components/cotizador/dynamic-headline";
import { LanguageToggle } from "@/components/cotizador/language-toggle";
import { getPanelMessageText } from "@/lib/i18n/panel-trip";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useLiveQuoteCalculation } from "@/lib/use-live-quote-calculation";
import { useCotizadorUiStore } from "@/lib/cotizador-ui-store";

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

export function FinancialDashboard(): JSX.Element {
  const t = useTranslation();
  const language = useCotizadorUiStore((s) => s.language);
  const dynamicMessage = useCotizadorUiStore((s) => s.dynamicMessage);
  const avatarUrl = useCotizadorUiStore((s) => s.avatarUrl);
  const guardianTap = useCotizadorUiStore((s) => s.guardianTap);

  const cotizada = useLiveQuoteCalculation();

  const guardianLabel = getPanelMessageText("guardian", language);

  return (
    <div className="relative isolate shrink-0 pb-3 pt-[max(0.5rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex w-full max-w-xl items-start gap-x-2.5 px-1 sm:gap-x-3 sm:px-2">
        <button
          type="button"
          aria-label={`Guardian del sueño: ${guardianLabel}`}
          onClick={guardianTap}
          className="relative flex size-[5.5rem] shrink-0 items-center justify-center self-center border-0 bg-transparent p-0 shadow-none transition-[transform,filter] hover:brightness-110 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ddd6fe] sm:size-[6rem]"
        >
          <Image
            src={avatarUrl}
            alt=""
            width={96}
            height={96}
            unoptimized
            sizes="(max-width: 640px) 88px, 96px"
            className="size-full object-contain object-center drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
            key={avatarUrl}
          />
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex justify-end">
            <LanguageToggle />
          </div>
          <DynamicHeadline text={dynamicMessage} />
        </div>
      </div>

      {/* Tarjeta de resultados: separación real; un solo capa de blur (no “doble vidrio” encima del título) */}
      <div
        role="region"
        aria-label={t("financialSummaryAria")}
        className="mx-auto mt-3 max-w-xl space-y-1 rounded-2xl border border-white/18 bg-zinc-950/60 px-2.5 py-2.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md sm:mt-3.5 sm:px-3"
      >
        <MetricRow label={t("listPrice")} value={cotizada.precioLista} />
        <MetricRow label={t("initialInvestment")} value={cotizada.montoEnganche} />
        <MetricRow label={t("amountToFinance")} value={cotizada.montoAFinanciar} />
        <MetricRow label={t("monthlyPaymentsNoInterest")} value={cotizada.pagoMensualInicial} />
      </div>
    </div>
  );
}
