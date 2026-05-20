import Image from "next/image";
import type { JSX } from "react";

/** Fondo tipo mock: foto arquitectura + degradado violeta/azul + leve blur. */
export function CotizadorBackground(): JSX.Element {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
      <Image
        src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=85&w=1600&auto=format&fit=crop"
        alt=""
        fill
        sizes="100vw"
        priority
        className="scale-105 object-cover object-center"
      />
      <div className="absolute inset-0 bg-purple-950/75 mix-blend-multiply [mask-image:none]" />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/70 via-violet-900/45 to-zinc-950/90" />
      <div className="absolute inset-0 backdrop-blur-[14px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
    </div>
  );
}
