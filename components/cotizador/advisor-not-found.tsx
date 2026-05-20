import Link from "next/link";
import type { JSX } from "react";

export function AdvisorNotFound({ attemptedSlug }: { attemptedSlug: string }): JSX.Element {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-[#0b0910] px-6 py-16 text-center text-slate-100">
      <div className="max-w-md space-y-3">
        <h1 className="text-2xl font-bold tracking-tight">Asesor no encontrado</h1>
        <p className="text-sm leading-relaxed text-white/75">
          No hay un cotizador registrado para la ruta{" "}
          <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[0.85rem] text-[#87e9db]">
            /{attemptedSlug}
          </span>
          . Verifica el enlace o pide a tu equipo una URL válida.
        </p>
        <p className="text-xs text-white/55">
          Advisor not found — check the URL or contact support for a valid link.
        </p>
      </div>
      <Link
        href="/admin"
        className="rounded-xl bg-[#8b2cf5] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_32px_-8px_rgba(139,44,245,0.55)] hover:brightness-110"
      >
        Ir al panel de administración
      </Link>
    </div>
  );
}
