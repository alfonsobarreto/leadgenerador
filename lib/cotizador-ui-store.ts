import { create } from "zustand";
import { clampSqmToPurposeBounds } from "./dream-sqm-bounds";
import { COTIZADOR_PANEL_AVATARS, COTIZADOR_PANEL_MESSAGES } from "./cotizador-panel-messages";
import {
  panelTripForSqmChange,
  terrenoSqmHighlight,
  tripFromTerrenoMetros,
} from "./terreno-sqm-panel";

export type PurposeId = "lote-habitacional" | "terreno" | "negocio";

export type InvestmentPctId = "10" | "5" | "1";

export type CurrencyId = "usd" | "mxn";

export type UbicacionId = "" | "qro" | "cancun";

export type TermId = "30" | "20" | "spot";

type TripTuple = readonly [message: string, avatarUrl: string];

export type CotizadorUiState = {
  dynamicMessage: string;
  avatarUrl: string;
  /** Último par texto+avatar fijado por acciones distintas al slider de m² (ubicación, enganche, divisa, etc.). */
  baselineTrip: TripTuple;

  purpose: PurposeId | null;
  investmentPct: InvestmentPctId | null;
  currency: CurrencyId | null;

  tamanoHuge: boolean;

  /** Cadena editable en el campo m² (vacío válido temporalmente). */
  metrosCuadradosStr: string;
  ubicacionSeleccionada: UbicacionId;
  /** Plazo financiero o contado (“spot”). */
  termSelected: TermId;
  /** MXN por cada 1 USD. */
  tasaCambioMXNPerUSD: number;

  pickPurpose: (id: PurposeId) => void;
  pickInvestmentPct: (id: InvestmentPctId) => void;
  /** Actualiza m²; MSI 36/48 solo si el sueño activo es Mi Terreno. */
  updateDreamSqmRaw: (raw: string) => void;
  pickCurrency: (id: CurrencyId) => void;
  guardianTap: () => void;

  setUbicacionSeleccionada: (id: UbicacionId) => void;
  pickTerm: (term: TermId) => void;
};

const INITIAL_TRIP: TripTuple = [
  COTIZADOR_PANEL_MESSAGES.initial,
  COTIZADOR_PANEL_AVATARS.initial,
];

function tripFromPurpose(id: PurposeId): TripTuple {
  if (id === "lote-habitacional") {
    return [COTIZADOR_PANEL_MESSAGES.purposeCasa, COTIZADOR_PANEL_AVATARS.casa];
  }
  if (id === "terreno") {
    return [COTIZADOR_PANEL_MESSAGES.purposeTerreno, COTIZADOR_PANEL_AVATARS.terreno];
  }
  return [COTIZADOR_PANEL_MESSAGES.purposeNegocio, COTIZADOR_PANEL_AVATARS.negocio];
}

export const useCotizadorUiStore = create<CotizadorUiState>((set, get) => ({
  dynamicMessage: INITIAL_TRIP[0],
  avatarUrl: INITIAL_TRIP[1],
  baselineTrip: INITIAL_TRIP,

  purpose: null,
  investmentPct: null,
  currency: null,
  tamanoHuge: false,

  metrosCuadradosStr: "125",
  ubicacionSeleccionada: "",
  termSelected: "30",
  tasaCambioMXNPerUSD: 17.05,

  pickPurpose: (id) =>
    set((state) => {
      const [categoryMsg, categoryAv] = tripFromPurpose(id);
      const clamped = clampSqmToPurposeBounds(
        Number.parseFloat(state.metrosCuadradosStr),
        id,
      );
      const sqmStr = String(clamped);

      if (id === "terreno") {
        const [msg, av] = tripFromTerrenoMetros(clamped);
        return {
          purpose: id,
          dynamicMessage: msg,
          avatarUrl: av,
          baselineTrip: [categoryMsg, categoryAv],
          metrosCuadradosStr: sqmStr,
          tamanoHuge: terrenoSqmHighlight(clamped, id),
        };
      }

      return {
        purpose: id,
        dynamicMessage: categoryMsg,
        avatarUrl: categoryAv,
        baselineTrip: [categoryMsg, categoryAv],
        metrosCuadradosStr: sqmStr,
        tamanoHuge: false,
      };
    }),

  setUbicacionSeleccionada: (ubicacionSeleccionada) =>
    set(() => {
      if (ubicacionSeleccionada === "") {
        return { ubicacionSeleccionada };
      }
      const msg = COTIZADOR_PANEL_MESSAGES.ubicacionSeleccionada;
      const av = COTIZADOR_PANEL_AVATARS.ubicacion;
      return {
        ubicacionSeleccionada,
        dynamicMessage: msg,
        avatarUrl: av,
        baselineTrip: [msg, av],
      };
    }),

  pickTerm: (termSelected) => set({ termSelected }),

  pickInvestmentPct: (id) =>
    set(() => {
      const table: Record<InvestmentPctId, TripTuple> = {
        "10": [COTIZADOR_PANEL_MESSAGES.enganche10, COTIZADOR_PANEL_AVATARS.enganche10],
        "5": [COTIZADOR_PANEL_MESSAGES.enganche5, COTIZADOR_PANEL_AVATARS.enganche5],
        "1": [COTIZADOR_PANEL_MESSAGES.enganche1, COTIZADOR_PANEL_AVATARS.enganche1],
      };
      const [msg, avatar] = table[id];

      return {
        investmentPct: id,
        dynamicMessage: msg,
        avatarUrl: avatar,
        baselineTrip: [msg, avatar],
      };
    }),

  updateDreamSqmRaw: (raw) => {
    const purpose = get().purpose;
    const v = clampSqmToPurposeBounds(Number.parseFloat(raw), purpose);
    const sqmStr = String(v);
    const panelTrip = panelTripForSqmChange(purpose, v);

    if (panelTrip) {
      const [msg, av] = panelTrip;
      set({
        metrosCuadradosStr: sqmStr,
        dynamicMessage: msg,
        avatarUrl: av,
        tamanoHuge: terrenoSqmHighlight(v, purpose),
      });
      return;
    }

    set({
      metrosCuadradosStr: sqmStr,
      tamanoHuge: false,
    });
  },

  pickCurrency: (id) =>
    set(() => {
      if (id === "mxn") {
        const msg = COTIZADOR_PANEL_MESSAGES.currencyMxn;
        const av = COTIZADOR_PANEL_AVATARS.mxn;
        return {
          currency: id,
          dynamicMessage: msg,
          avatarUrl: av,
          baselineTrip: [msg, av],
        };
      }
      const msg = COTIZADOR_PANEL_MESSAGES.currencyUsd;
      const av = COTIZADOR_PANEL_AVATARS.usd;
      return {
        currency: id,
        dynamicMessage: msg,
        avatarUrl: av,
        baselineTrip: [msg, av],
      };
    }),

  guardianTap: () =>
    set({
      dynamicMessage: COTIZADOR_PANEL_MESSAGES.guardianGreeting,
      avatarUrl: COTIZADOR_PANEL_AVATARS.guardianSaludo,
      baselineTrip: [
        COTIZADOR_PANEL_MESSAGES.guardianGreeting,
        COTIZADOR_PANEL_AVATARS.guardianSaludo,
      ],
    }),
}));
