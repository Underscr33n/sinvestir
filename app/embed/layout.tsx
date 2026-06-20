import type { Metadata } from "next";
import { Suspense } from "react";
import { EmbedTheme } from "@/components/embed/EmbedTheme";

export const metadata: Metadata = {
  title: "Simulateur Crypto — S'investir",
};

/**
 * Layout minimal pour les routes /embed — pas de header ni sidebar.
 *
 * THÈME PERSONNALISABLE VIA URL
 * ─────────────────────────────
 * Le site hôte passe ses couleurs en paramètres URL. Toutes sont optionnelles —
 * le thème sombre par défaut s'applique si aucun paramètre n'est fourni.
 *
 * Paramètres disponibles :
 *   bg, bgCard, bgElevated, border, borderLight,
 *   primary, text, textSecondary, textMuted, success, danger
 *
 * Exemple pour un site à fond blanc :
 *   ?bg=ffffff&bgCard=f8fafc&bgElevated=f1f5f9
 *   &border=e2e8f0&borderLight=cbd5e1
 *   &primary=2563eb&text=0f172a
 *   &textSecondary=475569&textMuted=94a3b8
 *
 * Les headers HTTP autorisant l'embedding sont dans next.config.ts et vercel.json.
 */
export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <EmbedTheme />
      </Suspense>
      {children}
    </>
  );
}
