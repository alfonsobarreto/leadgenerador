import { create } from "zustand";
import { COTIZADOR_PANEL_AVATARS, COTIZADOR_PANEL_MESSAGES } from "./cotizador-panel-messages";

export type PurposeId = "lote-habitacional" | "terreno" | "negocio";

export type InvestmentPctId = "10" | "5" | "1";

export type CurrencyId = "usd" | "mxn";

export type UbicacionId = "" | "qro" | "cancun";

export type TermId = "30" | "20" | "spot";

type TripTuple = readonly [message: string, avatarUrl: string];

export type CotizadorUiState = {
  dynamicMessage: string;
  avatarUrl: string;

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
  bumpUbicacion: () => void;
  pickInvestmentPct: (id: InvestmentPctId) => void;
  /** Actualiza texto m² + reglas de tamaño + trip si aplica. */
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

export const useCotizadorUiStore = create<CotizadorUiState>((set) => ({
  dynamicMessage: INITIAL_TRIP[0],
  avatarUrl: INITIAL_TRIP[1],

  purpose: null,
  investmentPct: null,
  currency: null,
  tamanoHuge: false,

  metrosCuadradosStr: "120",
  ubicacionSeleccionada: "",
  termSelected: "30",
  tasaCambioMXNPerUSD: 17.05,

  pickPurpose: (id) =>
    set(() => {
      if (id === "negocio") {
        return { purpose: id };
      }

      return {
        purpose: id,
        dynamicMessage: COTIZADOR_PANEL_MESSAGES.purposeLoteOTerreno,
        avatarUrl: COTIZADOR_PANEL_AVATARS.purposeLote,
      };
    }),

  bumpUbicacion: () =>
    set({
      dynamicMessage: COTIZADOR_PANEL_MESSAGES.ubicacionInteract,
      avatarUrl: COTIZADOR_PANEL_AVATARS.ubicacion,
    }),

  setUbicacionSeleccionada: (ubicacionSeleccionada) => set({ ubicacionSeleccionada }),

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
      };
    }),

  updateDreamSqmRaw: (raw) => {
    const v = Number.parseFloat(raw);
    const tamanoHuge = Number.isFinite(v) && v > 150;

    if (tamanoHuge) {
      set({
        metrosCuadradosStr: raw,
        tamanoHuge: true,
        dynamicMessage: COTIZADOR_PANEL_MESSAGES.tamanoGt150,
        avatarUrl: COTIZADOR_PANEL_AVATARS.tamano,
      });
      return;
    }

    set({ metrosCuadradosStr: raw, tamanoHuge: false });
  },

  pickCurrency: (id) =>
    set(() =>
      id === "mxn"
        ? {
            currency: id,
            dynamicMessage: COTIZADOR_PANEL_MESSAGES.currencyMxn,
            avatarUrl: COTIZADOR_PANEL_AVATARS.mxn,
          }
        : {
            currency: id,
            dynamicMessage: COTIZADOR_PANEL_MESSAGES.currencyUsd,
            avatarUrl: COTIZADOR_PANEL_AVATARS.usd,
          },
    ),

  guardianTap: () =>
    set({
      dynamicMessage: COTIZADOR_PANEL_MESSAGES.guardianGreeting,
      avatarUrl: COTIZADOR_PANEL_AVATARS.guardianSaludo,
    }),
}));
