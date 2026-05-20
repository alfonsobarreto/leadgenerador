"use client";

import { useState } from "react";
import type { JSX } from "react";
import { CotizadorBackground } from "./cotizador-background";
import { DesignMesa } from "./design-mesa";
import { FinancialDashboard } from "./financial-dashboard";
import { LeadGeneratorModal } from "./lead-generator-modal";
import { useLiveQuoteCalculation } from "@/lib/use-live-quote-calculation";
import type { MockAgent } from "@/src/lib/mockData";

/**
 * Pantalla tipo app nativa: alto fijo (`100dvh`), sin scroll global;
 * sólo overflow local muy acotado en la mesa si el viewport cae muy bajo.
 */
export function CotizadorShell({ agent }: { agent: MockAgent }): JSX.Element {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const quote = useLiveQuoteCalculation();

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden text-slate-100">
      <CotizadorBackground />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="mx-auto flex min-h-0 w-full max-w-[min(100vw,28rem)] flex-1 flex-col px-3">
          <header className="shrink-0">
            <FinancialDashboard />
          </header>

          {/* Modal solo cubre la mesa (controles); el dashboard de resultados queda fuera */}
          <div className="relative isolate z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
            <LeadGeneratorModal
              agent={agent}
              isOpen={leadModalOpen}
              onClose={() => setLeadModalOpen(false)}
              quote={quote}
            />
            <DesignMesa onOpenLeadModal={() => setLeadModalOpen(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}
