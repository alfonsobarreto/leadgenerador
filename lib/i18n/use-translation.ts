"use client";

import { UI_TRANSLATIONS } from "@/lib/i18n/translations";
import type { UiTranslationKey } from "@/lib/i18n/types";
import { useCotizadorUiStore } from "@/lib/cotizador-ui-store";

export function useTranslation(): (key: UiTranslationKey) => string {
  const language = useCotizadorUiStore((s) => s.language);
  return (key: UiTranslationKey) => UI_TRANSLATIONS[language][key];
}
