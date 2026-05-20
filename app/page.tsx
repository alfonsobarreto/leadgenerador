import { redirect } from "next/navigation";
import type { JSX } from "react";
import { mockAgents } from "@/src/lib/mockData";

/** Raíz: envía al primer asesor mock (multitenant por slug). */
export default function Home(): JSX.Element {
  const first = mockAgents[0];
  redirect(first ? `/${first.slug}` : "/admin");
}
