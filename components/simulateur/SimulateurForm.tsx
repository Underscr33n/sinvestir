"use client";

import { type SimulateurParams, type Frequence } from "@/hooks/useSimulateurCrypto";
import { type CoinSearchResult } from "@/lib/coingecko";
import { DatePicker } from "@/components/ui/DatePicker";
import { CoinSearch } from "./CoinSearch";
import { FieldLabel } from "./FieldLabel";
import { InputField } from "./InputField";
import { FREQUENCES } from "./ui";

interface SimulateurFormProps {
  params: SimulateurParams;
  setParams: (patch: Partial<SimulateurParams>) => void;
  searchResults: CoinSearchResult[];
  isSearching: boolean;
  searchCoin: (query: string) => void;
  error: string | null;
}

export function SimulateurForm({ params, setParams, searchResults, isSearching, searchCoin, error }: SimulateurFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <CoinSearch
        value={params.coinName}
        searchResults={searchResults}
        isSearching={isSearching}
        onSearch={searchCoin}
        onSelect={(id, name, symbol) => setParams({ coinId: id, coinName: name, coinSymbol: symbol })}
      />

      <div>
        <FieldLabel label="Montant investi" tooltip="Montant investi à chaque période. Pour un investissement unique, c'est la somme totale placée." />
        <InputField
          value={params.montant}
          onChange={(v) => setParams({ montant: Number(v) })}
          unit="EUR"
          min={1}
        />
      </div>

      <div>
        <FieldLabel label="Fréquence d'investissement" tooltip="Cadence à laquelle le montant est investi automatiquement. Une fréquence régulière permet de lisser le prix d'achat dans le temps." />
        <div className="border-b py-2" style={{ borderColor: "var(--si-border)" }}>
          <select
            value={params.frequence}
            onChange={(e) => setParams({ frequence: e.target.value as Frequence })}
            className="w-full bg-transparent outline-none text-base"
            style={{ color: "var(--si-text)", colorScheme: "dark" }}
          >
            {FREQUENCES.map((f) => (
              <option key={f.value} value={f.value} style={{ background: "var(--si-bg-card)" }}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <FieldLabel label="Date de début" tooltip="Date du premier investissement. Les données disponibles remontent à 2017 pour la plupart des actifs." />
        <DatePicker
          value={params.dateDebut}
          onChange={(v) => setParams({ dateDebut: v })}
          maxDate={params.dateFin || undefined}
        />
      </div>

      <div>
        <FieldLabel label="Date de fin" tooltip="Date du dernier investissement pris en compte. Par défaut : aujourd'hui." />
        <DatePicker
          value={params.dateFin}
          onChange={(v) => setParams({ dateFin: v })}
          minDate={params.dateDebut || undefined}
        />
      </div>

      {error && (
        <p className="text-sm rounded-lg px-3 py-2" style={{ background: "#ef444422", color: "var(--si-danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
