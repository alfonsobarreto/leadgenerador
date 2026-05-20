"use client";

import { ChevronDown, House } from "lucide-react";
import type { ChangeEvent } from "react";
import type { JSX } from "react";
import { MesaDeDisenoLogo } from "./mesa-logo";
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
  const opts: readonly { id: PurposeId; label: string }[] = [
    { id: "lote-habitacional", label: "Lote habitacional" },
    { id: "terreno", label: "Terreno" },
    { id: "negocio", label: "Mi negocio" },
  ];

  const purpose = useCotizadorUiStore((s) => s.purpose);
  const pickPurpose = useCotizadorUiStore((s) => s.pickPurpose);

  return (
    <fieldset>
      <legend className="sr-only">Tipo de proyecto</legend>
      <FieldLabelTiny id="dream-group-label">Tu sueño:</FieldLabelTiny>
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
            <span className="max-[320px]:max-w-[92px] max-[320px]:leading-tight">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function TermPlazoRadioGroup(): JSX.Element {
  const termSelected = useCotizadorUiStore((s) => s.termSelected);
  const pickTerm = useCotizadorUiStore((s) => s.pickTerm);

  const items: readonly { id: TermId; label: string }[] = [
    { id: "30", label: "30 años" },
    { id: "20", label: "20 años" },
    { id: "spot", label: "Al contado" },
  ];

  return (
    <fieldset>
      <FieldLabelTiny id="plazo-label-inline">Plazos:</FieldLabelTiny>
      <div className="flex flex-wrap gap-1.5" aria-labelledby="plazo-label-inline">
        {items.map((it) => {
          const sel = termSelected === it.id;
          return (
            <label
              key={it.id}
              className={`relative cursor-pointer whitespace-nowrap rounded-full border-[1.5px] px-3 py-1.5 text-[0.68rem] font-semibold tracking-tight transition-colors sm:px-[0.875rem] sm:text-xs ${
                sel
                  ? "border-transparent bg-[#8b2cf5] text-white shadow-[0_12px_28px_-10px_rgba(139,44,245,0.55)]"
                  : "border-white bg-transparent text-white hover:bg-white/5"
              }`}
            >
              <input
                type="radio"
                name="term"
                value={it.id}
                checked={sel}
                onChange={() => pickTerm(it.id)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <span className="pointer-events-none">{it.label}</span>
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
      <div className="mb-1.5 flex justify-end px-px">
        <span id="pct-label-inline" className="text-[0.74rem] font-bold leading-none text-white sm:text-[0.8rem]">
          Inversión inicial
        </span>
      </div>
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

function UbicacionField(): JSX.Element {
  const bumpUbicacion = useCotizadorUiStore((s) => s.bumpUbicacion);
  const ubicacionSeleccionada = useCotizadorUiStore((s) => s.ubicacionSeleccionada);
  const setUbicacionSeleccionada = useCotizadorUiStore((s) => s.setUbicacionSeleccionada);

  const onInteract = (): void => {
    bumpUbicacion();
  };

  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const next = event.target.value as UbicacionId;
    setUbicacionSeleccionada(next);
    bumpUbicacion();
  };

  return (
    <div>
      <FieldLabelTiny id="property-select-label">Ubicación</FieldLabelTiny>
      <div className="relative">
        <select
          aria-labelledby="property-select-label"
          id="property-select"
          value={ubicacionSeleccionada}
          onFocus={onInteract}
          onChange={onSelectChange}
          onClick={onInteract}
          className="h-11 w-full appearance-none rounded-xl border-[1.5px] border-white bg-black/35 px-3 pr-12 text-[0.72rem] font-semibold tracking-tight text-white outline-none backdrop-blur-md hover:bg-black/42 focus-visible:ring-2 focus-visible:ring-[#ddd6fe] sm:h-11 sm:text-[0.78rem]"
        >
          <option value="" disabled className="text-zinc-900">
            Selecciona la propiedad…
          </option>
          <option value="qro" className="text-zinc-900">
            Querétaro · Centro
          </option>
          <option value="cancun" className="text-zinc-900">
            Cancún · Esmeralda
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

function currencyActive(sel: boolean): string {
  return sel
    ? "border-transparent bg-[#8b2cf5] shadow-[0_12px_32px_-8px_rgba(139,44,245,0.62)] ring-2 ring-yellow-400/95 ring-offset-1 ring-offset-black/70"
    : "border-white";
}

function DreamSizeCurrencyRow(): JSX.Element {
  const tamanoHuge = useCotizadorUiStore((s) => s.tamanoHuge);
  const currency = useCotizadorUiStore((s) => s.currency);
  const pickCurrency = useCotizadorUiStore((s) => s.pickCurrency);
  const updateDreamSqmRaw = useCotizadorUiStore((s) => s.updateDreamSqmRaw);
  const metrosCuadradosStr = useCotizadorUiStore((s) => s.metrosCuadradosStr);

  const syncSqm = (event: ChangeEvent<HTMLInputElement>): void => {
    updateDreamSqmRaw(event.target.value);
  };

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-2 sm:gap-x-2.5">
      <div className="min-w-0">
        <FieldLabelTiny id="dream-size-label">Tamaño de tu sueño</FieldLabelTiny>
        <div className="relative mt-1">
          <span className="pointer-events-none absolute -top-2 left-[1.875rem] z-10 whitespace-nowrap bg-gradient-to-r from-purple-950/92 via-purple-950/74 to-purple-950/92 px-1 pb-px text-[0.5625rem] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_1px_10px_rgba(0,0,0,0.35)] sm:left-[2.125rem] sm:text-[0.6rem]">
            m²…
          </span>
          <div
            className={`relative flex items-center rounded-lg border-[1.5px] border-white bg-black/38 px-1.5 pb-1 pt-7 backdrop-blur-md transition-shadow focus-within:ring-[1px] focus-within:ring-[#ddd6fe] ${tamanoHuge ? "shadow-[inset_0_0_0_1px_rgba(253,224,71,0.35)] ring-2 ring-yellow-400/92 ring-offset-1 ring-offset-black/70" : ""}`}
          >
            <House
              aria-hidden
              className="mx-1 size-[1.0625rem] shrink-0 text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.35)] sm:size-[1.125rem]"
              strokeWidth={2.75}
            />
            <input
              id="dream-size-input"
              aria-labelledby="dream-size-label"
              aria-describedby="dream-size-hint"
              placeholder=""
              type="number"
              inputMode="decimal"
              min={0}
              step={1}
              value={metrosCuadradosStr}
              onChange={syncSqm}
              onFocus={(e) => updateDreamSqmRaw(e.target.value)}
              className="w-full bg-transparent pb-px text-[0.84rem] font-bold tabular-nums text-white outline-none placeholder:text-white/45 sm:text-[0.9rem]"
            />
          </div>
          <span id="dream-size-hint" className="sr-only">
            Metros cuadrados estimados para la cotización.
          </span>
        </div>
      </div>

      <fieldset className="min-w-0">
        <legend className="mb-1 block px-px text-[0.72rem] font-bold leading-none text-white sm:text-[0.78rem]">
          Tipo de cambio
        </legend>
        <div className="flex flex-col justify-center gap-1 py-px">
          <label
            className={`relative flex flex-1 cursor-pointer items-center justify-center rounded-full border-[1.5px] py-2 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] transition-[background,color,border-color,box-shadow] sm:text-[0.66rem] sm:tracking-[0.17em] ${currencyActive(currency === "usd")}`}
          >
            <input
              type="radio"
              name="currency"
              value="usd"
              checked={currency === "usd"}
              onChange={() => pickCurrency("usd")}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <span className="pointer-events-none text-white">USD</span>
          </label>
          <label
            className={`relative flex flex-1 cursor-pointer items-center justify-center rounded-full border-[1.5px] py-2 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] transition-[background,color,border-color,box-shadow] sm:text-[0.66rem] sm:tracking-[0.17em] ${currencyActive(currency === "mxn")}`}
          >
            <input
              type="radio"
              name="currency"
              value="mxn"
              checked={currency === "mxn"}
              onChange={() => pickCurrency("mxn")}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <span className="pointer-events-none text-white">MXN</span>
          </label>
        </div>
      </fieldset>
    </div>
  );
}

export function DesignMesa(): JSX.Element {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden" aria-label="Parámetros de cotización">
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:thin] sm:gap-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5">
        <MesaDeDisenoLogo />

        <div className="flex shrink-0 flex-col gap-y-2 sm:gap-y-2.5">
          <DreamRadioGroup />
          <UbicacionField />
          <TermPlazoRadioGroup />
          <InvestmentPctBoxes />
          <DreamSizeCurrencyRow />
        </div>
      </div>
    </section>
  );
}
