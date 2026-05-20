import { create } from "zustand";
import { clampSqmToPurposeBounds } from "./dream-sqm-bounds";
import type { TripTuple } from "@/lib/i18n/panel-trip";
import {
  enganchePanelKey,
  getPanelTrip,
  purposeToPanelKey,
  terrenoSqmPanelKey,
} from "@/lib/i18n/panel-trip";
import type { LanguageId, PanelMessageKey } from "@/lib/i18n/types";
import { panelTripForSqmChange, terrenoSqmHighlight } from "./terreno-sqm-panel";

export type PurposeId = "lote-habitacional" | "terreno" | "negocio";

export type InvestmentPctId = "10" | "5" | "1";

export type CurrencyId = "usd" | "mxn";

export type UbicacionId = "" | "qro" | "cancun";

export type TermId = "30" | "20" | "spot";

type PanelApply = {
  panelMessageKey: PanelMessageKey;
  baselinePanelKey: PanelMessageKey;
  dynamicMessage: string;
  avatarUrl: string;
  baselineTrip: TripTuple;
};

function applyPanelKeys(
  language: LanguageId,
  panelMessageKey: PanelMessageKey,
  baselinePanelKey: PanelMessageKey,
): PanelApply {
  const [msg, av] = getPanelTrip(panelMessageKey, language);
  const baselineTrip = getPanelTrip(baselinePanelKey, language);
  return {
    panelMessageKey,
    baselinePanelKey,
    dynamicMessage: msg,
    avatarUrl: av,
    baselineTrip,
  };
}

export type CotizadorUiState = {
  language: LanguageId;
  panelMessageKey: PanelMessageKey;
  baselinePanelKey: PanelMessageKey;

  dynamicMessage: string;
  avatarUrl: string;
  baselineTrip: TripTuple;

  purpose: PurposeId | null;
  investmentPct: InvestmentPctId | null;
  currency: CurrencyId | null;

  tamanoHuge: boolean;

  metrosCuadradosStr: string;
  ubicacionSeleccionada: UbicacionId;
  termSelected: TermId;
  tasaCambioMXNPerUSD: number;

  setLanguage: (language: LanguageId) => void;
  toggleLanguage: () => void;
  pickPurpose: (id: PurposeId) => void;
  pickInvestmentPct: (id: InvestmentPctId) => void;
  updateDreamSqmRaw: (raw: string) => void;
  pickCurrency: (id: CurrencyId) => void;
  guardianTap: () => void;

  setUbicacionSeleccionada: (id: UbicacionId) => void;
  pickTerm: (term: TermId) => void;
  resetCotizadorToStart: () => void;
};

const initialPanelKey: PanelMessageKey = "initial";

const boot = applyPanelKeys("es", initialPanelKey, initialPanelKey);

export const useCotizadorUiStore = create<CotizadorUiState>((set, get) => ({
  language: "es",
  panelMessageKey: initialPanelKey,
  baselinePanelKey: initialPanelKey,
  dynamicMessage: boot.dynamicMessage,
  avatarUrl: boot.avatarUrl,
  baselineTrip: boot.baselineTrip,

  purpose: null,
  investmentPct: null,
  currency: null,
  tamanoHuge: false,

  metrosCuadradosStr: "125",
  ubicacionSeleccionada: "",
  termSelected: "30",
  tasaCambioMXNPerUSD: 17.05,

  setLanguage: (language) =>
    set((state) => ({
      language,
      ...applyPanelKeys(language, state.panelMessageKey, state.baselinePanelKey),
    })),

  toggleLanguage: () =>
    set((state) => {
      const language: LanguageId = state.language === "es" ? "en" : "es";
      return {
        language,
        ...applyPanelKeys(language, state.panelMessageKey, state.baselinePanelKey),
      };
    }),

  pickPurpose: (id) =>
    set((state) => {
      const clamped = clampSqmToPurposeBounds(
        Number.parseFloat(state.metrosCuadradosStr),
        id,
      );
      const sqmStr = String(clamped);
      const categoryKey = purposeToPanelKey(id);

      if (id === "terreno") {
        const displayKey = terrenoSqmPanelKey(clamped);
        return {
          purpose: id,
          metrosCuadradosStr: sqmStr,
          tamanoHuge: terrenoSqmHighlight(clamped, id),
          ...applyPanelKeys(state.language, displayKey, categoryKey),
        };
      }

      return {
        purpose: id,
        metrosCuadradosStr: sqmStr,
        tamanoHuge: false,
        ...applyPanelKeys(state.language, categoryKey, categoryKey),
      };
    }),

  setUbicacionSeleccionada: (ubicacionSeleccionada) =>
    set((state) => {
      if (ubicacionSeleccionada === "") {
        return { ubicacionSeleccionada };
      }
      return {
        ubicacionSeleccionada,
        ...applyPanelKeys(state.language, "ubicacion", "ubicacion"),
      };
    }),

  pickTerm: (termSelected) => set({ termSelected }),

  pickInvestmentPct: (id) =>
    set((state) => {
      const key = enganchePanelKey(id);
      return {
        investmentPct: id,
        ...applyPanelKeys(state.language, key, key),
      };
    }),

  updateDreamSqmRaw: (raw) => {
    const state = get();
    const purpose = state.purpose;
    const v = clampSqmToPurposeBounds(Number.parseFloat(raw), purpose);
    const sqmStr = String(v);
    const panelTrip = panelTripForSqmChange(purpose, v, state.language);

    if (panelTrip) {
      const displayKey =
        purpose === "terreno" ? terrenoSqmPanelKey(v) : purposeToPanelKey(purpose!);
      const baselineKey =
        purpose === "terreno" ? purposeToPanelKey("terreno") : displayKey;

      set({
        metrosCuadradosStr: sqmStr,
        tamanoHuge: terrenoSqmHighlight(v, purpose),
        panelMessageKey: displayKey,
        baselinePanelKey: baselineKey,
        dynamicMessage: panelTrip[0],
        avatarUrl: panelTrip[1],
        baselineTrip: getPanelTrip(baselineKey, state.language),
      });
      return;
    }

    set({
      metrosCuadradosStr: sqmStr,
      tamanoHuge: false,
    });
  },

  pickCurrency: (id) =>
    set((state) => {
      const key = id === "mxn" ? "currencyMxn" : "currencyUsd";
      return {
        currency: id,
        ...applyPanelKeys(state.language, key, key),
      };
    }),

  guardianTap: () =>
    set((state) => applyPanelKeys(state.language, "guardian", "guardian")),

  resetCotizadorToStart: () =>
    set((state) => ({
      purpose: null,
      investmentPct: null,
      currency: null,
      tamanoHuge: false,
      metrosCuadradosStr: "125",
      ubicacionSeleccionada: "",
      termSelected: "30",
      ...applyPanelKeys(state.language, initialPanelKey, initialPanelKey),
    })),
}));
