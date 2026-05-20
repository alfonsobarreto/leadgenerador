import { create } from "zustand";
import { COTIZADOR_PANEL_MESSAGES } from "./cotizador-panel-messages";

export type CotizadorUiState = {
  /** Texto principal del panel superior junto al avatar. */
  dynamicMessage: string;
  setDynamicMessage: (next: string) => void;
};

export const useCotizadorUiStore = create<CotizadorUiState>((set) => ({
  dynamicMessage: COTIZADOR_PANEL_MESSAGES.initial,
  setDynamicMessage: (dynamicMessage) => set({ dynamicMessage }),
}));
