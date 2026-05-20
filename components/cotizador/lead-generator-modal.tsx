"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, JSX } from "react";
import type { CotizacionCalculada } from "@/lib/cotizacion-calculator";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useCotizadorUiStore } from "@/lib/cotizador-ui-store";

const VIDEO_SAFE_INVEST_OPEN =
  "https://www.youtube.com/results?search_query=inversion+segura+vivienda";
const VIDEO_MYTHS_OPEN =
  "https://www.youtube.com/results?search_query=invertir+mexico+mitos";

function tpl(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [key, val] of Object.entries(vars)) {
    out = out.replaceAll(`{${key}}`, val);
  }
  return out;
}

/** Primera parte del nombre para el saludo; si viene vacío, placeholder neutral. */
function displayNombre(raw: string, lang: string): string {
  const trimmed = raw.trim();
  if (trimmed) return trimmed.split(/\s+/)[0] ?? trimmed;
  return lang === "en" ? "friend" : "amigo/a";
}

export type LeadDraft = {
  nombre: string;
  celular: string;
  whatsapp: string;
  email: string;
  mensaje: string;
};

export type LeadContactPreference = "quote_only" | "appointment";

type LeadGeneratorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Cotización en vivo desde la mesa (mismo cálculo que el dashboard). */
  quote: CotizacionCalculada;
};

const emptyLead: LeadDraft = {
  nombre: "",
  celular: "",
  whatsapp: "",
  email: "",
  mensaje: "",
};

export function LeadGeneratorModal({ isOpen, onClose, quote }: LeadGeneratorModalProps): JSX.Element | null {
  const t = useTranslation();
  const language = useCotizadorUiStore((s) => s.language);
  const resetCotizadorToStart = useCotizadorUiStore((s) => s.resetCotizadorToStart);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [lead, setLead] = useState<LeadDraft>(emptyLead);
  const [sameForDeed, setSameForDeed] = useState(true);
  const [sameWaAsCell, setSameWaAsCell] = useState(true);
  const [showExtraMessage, setShowExtraMessage] = useState(false);
  const [preference, setPreference] = useState<LeadContactPreference>("quote_only");

  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setLead(emptyLead);
    setSameForDeed(true);
    setSameWaAsCell(true);
    setShowExtraMessage(false);
    setPreference("quote_only");
  }, [isOpen]);

  useEffect(() => {
    if (sameWaAsCell) {
      setLead((prev) => ({ ...prev, whatsapp: prev.celular }));
    }
  }, [sameWaAsCell, lead.celular]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const inputClass =
    "h-11 w-full rounded-xl border-[1.5px] border-white/80 bg-black/40 px-3 text-[0.8rem] font-semibold text-white outline-none backdrop-blur-sm placeholder:text-white/45 focus-visible:ring-2 focus-visible:ring-[#c4b5fd]";

  const updateLead = <K extends keyof LeadDraft>(key: K, value: LeadDraft[K]): void => {
    setLead((p) => {
      const next = { ...p, [key]: value };
      if (sameWaAsCell && key === "celular") {
        next.whatsapp = value as string;
      }
      return next;
    });
  };

  const goFinalize = (): void => {
    if (!lead.email.trim()) return;
    setStep(4);
  };

  const ToggleRow = ({
    id,
    checked,
    onChecked,
    label,
  }: {
    id: string;
    checked: boolean;
    onChecked: (v: boolean) => void;
    label: string;
  }): JSX.Element => (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5 py-0.5 text-[0.72rem] font-semibold leading-snug text-white/92">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChecked(e.target.checked)}
        className="size-4 shrink-0 accent-[#8b2cf5]"
      />
      {label}
    </label>
  );

  const handleFinishRestart = (): void => {
    resetCotizadorToStart();
    onClose();
  };

  if (!isOpen) return null;

  const montlyStr = quote.pagoMensualInicial;

  const openVideo = (url: string): void => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4" aria-hidden={!isOpen}>
      <button
        type="button"
        aria-label={language === "en" ? "Close" : "Cerrar"}
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={() => {
          setStep(1);
          onClose();
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-title"
        aria-describedby={step === 1 ? "lead-modal-desc-1" : undefined}
        className="relative z-10 mb-0 flex max-h-[min(92dvh,44rem)] w-full max-w-[min(100vw,28rem)] flex-col rounded-t-[1.65rem] border border-white/14 border-b-0 bg-zinc-950/98 shadow-[0_-24px_60px_-12px_rgba(0,0,0,0.65)] sm:mb-auto sm:max-h-[85dvh] sm:rounded-[1.5rem] sm:border-b-[1px] sm:border-zinc-800"
      >
        <div className="sticky top-0 z-[1] flex justify-center pb-2 pt-2.5">
          <div className="h-1 w-10 rounded-full bg-white/35 sm:hidden" aria-hidden />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-1 sm:p-6 sm:pb-8">
          {step === 1 && (
            <div id="lead-modal-desc-1" className="space-y-4">
              <h2 id="lead-modal-title" className="text-center text-[1rem] font-extrabold leading-snug text-white sm:text-lg">
                {t("leadStep1Title")}
              </h2>
              <p className="text-center text-[0.76rem] leading-relaxed text-white/85 sm:text-[0.8rem]">
                {t("leadStep1Body")}
              </p>
              <div className="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    onClose();
                  }}
                  className="h-11 rounded-xl border-[1.5px] border-white/60 px-4 text-[0.75rem] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10 sm:text-[0.78rem]"
                >
                  {t("leadNoThanks")}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="h-11 rounded-xl bg-[#8b2cf5] px-5 text-[0.75rem] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_14px_32px_-8px_rgba(139,44,245,0.55)] hover:brightness-110 sm:text-[0.78rem]"
                >
                  {t("leadYesAccept")}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h2 id="lead-modal-title" className="text-[0.92rem] font-extrabold text-white sm:text-lg">
                {t("leadPersonalTitle")}
              </h2>
              <div>
                <input
                  className={inputClass}
                  value={lead.nombre}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateLead("nombre", e.target.value)}
                  placeholder={t("leadFullNamePlaceholder")}
                  aria-label={t("leadFullNamePlaceholder")}
                  autoComplete="name"
                />
              </div>
              <ToggleRow
                id="lead-deed-toggle"
                checked={sameForDeed}
                onChecked={setSameForDeed}
                label={t("leadToggleDeedSame")}
              />
              <div>
                <input
                  type="tel"
                  className={inputClass}
                  value={lead.celular}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateLead("celular", e.target.value)}
                  placeholder={t("leadCellPlaceholder")}
                  aria-label={t("leadCellPlaceholder")}
                  autoComplete="tel"
                />
              </div>
              <ToggleRow
                id="lead-wa-same-toggle"
                checked={sameWaAsCell}
                onChecked={setSameWaAsCell}
                label={t("leadToggleWaSameAsCell")}
              />
              {!sameWaAsCell && (
                <div>
                  <input
                    type="tel"
                    className={inputClass}
                    value={lead.whatsapp}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateLead("whatsapp", e.target.value)}
                    placeholder={t("leadWaPlaceholder")}
                    aria-label={t("leadWaPlaceholder")}
                    autoComplete="tel"
                  />
                </div>
              )}
              <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="h-11 rounded-xl border-[1.5px] border-white/60 px-4 text-[0.75rem] font-extrabold uppercase tracking-[0.08em] text-white hover:bg-white/10"
                >
                  {t("leadBack")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const waOk = sameWaAsCell || lead.whatsapp.trim();
                    if (!lead.nombre.trim() || !lead.celular.trim() || !waOk) return;
                    setStep(3);
                  }}
                  className="h-11 rounded-xl bg-[#8b2cf5] px-5 text-[0.75rem] font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_12px_28px_-10px_rgba(139,44,245,0.5)] hover:brightness-110"
                >
                  {t("leadNext")}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 id="lead-modal-title" className="text-[0.92rem] font-extrabold text-white sm:text-lg">
                {t("leadSecureTitle")}
              </h2>
              <div>
                <input
                  type="email"
                  className={inputClass}
                  value={lead.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateLead("email", e.target.value)}
                  placeholder={t("leadEmailPlaceholder")}
                  aria-label={t("leadEmailPlaceholder")}
                  autoComplete="email"
                />
              </div>
              <ToggleRow
                id="lead-extra-msg-toggle"
                checked={showExtraMessage}
                onChecked={setShowExtraMessage}
                label={t("leadToggleAnythingElse")}
              />
              {showExtraMessage && (
                <textarea
                  className={`${inputClass} min-h-[5.25rem] resize-none py-2.5`}
                  value={lead.mensaje}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateLead("mensaje", e.target.value)}
                  placeholder={t("leadMessagePlaceholder")}
                  aria-label={t("leadMessagePlaceholder")}
                  rows={4}
                />
              )}
              <fieldset className="space-y-2 border-0 p-0">
                <legend className="mb-2 block px-px text-[0.72rem] font-bold leading-tight text-white sm:text-[0.78rem]">
                  {t("leadHowContact")}
                </legend>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-black/35 px-2.5 py-2 text-[0.72rem] text-white">
                  <input
                    type="radio"
                    name="lead-contact-pref"
                    checked={preference === "quote_only"}
                    onChange={() => setPreference("quote_only")}
                    className="size-4 accent-[#8b2cf5]"
                  />
                  {t("leadPrefQuoteOnly")}
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-black/35 px-2.5 py-2 text-[0.72rem] text-white">
                  <input
                    type="radio"
                    name="lead-contact-pref"
                    checked={preference === "appointment"}
                    onChange={() => setPreference("appointment")}
                    className="size-4 accent-[#8b2cf5]"
                  />
                  {t("leadPrefAppointment")}
                </label>
              </fieldset>
              <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="h-11 rounded-xl border-[1.5px] border-white/60 px-4 text-[0.75rem] font-extrabold uppercase tracking-[0.08em] text-white hover:bg-white/10"
                >
                  {t("leadBack")}
                </button>
                <button
                  type="button"
                  onClick={goFinalize}
                  className="h-11 rounded-xl bg-[#8b2cf5] px-5 text-[0.75rem] font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_12px_28px_-10px_rgba(139,44,245,0.5)] hover:brightness-110"
                >
                  {t("leadFinish")}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 text-center">
              <h2 id="lead-modal-title" className="text-[1rem] font-extrabold leading-snug text-white sm:text-xl">
                {tpl(t("leadCongratsTitleTpl"), { nombre: displayNombre(lead.nombre, language) })}
              </h2>
              <p className="text-[0.9rem] font-bold tabular-nums text-[#87e9db]">
                {tpl(t("leadMonthlyFromTpl"), { monto: montlyStr })}
              </p>
              <p className="text-[0.78rem] leading-relaxed text-white/85 sm:text-[0.82rem]">
                {t("leadDreamCloserLine")}
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => openVideo(VIDEO_SAFE_INVEST_OPEN)}
                  className="h-11 rounded-xl border border-[#ddd6fe]/50 bg-black/35 px-3 text-[0.68rem] font-extrabold uppercase tracking-[0.05em] text-white hover:bg-black/55 sm:text-[0.72rem]"
                >
                  {t("leadVideoSafeInvest")}
                </button>
                <button
                  type="button"
                  onClick={() => openVideo(VIDEO_MYTHS_OPEN)}
                  className="h-11 rounded-xl border border-[#ddd6fd]/45 bg-black/35 px-3 text-[0.68rem] font-extrabold uppercase tracking-[0.05em] text-white hover:bg-black/55 sm:text-[0.72rem]"
                >
                  {t("leadVideoMyths")}
                </button>
                <button
                  type="button"
                  onClick={handleFinishRestart}
                  className="mt-2 h-11 rounded-xl bg-[#8b2cf5] px-5 text-[0.75rem] font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_12px_28px_-10px_rgba(139,44,245,0.55)] hover:brightness-110"
                >
                  {t("leadFinishRestart")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
