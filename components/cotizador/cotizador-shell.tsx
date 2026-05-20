import type { JSX } from "react";
import { CotizadorBackground } from "./cotizador-background";
import { FinancialDashboard } from "./financial-dashboard";
import { mockFinancialSummary } from "./mock-display";
import { DesignMesa } from "./design-mesa";
import { QuoteCtaButton } from "./quote-cta";

/**
 * Layout tipo mock: foto + velo violeta “glass”, contenido centrado ~480 px,
 * scroll unificado y CTA fijo inferior (sin navegación de rutas).
 */
export function CotizadorShell(): JSX.Element {
  return (
    <>
      <CotizadorBackground />
      <div className="relative flex min-h-dvh flex-col text-slate-100">
        <div className="mx-auto flex w-full max-w-[min(100vw,28rem)] flex-1 flex-col">
          <header className="shrink-0">
            <FinancialDashboard
              listPrice={mockFinancialSummary.listPrice}
              initialInvestment={mockFinancialSummary.initialInvestment}
              toFinance={mockFinancialSummary.toFinance}
              monthlyPayment={mockFinancialSummary.monthlyPayment}
            />
          </header>

          <main className="min-h-0 flex-1">
            <DesignMesa />
          </main>
        </div>
      </div>
      <QuoteCtaButton />
    </>
  );
}
