/** Modelo provisional de asesor (mock hasta Supabase). */
export type MockAgent = {
  slug: string;
  name: string;
  email: string;
  whatsapp: string;
};

export const mockAgents: MockAgent[] = [
  { slug: "juan-perez", name: "Juan Perez", email: "juan@maderas.com", whatsapp: "+521234567890" },
  { slug: "maria-lopez", name: "Maria Lopez", email: "maria@maderas.com", whatsapp: "+529876543210" },
];

export function findAgentBySlug(slug: string): MockAgent | undefined {
  return mockAgents.find((a) => a.slug === slug);
}

/** Normaliza nombre → slug URL (minúsculas, guiones). */
export function slugifyFromFullName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Dígitos para wa.me (sin espacios ni +). */
export function whatsappDigitsForWaMe(raw: string): string {
  return raw.replace(/\D/g, "");
}
