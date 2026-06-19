import { Play } from "lucide-react";
import { type SimulateurParams, type SimulateurResults } from "@/hooks/useSimulateurCrypto";
import { fmtEur, fmtPct, FREQUENCES } from "./ui";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

interface SimulateurResultatsProps {
  params: SimulateurParams;
  results: SimulateurResults | null;
  isLoading: boolean;
  onSimulate: () => void;
}

export function SimulateurResultats({ params, results, isLoading, onSimulate }: SimulateurResultatsProps) {
  const perfPositive = results ? results.performance >= 0 : null;
  const partInvesti = results ? (results.totalInvesti / results.capitalFinal) * 100 : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-bold pl-3 border-l-2" style={{ color: "var(--si-text)", borderColor: "var(--si-primary)" }}>
          Vos résultats
        </h2>
        <button
          onClick={onSimulate}
          disabled={isLoading || !params.coinId}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-opacity disabled:opacity-40"
          style={{ background: "var(--si-primary)", color: "#fff" }}
        >
          <Play size={13} />
          {isLoading ? "Calcul…" : "Simuler"}
        </button>
      </div>

      {/* Capital final */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--si-bg-card)", borderColor: "var(--si-border)" }}>
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs font-medium" style={{ color: "var(--si-text-secondary)" }}>Capital final</span>
          <InfoTooltip text="Valeur totale de votre portefeuille à la date de fin, au prix de marché." />
        </div>
        <p className="text-3xl font-bold" style={{ color: results ? "var(--si-text)" : "var(--si-text-muted)" }}>
          {results ? `${fmtEur(results.capitalFinal).replace("€", "").trim()} EUR` : "—"}
        </p>
        {results && (
          <>
            <div className="flex items-center gap-4 mt-2 text-xs">
              <span style={{ color: "var(--si-primary)" }}>
                Somme investie <strong>{fmtEur(results.totalInvesti)}</strong>
              </span>
              <span style={{ color: "var(--si-accent)" }}>
                Plus-value <strong style={{ color: perfPositive ? "var(--si-success)" : "var(--si-danger)" }}>
                  {perfPositive ? "+" : ""}{fmtEur(results.capitalFinal - results.totalInvesti)}
                </strong>
              </span>
            </div>
            <div className="mt-3 h-2 rounded-full overflow-hidden flex" style={{ background: "var(--si-bg-elevated)" }}>
              <div className="h-full" style={{ width: `${Math.max(0, Math.min(100, partInvesti))}%`, background: "var(--si-primary)" }} />
              <div className="h-full flex-1" style={{ background: "var(--si-accent)" }} />
            </div>
          </>
        )}
      </div>

      {/* Acquis */}
      {results && params.coinSymbol && (
        <div className="rounded-2xl border p-5" style={{ background: "var(--si-bg-card)", borderColor: "var(--si-border)" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-medium" style={{ color: "var(--si-text-secondary)" }}>Acquis</span>
            <InfoTooltip text="Quantité totale de crypto-monnaie accumulée sur la période." />
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--si-text)" }}>
            {new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 8 }).format(results.partsAcquises)}{" "}
            <span className="text-base font-semibold" style={{ color: "var(--si-text-secondary)" }}>{params.coinSymbol.toUpperCase()}</span>
          </p>
          {params.frequence !== "unique" && (
            <p className="text-xs mt-1" style={{ color: "var(--si-text-muted)" }}>
              en {results.nbPeriodes} {FREQUENCES.find((f) => f.value === params.frequence)?.label.replace("Par ", "").toLowerCase() + "s"}
            </p>
          )}
        </div>
      )}

      {/* Performance + Prix moyen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl border p-5" style={{ background: "var(--si-bg-card)", borderColor: "var(--si-border)" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-medium" style={{ color: "var(--si-text-secondary)" }}>Performance</span>
            <InfoTooltip text="Rendement total de votre investissement, exprimé en pourcentage de la somme investie." />
          </div>
          <p
            className="text-3xl font-bold"
            style={{ color: results ? (perfPositive ? "var(--si-success)" : "var(--si-danger)") : "var(--si-text-muted)" }}
          >
            {results ? `${perfPositive ? "+" : ""}${fmtPct(results.performance)} %` : "—"}
          </p>
        </div>

        <div className="rounded-2xl border p-5" style={{ background: "var(--si-bg-card)", borderColor: "var(--si-border)" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-medium" style={{ color: "var(--si-text-secondary)" }}>Prix moy. d&apos;acq.</span>
            <InfoTooltip text="Prix moyen auquel vous avez acquis vos unités, pondéré par les montants investis à chaque achat." />
          </div>
          <p className="text-2xl font-bold" style={{ color: results ? "var(--si-text)" : "var(--si-text-muted)" }}>
            {results ? fmtEur(results.prixMoyenAcquisition) : "—"}
          </p>
        </div>
      </div>

      {/* Résumé textuel */}
      {results && params.coinName && (
        <div
          className="rounded-2xl border p-5 text-sm leading-relaxed"
          style={{ background: "var(--si-bg-card)", borderColor: "var(--si-border)", color: "var(--si-text-secondary)" }}
        >
          Votre investissement{params.frequence !== "unique"
            ? ` ${FREQUENCES.find((f) => f.value === params.frequence)?.label.toLowerCase()}`
            : " unique"} de{" "}
          <strong style={{ color: "var(--si-text)" }}>{fmtEur(params.montant)}</strong> en{" "}
          <strong style={{ color: "var(--si-text)" }}>{params.coinName}</strong> depuis le{" "}
          <strong style={{ color: "var(--si-text)" }}>{new Date(params.dateDebut).toLocaleDateString("fr-FR")}</strong>{" "}
          aurait généré un capital de{" "}
          <strong style={{ color: "var(--si-text)" }}>{fmtEur(results.capitalFinal)}</strong>,
          soit une performance de{" "}
          <strong style={{ color: perfPositive ? "var(--si-success)" : "var(--si-danger)" }}>
            {perfPositive ? "+" : ""}{fmtPct(results.performance)} %
          </strong>.
        </div>
      )}
    </div>
  );
}
