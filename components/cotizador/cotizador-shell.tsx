import type { JSX } from "react";
import { CotizadorBackground } from "./cotizador-background";
import { FinancialDashboard } from "./financial-dashboard";
import { DesignMesa } from "./design-mesa";

/**
 * Pantalla tipo app nativa: alto fijo (`100dvh`), sin scroll global;
 * sólo overflow local muy acotado en la mesa si el viewport cae muy bajo.
 */
export function CotizadorShell(): JSX.Element {
  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden text-slate-100">
      <CotizadorBackground />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="mx-auto flex min-h-0 w-full max-w-[min(100vw,28rem)] flex-1 flex-col px-3">
          <header className="shrink-0">
            <FinancialDashboard />
          </header>

          <DesignMesa />
        </div>
      </div>
    </div>
  );
}
