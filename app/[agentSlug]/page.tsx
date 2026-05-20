import type { Metadata } from "next";
import type { JSX } from "react";
import { AdvisorNotFound } from "@/components/cotizador/advisor-not-found";
import { CotizadorShell } from "@/components/cotizador/cotizador-shell";
import { findAgentBySlug } from "@/src/lib/mockData";

type PageProps = {
  params: Promise<{ agentSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { agentSlug } = await params;
  const agent = findAgentBySlug(agentSlug);
  if (!agent) {
    return { title: "Asesor no encontrado" };
  }
  return {
    title: `${agent.name} · Cotizador`,
    description: `Cotizador en vivo — ${agent.name}`,
  };
}

export default async function AgentQuotePage({ params }: PageProps): Promise<JSX.Element> {
  const { agentSlug } = await params;
  const agent = findAgentBySlug(agentSlug);

  if (!agent) {
    return <AdvisorNotFound attemptedSlug={agentSlug} />;
  }

  return <CotizadorShell agent={agent} />;
}
