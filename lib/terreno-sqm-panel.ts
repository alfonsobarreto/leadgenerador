import { COTIZADOR_PANEL_AVATARS, COTIZADOR_PANEL_MESSAGES } from "./cotizador-panel-messages";
import type { PurposeId } from "./cotizador-ui-store";

type TripTuple = readonly [message: string, avatarUrl: string];

/** MSI del slider: solo aplica con Mi Terreno seleccionado. */
export function tripFromTerrenoMetros(m2: number): TripTuple {
  if (m2 >= 200) {
    return [COTIZADOR_PANEL_MESSAGES.terrenoSqm48, COTIZADOR_PANEL_AVATARS.terrenoSqm48];
  }
  return [COTIZADOR_PANEL_MESSAGES.terrenoSqm36, COTIZADOR_PANEL_AVATARS.terrenoSqm36];
}

export function panelTripForSqmChange(purpose: PurposeId | null, m2: number): TripTuple | null {
  if (purpose === "terreno") {
    return tripFromTerrenoMetros(m2);
  }
  if (purpose === "lote-habitacional" || purpose === "negocio") {
    if (purpose === "lote-habitacional") {
      return [COTIZADOR_PANEL_MESSAGES.purposeCasa, COTIZADOR_PANEL_AVATARS.casa];
    }
    return [COTIZADOR_PANEL_MESSAGES.purposeNegocio, COTIZADOR_PANEL_AVATARS.negocio];
  }
  return null;
}

/** Resaltado visual del slider (tier 48 MSI en terreno). */
export function terrenoSqmHighlight(m2: number, purpose: PurposeId | null): boolean {
  return purpose === "terreno" && m2 >= 200;
}
