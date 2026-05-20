import type { TripTuple } from "@/lib/i18n/panel-trip";
import {
  getPanelTrip,
  purposeToPanelKey,
  terrenoSqmPanelKey,
} from "@/lib/i18n/panel-trip";
import type { LanguageId } from "@/lib/i18n/types";
import type { PurposeId } from "./cotizador-ui-store";

/** MSI del slider: solo aplica con Mi Terreno seleccionado. */
export function tripFromTerrenoMetros(m2: number, language: LanguageId): TripTuple {
  return getPanelTrip(terrenoSqmPanelKey(m2), language);
}

export function panelTripForSqmChange(
  purpose: PurposeId | null,
  m2: number,
  language: LanguageId,
): TripTuple | null {
  if (purpose === "terreno") {
    return tripFromTerrenoMetros(m2, language);
  }
  if (purpose === "lote-habitacional" || purpose === "negocio") {
    return getPanelTrip(purposeToPanelKey(purpose), language);
  }
  return null;
}

/** Resaltado visual del slider (tier 48 MSI en terreno). */
export function terrenoSqmHighlight(m2: number, purpose: PurposeId | null): boolean {
  return purpose === "terreno" && m2 >= 200;
}
