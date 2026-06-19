import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Crypto — S'investir",
};

/**
 * Layout minimal pour les routes /embed — pas de header ni sidebar.
 * Les headers HTTP pour autoriser l'embedding sont configurés dans next.config.ts.
 */
export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
