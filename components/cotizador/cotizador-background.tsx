import Image from "next/image";
import type { JSX } from "react";

const WALLPAPER_SRC =
  "https://card-social-api.azurewebsites.net/uploads/1779312079572_0068c511-95f2-4913-854f-820de2a6e1e3.png";

/**
 * Wallpaper a pantalla completa para rutas del cotizador (no admin).
 * Blur muy ligero (~5px, “~5 %” de intensidad frente al blur fuerte anterior) + tintes suaves para el UI.
 */
export function CotizadorBackground(): JSX.Element {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-zinc-950">
      <Image
        src={WALLPAPER_SRC}
        alt=""
        fill
        sizes="100vw"
        priority
        className="origin-center scale-[1.0] select-none object-cover object-center blur-[0px] sm:blur-[0px]"
      />
      <div className="absolute inset-0 bg-purple-950/30 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-violet-950/25 to-zinc-950/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
    </div>
  );
}
