import { AppShell } from "@/components/shell/AppShell";
import { SimulateurCryptoUI } from "@/components/SimulateurCryptoUI";

export const metadata = {
  title: "Simulateur Crypto — S'investir Simulateurs",
  description:
    "Simulez vos investissements en crypto-monnaies (DCA, lump sum) et visualisez leur performance historique.",
};

export default function SimulateurCryptoPage() {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ background: "var(--si-primary-muted)", color: "var(--si-primary)" }}
            >
              Simulateur
            </span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--si-text)" }}>
            Simulateur Crypto-monnaies
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--si-text-secondary)" }}>
            Projetez la valeur de votre portefeuille selon vos paramètres d&apos;investissement en crypto-actifs.
          </p>
        </div>

        <SimulateurCryptoUI />
      </div>
    </AppShell>
  );
}
