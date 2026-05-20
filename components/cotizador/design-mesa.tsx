"use client";

import { ChevronDown, House } from "lucide-react";
import type { ChangeEvent } from "react";
import type { JSX } from "react";
import { MesaDeDisenoLogo } from "./mesa-logo";
import { COTIZADOR_PANEL_MESSAGES } from "@/lib/cotizador-panel-messages";
import { useCotizadorUiStore } from "@/lib/cotizador-ui-store";

const violet = "#8b2cf5";

const PURPOSE_TRIGGERS_MESSAGE = new Set(["lote-habitacional", "terreno"]);

function BoldFieldLabel({ id, children }: { id: string; children: string }): JSX.Element {
  return (
    <p
      id={id}
      className="mb-2 px-px text-[0.95rem] font-bold leading-tight text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.15)]"
    >
      {children}
    </p>
  );
}

function DreamRadioGroup(): JSX.Element {
  const opts: readonly { id: string; label: string; defaultChecked?: boolean }[] = [
    { id: "lote-habitacional", label: "Lote habitacional", defaultChecked: true },
    { id: "terreno", label: "Terreno" },
    { id: "negocio", label: "Mi negocio" },
  ];

  const setDynamicMessage = useCotizadorUiStore((s) => s.setDynamicMessage);

  const onPurposeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!event.target.checked) return;
    const { value } = event.target;
    if (PURPOSE_TRIGGERS_MESSAGE.has(value)) {
      setDynamicMessage(COTIZADOR_PANEL_MESSAGES.purposeLoteOTerreno);
    }
  };

  return (
    <fieldset>
      <legend className="sr-only">Tipo de proyecto</legend>
      <BoldFieldLabel id="dream-group-label">Tu sueño:</BoldFieldLabel>
      <div
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-[1.35rem] border border-white/12 bg-black/28 px-3 py-3.5 backdrop-blur-md sm:justify-center sm:gap-x-10"
        role="group"
        aria-labelledby="dream-group-label"
      >
        {opts.map((opt) => (
          <label
            key={opt.id}
            className="flex cursor-pointer select-none items-center gap-3 text-[0.9rem] font-semibold tracking-tight text-white"
          >
            <input
              type="radio"
              name="purpose"
              value={opt.id}
              defaultChecked={opt.defaultChecked}
              onChange={onPurposeChange}
              style={{ accentColor: violet }}
              className="size-5 shrink-0 border-[1.5px] border-white/90 bg-white/15 shadow-inner shadow-black/25"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Pills plazos: borde blanco; selección violeta sólido. */
function OutlinePills({
  name,
  labelledById,
  items,
}: {
  name: string;
  labelledById: string;
  items: readonly { id: string; label: string; defaultChecked?: boolean }[];
}): JSX.Element {
  return (
    <div
      className="flex flex-wrap justify-center gap-2 sm:justify-start"
      role="group"
      aria-labelledby={labelledById}
    >
      {items.map((it) => (
        <label
          key={it.id}
          className="relative cursor-pointer whitespace-nowrap rounded-full border-[1.85px] border-white bg-transparent px-6 py-2.5 text-sm font-semibold tracking-tight transition-[background-color,border-color,box-shadow,color] has-[:checked]:border-transparent has-[:checked]:bg-[#8b2cf5] has-[:checked]:text-white has-[:checked]:shadow-[0_14px_32px_-8px_rgba(139,44,245,0.55)]"
        >
          <input
            type="radio"
            name={name}
            value={it.id}
            defaultChecked={it.defaultChecked}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <span className="pointer-events-none text-white">{it.label}</span>
        </label>
      ))}
    </div>
  );
}

function InitialPctBoxes(): JSX.Element {
  const items = [
    {
      id: "10",
      label: "10%",
      message: COTIZADOR_PANEL_MESSAGES.enganche10,
      defaultChecked: true,
      mockSolid: true as const,
    },
    { id: "5", label: "5%", message: COTIZADOR_PANEL_MESSAGES.enganche5, mockSolid: false as const },
    { id: "1", label: "1%", message: COTIZADOR_PANEL_MESSAGES.enganche1, mockSolid: false as const },
  ] satisfies readonly {
    id: string;
    label: string;
    message: string;
    defaultChecked?: boolean;
    mockSolid: boolean;
  }[];

  const setDynamicMessage = useCotizadorUiStore((s) => s.setDynamicMessage);

  const onPctChange =
    (message: string) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      if (!event.target.checked) return;
      setDynamicMessage(message);
    };

  return (
    <fieldset>
      <legend className="sr-only">Porcentaje de inversión inicial</legend>
      <div className="mb-3 flex justify-end px-px">
        <span
          id="pct-label-inline"
          className="text-[0.95rem] font-bold text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.15)]"
        >
          Inversión inicial
        </span>
      </div>
      <div role="group" aria-labelledby="pct-label-inline" className="flex flex-wrap items-stretch gap-3">
        {items.map((it) => (
          <label
            key={it.id}
            className={`relative flex min-h-[3.125rem] min-w-[5.125rem] flex-1 cursor-pointer items-center justify-center rounded-xl border-[1.85px] border-white/90 px-3 text-[0.94rem] font-extrabold text-white hover:bg-white/10 ${
              it.mockSolid
                ? "has-[:checked]:border-transparent has-[:checked]:bg-white has-[:checked]:shadow-[0_14px_32px_-8px_rgba(255,255,255,0.22)] has-[:checked]:[&>span]:text-zinc-900"
                : "bg-transparent hover:bg-white/10 has-[:checked]:border-[#ddd6fe] has-[:checked]:bg-white/14 has-[:checked]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] has-[:checked]:[&>span]:text-white"
            }`}
          >
            <input
              type="radio"
              name="pct-box"
              value={it.id}
              defaultChecked={it.defaultChecked}
              onChange={onPctChange(it.message)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <span className="pointer-events-none relative z-[1]">{it.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ExchangeSegment(): JSX.Element {
  const setDynamicMessage = useCotizadorUiStore((s) => s.setDynamicMessage);

  const onCurrencyChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!event.target.checked) return;
    const { value } = event.target;
    if (value === "mxn") setDynamicMessage(COTIZADOR_PANEL_MESSAGES.currencyMxn);
    if (value === "usd") setDynamicMessage(COTIZADOR_PANEL_MESSAGES.currencyUsd);
  };

  return (
    <fieldset className="w-full">
      <legend className="mb-3 block px-px text-[0.95rem] font-bold text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.15)]">
        Tipo de cambio
      </legend>
      <div className="flex gap-4" role="group">
        <label className="relative flex flex-1 cursor-pointer items-center justify-center rounded-full border-[1.85px] border-white py-3 text-[0.78rem] font-extrabold uppercase tracking-[0.18em] transition-[background,color,border-color,box-shadow] has-[:checked]:border-transparent has-[:checked]:bg-[#8b2cf5] has-[:checked]:shadow-[0_14px_32px_-8px_rgba(139,44,245,0.52)]">
          <input
            type="radio"
            name="currency"
            value="usd"
            defaultChecked
            onChange={onCurrencyChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <span className="pointer-events-none text-white">USD</span>
        </label>
        <label className="relative flex flex-1 cursor-pointer items-center justify-center rounded-full border-[1.85px] border-white py-3 text-[0.78rem] font-extrabold uppercase tracking-[0.18em] transition-[background,color,border-color,box-shadow] has-[:checked]:border-transparent has-[:checked]:bg-[#8b2cf5] has-[:checked]:shadow-[0_14px_32px_-8px_rgba(139,44,245,0.52)]">
          <input
            type="radio"
            name="currency"
            value="mxn"
            onChange={onCurrencyChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <span className="pointer-events-none text-white">MXN</span>
        </label>
      </div>
    </fieldset>
  );
}

function UbicacionField(): JSX.Element {
  const setDynamicMessage = useCotizadorUiStore((s) => s.setDynamicMessage);

  const onUbicacionInteract = (): void =>
    setDynamicMessage(COTIZADOR_PANEL_MESSAGES.ubicacionInteract);

  return (
    <div>
      <BoldFieldLabel id="property-select-label">Ubicación del desarrollo</BoldFieldLabel>
      <div className="relative">
        <select
          aria-labelledby="property-select-label"
          id="property-select"
          defaultValue=""
          onFocus={onUbicacionInteract}
          onChange={onUbicacionInteract}
          onClick={onUbicacionInteract}
          className="h-[3.6rem] w-full appearance-none rounded-[1rem] border-[1.85px] border-white bg-black/35 px-5 pr-14 text-[0.88rem] font-semibold tracking-tight text-white outline-none backdrop-blur-md hover:bg-black/42 focus-visible:ring-2 focus-visible:ring-[#ddd6fe]"
        >
          <option value="" disabled className="text-zinc-900">
            Selecciona la propiedad de tus sueños
          </option>
          <option value="qro" className="text-zinc-900">
            Querétaro · Desarrollo Centro
          </option>
          <option value="cancun" className="text-zinc-900">
            Cancún · Zona Esmeralda
          </option>
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 size-6 -translate-y-1/2 text-white/90"
          strokeWidth={3}
        />
      </div>
    </div>
  );
}

function DreamSizeField(): JSX.Element {
  const setDynamicMessage = useCotizadorUiStore((s) => s.setDynamicMessage);

  const onAreaUpdate = (event: ChangeEvent<HTMLInputElement>): void => {
    const v = Number.parseFloat(event.target.value);
    if (Number.isFinite(v) && v > 150) {
      setDynamicMessage(COTIZADOR_PANEL_MESSAGES.tamanoGt150);
    }
  };

  return (
    <div>
      <BoldFieldLabel id="dream-size-label">Tamaño de tu sueño</BoldFieldLabel>
      <div className="relative mt-3">
        <span className="pointer-events-none absolute -top-3 left-[2.875rem] z-10 whitespace-nowrap bg-gradient-to-r from-purple-950/92 via-purple-950/74 to-purple-950/92 px-2 pb-px text-[0.6875rem] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_1px_14px_rgba(0,0,0,0.35)]">
          Cuéntame tus m²...
        </span>
        <div className="relative flex items-center rounded-[1.15rem] border-[1.85px] border-white bg-black/38 px-3 pb-3 pt-9 backdrop-blur-md focus-within:ring-2 focus-within:ring-[#ddd6fe]">
          <House
            aria-hidden
            className="mx-2 size-6 shrink-0 text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]"
            strokeWidth={2.75}
          />
          <input
            id="dream-size-input"
            aria-labelledby="dream-size-label"
            aria-describedby="dream-size-hint"
            placeholder="Ej. 120"
            type="number"
            inputMode="decimal"
            min={0}
            step={1}
            defaultValue={120}
            onChange={onAreaUpdate}
            onFocus={onAreaUpdate}
            className="w-full bg-transparent pb-px text-[1.05rem] font-bold tabular-nums text-white outline-none placeholder:text-white/55"
          />
        </div>
        <span id="dream-size-hint" className="sr-only">
          Metros cuadrados estimados para la cotización.
        </span>
      </div>
    </div>
  );
}

export function DesignMesa(): JSX.Element {
  return (
    <section className="mx-auto max-w-xl px-4 pb-44" aria-label="Parámetros de cotización">
      <MesaDeDisenoLogo />

      <div className="space-y-8 pt-2">
        <DreamRadioGroup />

        <UbicacionField />

        <div>
          <BoldFieldLabel id="plazo-label-inline">Plazos:</BoldFieldLabel>
          <OutlinePills
            name="term"
            labelledById="plazo-label-inline"
            items={[
              { id: "30", label: "30 años", defaultChecked: true },
              { id: "20", label: "20 años" },
              { id: "spot", label: "Al contado" },
            ]}
          />
        </div>

        <InitialPctBoxes />

        <div className="grid gap-9">
          <DreamSizeField />
          <ExchangeSegment />
        </div>
      </div>
    </section>
  );
}
