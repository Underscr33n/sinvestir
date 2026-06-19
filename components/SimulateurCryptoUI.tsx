"use client";

import { useSimulateurCrypto } from "@/hooks/useSimulateurCrypto";
import { SimulateurHeader } from "./simulateur/SimulateurHeader";
import { SimulateurForm } from "./simulateur/SimulateurForm";
import { SimulateurResultats } from "./simulateur/SimulateurResultats";
import { SimulateurChart } from "./simulateur/SimulateurChart";
import { SimulateurActions } from "./simulateur/SimulateurActions";

interface Props {
  className?: string;
}

export function SimulateurCryptoUI({ className = "" }: Props) {
  const {
    params, setParams, results, chartData,
    isLoading, error, searchResults, isSearching,
    searchCoin, simulate, reset,
  } = useSimulateurCrypto();

  return (
    <div className={`flex flex-col ${className}`}>
      <SimulateurHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SimulateurForm
          params={params}
          setParams={setParams}
          searchResults={searchResults}
          isSearching={isSearching}
          searchCoin={searchCoin}
          error={error}
        />
        <SimulateurResultats
          params={params}
          results={results}
          isLoading={isLoading}
          onSimulate={simulate}
        />
      </div>

      <SimulateurChart data={chartData} />
      <SimulateurActions onReset={reset} />
    </div>
  );
}
