import { COTIZADOR_PANEL_AVATARS } from "@/lib/cotizador-panel-messages";
import { PANEL_TRANSLATIONS } from "@/lib/i18n/translations";
import type { LanguageId, PanelMessageKey } from "@/lib/i18n/types";
import type { PurposeId } from "@/lib/cotizador-ui-store";

export type TripTuple = readonly [message: string, avatarUrl: string];

export function getPanelMessageText(key: PanelMessageKey, language: LanguageId): string {
  return PANEL_TRANSLATIONS[language][key];
}

export function getPanelTrip(key: PanelMessageKey, language: LanguageId): TripTuple {
  const avatarMap: Record<PanelMessageKey, string> = {
    initial: COTIZADOR_PANEL_AVATARS.initial,
    guardian: COTIZADOR_PANEL_AVATARS.guardianSaludo,
    purposeCasa: COTIZADOR_PANEL_AVATARS.casa,
    purposeTerreno: COTIZADOR_PANEL_AVATARS.terreno,
    purposeNegocio: COTIZADOR_PANEL_AVATARS.negocio,
    ubicacion: COTIZADOR_PANEL_AVATARS.ubicacion,
    enganche10: COTIZADOR_PANEL_AVATARS.enganche10,
    enganche5: COTIZADOR_PANEL_AVATARS.enganche5,
    enganche1: COTIZADOR_PANEL_AVATARS.enganche1,
    terrenoSqm48: COTIZADOR_PANEL_AVATARS.terrenoSqm48,
    terrenoSqm36: COTIZADOR_PANEL_AVATARS.terrenoSqm36,
    currencyMxn: COTIZADOR_PANEL_AVATARS.mxn,
    currencyUsd: COTIZADOR_PANEL_AVATARS.usd,
  };

  return [getPanelMessageText(key, language), avatarMap[key]];
}

export function purposeToPanelKey(id: PurposeId): PanelMessageKey {
  if (id === "lote-habitacional") return "purposeCasa";
  if (id === "terreno") return "purposeTerreno";
  return "purposeNegocio";
}

export function terrenoSqmPanelKey(m2: number): PanelMessageKey {
  return m2 >= 200 ? "terrenoSqm48" : "terrenoSqm36";
}

export function enganchePanelKey(id: "10" | "5" | "1"): PanelMessageKey {
  if (id === "10") return "enganche10";
  if (id === "5") return "enganche5";
  return "enganche1";
}
