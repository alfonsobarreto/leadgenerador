"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useEffect } from "react";
import type { ChangeEvent } from "react";
import type { JSX } from "react";
import { DreamSizeSliderField } from "@/components/cotizador/dream-size-slider-field";
import { QuoteCtaButton } from "@/components/cotizador/quote-cta";
import { clampSqmToPurposeBounds, parseSqmStored, sqmBoundsForPurpose } from "@/lib/dream-sqm-bounds";
import { useTranslation } from "@/lib/i18n/use-translation";
import type { InvestmentPctId, PurposeId, TermId, UbicacionId } from "@/lib/cotizador-ui-store";
import { useCotizadorUiStore } from "@/lib/cotizador-ui-store";

const violet = "#8b2cf5";

function FieldLabelTiny({ id, children }: { id: string; children: string }): JSX.Element {
  return (
    <p id={id} className="mb-1 truncate px-px text-[0.72rem] font-bold leading-none text-white/95 drop-shadow-[0_1px_0_rgba(0,0,0,0.14)]">
      {children}
    </p>
  );
}

function purposeActiveClass(selected: boolean): string {
  return selected ? "rounded-lg bg-white/12 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] ring-2 ring-teal-400/95 ring-offset-1 ring-offset-black/55" : "";
}

function DreamRadioGroup(): JSX.Element {
  const t = useTranslation();
  const opts: readonly { id: PurposeId; labelKey: "myHouse" | "myLot" | "myBusiness" }[] = [
    { id: "lote-habitacional", labelKey: "myHouse" },
    { id: "terreno", labelKey: "myLot" },
    { id: "negocio", labelKey: "myBusiness" },
  ];

  const purpose = useCotizadorUiStore((s) => s.purpose);
  const pickPurpose = useCotizadorUiStore((s) => s.pickPurpose);

  return (
    <fieldset>
      <legend className="sr-only">Tipo de proyecto</legend>
      <FieldLabelTiny id="dream-group-label">{t("yourDream")}</FieldLabelTiny>
      <div
        className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 rounded-xl border border-white/12 bg-black/28 px-2 py-1.5 backdrop-blur-md [@media(min-width:360px)]:justify-center [@media(min-width:360px)]:gap-x-5"
        aria-labelledby="dream-group-label"
      >
        {opts.map((opt) => (
          <label
            key={opt.id}
            className={`flex cursor-pointer select-none items-center gap-2 px-2 py-0.5 text-[0.72rem] font-semibold tracking-tight text-white transition-[box-shadow] sm:text-[0.78rem] ${purposeActiveClass(purpose === opt.id)}`}
          >
            <input
              type="radio"
              name="purpose"
              value={opt.id}
              checked={purpose === opt.id}
              onChange={() => pickPurpose(opt.id)}
              style={{ accentColor: violet }}
              className="size-4 shrink-0 border border-white/90 bg-white/15 shadow-inner shadow-black/25 sm:size-[1.05rem]"
            />
            <span className="max-[320px]:max-w-[92px] max-[320px]:leading-tight">{t(opt.labelKey)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const termPillClass = (sel: boolean): string =>
  `relative flex min-h-[1.85rem] cursor-pointer items-center justify-center whitespace-nowrap rounded-full border-[1.5px] px-2 py-1 text-[0.6rem] font-semibold leading-none tracking-tight transition-colors sm:px-2.5 sm:text-[0.64rem] ${
    sel
      ? "border-transparent bg-[#8b2cf5] text-white shadow-[0_8px_20px_-10px_rgba(139,44,245,0.55)]"
      : "border-white/90 bg-transparent text-white hover:bg-white/5"
  }`;

const currencyPillClass = (sel: boolean): string =>
  `relative flex min-h-[1.85rem] min-w-[2.65rem] flex-1 cursor-pointer items-center justify-center rounded-full border-[1.5px] px-2 py-1 text-[0.6rem] font-extrabold uppercase leading-none tracking-[0.12em] transition-[background,color,border-color,box-shadow] sm:text-[0.64rem] ${
    sel
      ? "border-transparent bg-[#8b2cf5] text-white shadow-[0_8px_20px_-10px_rgba(139,44,245,0.55)] ring-1 ring-yellow-400/80"
      : "border-white/90 bg-transparent text-white hover:bg-white/5"
  }`;

function TermPlazoRadioGroup(): JSX.Element {
  const t = useTranslation();
  const termSelected = useCotizadorUiStore((s) => s.termSelected);
  const pickTerm = useCotizadorUiStore((s) => s.pickTerm);

  const items: readonly { id: TermId; labelKey: "term30Years" | "term20Years" | "payInFull" }[] = [
    { id: "30", labelKey: "term30Years" },
    { id: "20", labelKey: "term20Years" },
    { id: "spot", labelKey: "payInFull" },
  ];

  return (
    <fieldset className="min-w-0">
      <FieldLabelTiny id="plazo-label-inline">{t("terms")}</FieldLabelTiny>
      <div className="flex flex-wrap gap-1" aria-labelledby="plazo-label-inline">
        {items.map((it) => {
          const sel = termSelected === it.id;
          return (
            <label
              key={it.id}
              className={termPillClass(sel)}
            >
              <input
                type="radio"
                name="term"
                value={it.id}
                checked={sel}
                onChange={() => pickTerm(it.id)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <span className="pointer-events-none">{t(it.labelKey)}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function pctWrapClass(active: boolean, id: InvestmentPctId): string {
  if (!active)
    return "border-white/65 bg-transparent hover:bg-white/10";

  if (id === "10") {
    return "border-transparent bg-white text-zinc-900 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)] ring-2 ring-yellow-300/90 ring-offset-1 ring-offset-black/60";
  }
  return "border-[#e9d5ff] bg-white/17 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] ring-2 ring-purple-400/95 ring-offset-1 ring-offset-black/65";
}

function InvestmentPctBoxes(): JSX.Element {
  const t = useTranslation();
  const items = [
    { id: "10" as InvestmentPctId, label: "10%" },
    { id: "5" as InvestmentPctId, label: "5%" },
    { id: "1" as InvestmentPctId, label: "1%" },
  ];

  const investmentPct = useCotizadorUiStore((s) => s.investmentPct);
  const pickInvestmentPct = useCotizadorUiStore((s) => s.pickInvestmentPct);

  return (
    <fieldset>
      <legend className="sr-only">Porcentaje de inversión inicial</legend>
      <FieldLabelTiny id="pct-label-inline">{t("initialInvestment")}</FieldLabelTiny>
      <div role="group" aria-labelledby="pct-label-inline" className="flex flex-wrap gap-2">
        {items.map((it) => (
          <label
            key={it.id}
            className={`relative flex min-h-[2.35rem] min-w-[4.25rem] flex-1 cursor-pointer items-center justify-center rounded-lg border-[1.5px] px-2 text-[0.78rem] font-extrabold transition-colors sm:min-h-10 sm:text-[0.82rem] ${pctWrapClass(investmentPct === it.id, it.id)}`}
          >
            <input
              type="radio"
              name="pct-box"
              value={it.id}
              checked={investmentPct === it.id}
              onChange={() => pickInvestmentPct(it.id)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <span
              className={`pointer-events-none relative z-[1] ${investmentPct === it.id && it.id !== "10" ? "text-white" : investmentPct === it.id && it.id === "10" ? "text-zinc-950" : "text-white"}`}
            >
              {it.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function DreamSizeSlider(): JSX.Element {
  const t = useTranslation();
  const purpose = useCotizadorUiStore((s) => s.purpose);
  const tamanoHuge = useCotizadorUiStore((s) => s.tamanoHuge);
  const metrosCuadradosStr = useCotizadorUiStore((s) => s.metrosCuadradosStr);
  const updateDreamSqmRaw = useCotizadorUiStore((s) => s.updateDreamSqmRaw);

  const { min, max } = sqmBoundsForPurpose(purpose);
  const sqmValue = parseSqmStored(metrosCuadradosStr, purpose);

  useEffect(() => {
    const raw = useCotizadorUiStore.getState().metrosCuadradosStr;
    const clamped = clampSqmToPurposeBounds(Number.parseFloat(raw), purpose);
    if (String(clamped) !== raw) {
      updateDreamSqmRaw(String(clamped));
    }
  }, [purpose, updateDreamSqmRaw]);

  const onSqmValueChange = useCallback(
    (next: number) => {
      updateDreamSqmRaw(String(next));
    },
    [updateDreamSqmRaw],
  );

  const fillPct = max > min ? ((sqmValue - min) / (max - min)) * 100 : 0;

  return (
    <div
      className={`rounded-xl border border-white/12 bg-black/28 px-2.5 pt-1.5 pb-1 backdrop-blur-md sm:px-3 ${tamanoHuge ? "shadow-[inset_0_0_0_1px_rgba(253,224,71,0.35)] ring-2 ring-yellow-400/75 ring-offset-1 ring-offset-black/55" : ""}`}
    >
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span
          id="dream-size-slider-label"
          className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-white/90 sm:text-[0.66rem]"
        >
          {t("dreamSize")}
        </span>
        <span
          aria-live="polite"
          className="shrink-0 text-[0.95rem] font-extrabold tabular-nums tracking-tight text-[#87e9db] drop-shadow-[0_0_10px_rgba(135,233,219,0.35)] sm:text-[1.02rem]"
        >
          {sqmValue} {t("sqmUnit")}
        </span>
      </div>

      <div className="px-0.5">
        <DreamSizeSliderField
          min={min}
          max={max}
          value={sqmValue}
          fillPct={fillPct}
          ariaLabelledBy="dream-size-slider-label"
          ariaValueText={`${sqmValue} metros cuadrados`}
          onValueChange={onSqmValueChange}
        />
        <div className="mt-px flex justify-between px-0.5 text-[0.58rem] font-semibold tabular-nums text-white/55">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}

function UbicacionField(): JSX.Element {
  const t = useTranslation();
  const ubicacionSeleccionada = useCotizadorUiStore((s) => s.ubicacionSeleccionada);
  const setUbicacionSeleccionada = useCotizadorUiStore((s) => s.setUbicacionSeleccionada);

  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const next = event.target.value as UbicacionId;
    setUbicacionSeleccionada(next);
  };

  return (
    <div>
      <FieldLabelTiny id="property-select-label">{t("location")}</FieldLabelTiny>
      <div className="relative">
        <select
          aria-labelledby="property-select-label"
          id="property-select"
          value={ubicacionSeleccionada}
          onChange={onSelectChange}
          className="h-11 w-full appearance-none rounded-xl border-[1.5px] border-white bg-black/35 px-3 pr-12 text-[0.72rem] font-semibold tracking-tight text-white outline-none backdrop-blur-md hover:bg-black/42 focus-visible:ring-2 focus-visible:ring-[#ddd6fe] sm:h-11 sm:text-[0.78rem]"
        >
          <option value="" disabled className="text-zinc-900">
            {t("selectProperty")}
          </option>
          <option value="qro" className="text-zinc-900">
            {t("locationQro")}
          </option>
          <option value="cancun" className="text-zinc-900">
            {t("locationCancun")}
          </option>
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 size-[1.1rem] -translate-y-1/2 text-white/90 sm:size-[1.2rem]"
          strokeWidth={3}
        />
      </div>
    </div>
  );
}

function CurrencyInline(): JSX.Element {
  const t = useTranslation();
  const currency = useCotizadorUiStore((s) => s.currency);
  const pickCurrency = useCotizadorUiStore((s) => s.pickCurrency);

  return (
    <fieldset className="min-w-0">
      <FieldLabelTiny id="currency-label-inline">{t("currency")}</FieldLabelTiny>
      <div className="flex gap-1" aria-labelledby="currency-label-inline">
        <label className={currencyPillClass(currency === "usd")}>
          <input
            type="radio"
            name="currency"
            value="usd"
            checked={currency === "usd"}
            onChange={() => pickCurrency("usd")}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <span className="pointer-events-none">USD</span>
        </label>
        <label className={currencyPillClass(currency === "mxn")}>
          <input
            type="radio"
            name="currency"
            value="mxn"
            checked={currency === "mxn"}
            onChange={() => pickCurrency("mxn")}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <span className="pointer-events-none">MXN</span>
        </label>
      </div>
    </fieldset>
  );
}

/** Plazos y tipo de cambio en la misma fila, misma altura visual. */
function PlazosYCurrencyRow(): JSX.Element {
  return (
    <div className="grid grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] items-end gap-x-2 gap-y-0 sm:gap-x-2.5">
      <TermPlazoRadioGroup />
      <CurrencyInline />
    </div>
  );
}

export function DesignMesa({ onOpenLeadModal }: { onOpenLeadModal?: () => void }): JSX.Element {
  return (
    <section
      className="flex min-h-0 flex-1 flex-col justify-around overflow-y-auto overscroll-y-contain pb-[max(0.35rem,env(safe-area-inset-bottom))] [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5"
      aria-label="Parámetros de cotización"
    >
      <DreamRadioGroup />
      <DreamSizeSlider />
      <UbicacionField />
      <InvestmentPctBoxes />
      <PlazosYCurrencyRow />
      <div className="shrink-0 px-px">
        <QuoteCtaButton onClick={onOpenLeadModal} />
      </div>
    </section>
  );
}
