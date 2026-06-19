import { SimulateurCryptoUI } from "@/components/SimulateurCryptoUI";

/**
 * Route embed — shell minimal, conçu pour être affiché en iframe.
 * Pas de header, pas de sidebar, pas de fond global.
 * Usage: <iframe src="/embed/simulateur-crypto" />
 */
export default function EmbedSimulateurCrypto() {
  return (
    <div
      className="p-4"
      style={{ background: "var(--si-bg)", minHeight: "100vh", color: "var(--si-text)" }}
    >
      <SimulateurCryptoUI />
    </div>
  );
}
