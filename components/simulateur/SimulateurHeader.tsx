import { Info } from "lucide-react";

export function SimulateurHeader() {
  return (
    <>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px flex-1" style={{ background: "var(--si-primary)", maxWidth: 80 }} />
          <h1 className="text-lg font-bold tracking-widest uppercase" style={{ color: "var(--si-text)" }}>
            Simulateur Crypto-monnaies
          </h1>
          <div className="h-px flex-1" style={{ background: "var(--si-primary)", maxWidth: 80 }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--si-primary)" }}>
          Simulez la performance historique de vos investissements en DCA
        </p>
        <p className="text-sm mt-2 max-w-2xl mx-auto" style={{ color: "var(--si-text-secondary)" }}>
          Combien aurait rapporté un investissement régulier en Bitcoin, Ethereum ou tout autre actif numérique
          sur une période donnée ? Visualisez la puissance du DCA sur vos crypto-actifs à partir de données historiques réelles.
        </p>
      </div>

      <div
        className="flex gap-3 rounded-xl border px-4 py-3 mb-6 text-sm"
        style={{ borderColor: "var(--si-primary)44", background: "var(--si-primary)0d", color: "var(--si-text-secondary)" }}
      >
        <Info size={16} className="shrink-0 mt-0.5" style={{ color: "var(--si-primary)" }} />
        <p>
          Cet outil a uniquement une vocation pédagogique et illustrative. Les résultats sont basés sur des données
          historiques et ne constituent pas un indicateur fiable des performances futures, ni un conseil en investissement.
        </p>
      </div>
    </>
  );
}
