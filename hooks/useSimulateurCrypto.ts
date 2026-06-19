"use client";

import { useState, useCallback, useRef } from "react";
import { searchCoins, getMarketChart, type CoinSearchResult } from "@/lib/coingecko";

export type Frequence = "unique" | "quotidien" | "hebdomadaire" | "mensuel";

export interface SimulateurParams {
  coinId: string;
  coinSymbol: string;
  coinName: string;
  montant: number;
  frequence: Frequence;
  dateDebut: string;
  dateFin: string;
}

export interface SimulateurResults {
  totalInvesti: number;
  capitalFinal: number;
  performance: number;
  partsAcquises: number;
  prixMoyenAcquisition: number;
  nbPeriodes: number;
}

export interface ChartPoint {
  date: string;
  valeurPortefeuille: number;
  totalInvesti: number;
}

export const POPULAR_COINS: CoinSearchResult[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", thumb: "https://coin-images.coingecko.com/coins/images/1/thumb/bitcoin.png" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", thumb: "https://coin-images.coingecko.com/coins/images/279/thumb/ethereum.png" },
  { id: "tether", symbol: "USDT", name: "Tether", thumb: "https://coin-images.coingecko.com/coins/images/325/thumb/Tether.png" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", thumb: "https://coin-images.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png" },
  { id: "ripple", symbol: "XRP", name: "XRP", thumb: "https://coin-images.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png" },
  { id: "solana", symbol: "SOL", name: "Solana", thumb: "https://coin-images.coingecko.com/coins/images/4128/thumb/solana.png" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", thumb: "https://coin-images.coingecko.com/coins/images/5/thumb/dogecoin.png" },
  { id: "cardano", symbol: "ADA", name: "Cardano", thumb: "https://coin-images.coingecko.com/coins/images/975/thumb/cardano.png" },
  { id: "tron", symbol: "TRX", name: "TRON", thumb: "https://coin-images.coingecko.com/coins/images/1094/thumb/tron-logo.png" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", thumb: "https://coin-images.coingecko.com/coins/images/12559/thumb/Avalanche_Circle_RedWhite_Trans.png" },
  { id: "shiba-inu", symbol: "SHIB", name: "Shiba Inu", thumb: "https://coin-images.coingecko.com/coins/images/11939/thumb/shiba.png" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", thumb: "https://coin-images.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", thumb: "https://coin-images.coingecko.com/coins/images/12171/thumb/polkadot.png" },
  { id: "uniswap", symbol: "UNI", name: "Uniswap", thumb: "https://coin-images.coingecko.com/coins/images/12504/thumb/uni.jpg" },
  { id: "litecoin", symbol: "LTC", name: "Litecoin", thumb: "https://coin-images.coingecko.com/coins/images/2/thumb/litecoin.png" },
  { id: "stellar", symbol: "XLM", name: "Stellar", thumb: "https://coin-images.coingecko.com/coins/images/100/thumb/Stellar_symbol_black_RGB.png" },
  { id: "cosmos", symbol: "ATOM", name: "Cosmos Hub", thumb: "https://coin-images.coingecko.com/coins/images/1481/thumb/cosmos_hub.png" },
  { id: "near", symbol: "NEAR", name: "NEAR Protocol", thumb: "https://coin-images.coingecko.com/coins/images/10365/thumb/near.jpg" },
  { id: "monero", symbol: "XMR", name: "Monero", thumb: "https://coin-images.coingecko.com/coins/images/69/thumb/monero_logo.png" },
  { id: "aave", symbol: "AAVE", name: "Aave", thumb: "https://coin-images.coingecko.com/coins/images/12645/thumb/AAVE.png" },
  { id: "filecoin", symbol: "FIL", name: "Filecoin", thumb: "https://coin-images.coingecko.com/coins/images/12817/thumb/filecoin.png" },
  { id: "algorand", symbol: "ALGO", name: "Algorand", thumb: "https://coin-images.coingecko.com/coins/images/4380/thumb/download.png" },
  { id: "bitcoin-cash", symbol: "BCH", name: "Bitcoin Cash", thumb: "https://coin-images.coingecko.com/coins/images/780/thumb/bitcoin-cash-circle.png" },
  { id: "aptos", symbol: "APT", name: "Aptos", thumb: "https://coin-images.coingecko.com/coins/images/26455/thumb/aptos_round.png" },
  { id: "arbitrum", symbol: "ARB", name: "Arbitrum", thumb: "https://coin-images.coingecko.com/coins/images/16547/thumb/photo_2023-03-29_21.47.00.jpeg" },
  { id: "sui", symbol: "SUI", name: "Sui", thumb: "https://coin-images.coingecko.com/coins/images/26375/thumb/sui_asset.jpeg" },
  { id: "pepe", symbol: "PEPE", name: "Pepe", thumb: "https://coin-images.coingecko.com/coins/images/29850/thumb/pepe-token.jpeg" },
  { id: "injective-protocol", symbol: "INJ", name: "Injective", thumb: "https://coin-images.coingecko.com/coins/images/12882/thumb/Secondary_Symbol.png" },
  { id: "render-token", symbol: "RENDER", name: "Render", thumb: "https://coin-images.coingecko.com/coins/images/11636/thumb/rndr.png" },
  { id: "toncoin", symbol: "TON", name: "Toncoin", thumb: "https://coin-images.coingecko.com/coins/images/17980/thumb/ton_symbol.png" },
];

const DEFAULT_PARAMS: SimulateurParams = {
  coinId: "",
  coinSymbol: "",
  coinName: "",
  montant: 25,
  frequence: "hebdomadaire",
  dateDebut: "2018-01-01",
  dateFin: new Date().toISOString().split("T")[0],
};

function getIntervalDays(frequence: Frequence): number {
  switch (frequence) {
    case "quotidien": return 1;
    case "hebdomadaire": return 7;
    case "mensuel": return 30;
    case "unique": return Infinity;
  }
}

function computeDCA(
  prices: { timestamp: number; price: number }[],
  montant: number,
  frequence: Frequence,
  dateDebut: Date,
  dateFin: Date
): { results: SimulateurResults; chart: ChartPoint[] } {
  if (prices.length === 0) {
    return {
      results: { totalInvesti: 0, capitalFinal: 0, performance: 0, partsAcquises: 0, prixMoyenAcquisition: 0, nbPeriodes: 0 },
      chart: [],
    };
  }

  // Build a daily price map for O(1) lookup
  const priceMap = new Map<string, number>();
  for (const { timestamp, price } of prices) {
    const d = new Date(timestamp).toISOString().split("T")[0];
    priceMap.set(d, price);
  }

  // Get closest price to a given date
  const getPrice = (date: Date): number | null => {
    const key = date.toISOString().split("T")[0];
    if (priceMap.has(key)) return priceMap.get(key)!;
    // Walk back up to 7 days for weekends / missing data
    for (let i = 1; i <= 7; i++) {
      const d = new Date(date);
      d.setDate(d.getDate() - i);
      const k = d.toISOString().split("T")[0];
      if (priceMap.has(k)) return priceMap.get(k)!;
    }
    return null;
  };

  const intervalDays = getIntervalDays(frequence);
  let totalInvesti = 0;
  let partsAcquises = 0;
  let nbPeriodes = 0;
  const chart: ChartPoint[] = [];

  if (frequence === "unique") {
    const price = getPrice(dateDebut);
    if (price !== null) {
      partsAcquises = montant / price;
      totalInvesti = montant;
      nbPeriodes = 1;
    }
  } else {
    const current = new Date(dateDebut);
    while (current <= dateFin) {
      const price = getPrice(current);
      if (price !== null) {
        partsAcquises += montant / price;
        totalInvesti += montant;
        nbPeriodes++;
      }
      current.setDate(current.getDate() + intervalDays);
    }
  }

  // Build chart: for each price point, compute portfolio value at that date
  let runningParts = 0;
  let runningInvesti = 0;
  const investDates: Date[] = [];

  if (frequence === "unique") {
    investDates.push(new Date(dateDebut));
  } else {
    let c = new Date(dateDebut);
    while (c <= dateFin) {
      investDates.push(new Date(c));
      c = new Date(c);
      c.setDate(c.getDate() + intervalDays);
    }
  }

  let investIdx = 0;

  // Sample chart points (max ~200 for perf)
  const step = Math.max(1, Math.floor(prices.length / 200));
  for (let i = 0; i < prices.length; i += step) {
    const { timestamp, price } = prices[i];
    const pointDate = new Date(timestamp);

    // Apply all investments up to this date
    while (investIdx < investDates.length && investDates[investIdx] <= pointDate) {
      const p = getPrice(investDates[investIdx]);
      if (p !== null) {
        runningParts += montant / p;
        runningInvesti += montant;
      }
      investIdx++;
    }

    chart.push({
      date: pointDate.toISOString().split("T")[0],
      valeurPortefeuille: runningParts * price,
      totalInvesti: runningInvesti,
    });
  }

  const lastPrice = prices[prices.length - 1].price;
  const capitalFinal = partsAcquises * lastPrice;
  const performance = totalInvesti > 0 ? ((capitalFinal - totalInvesti) / totalInvesti) * 100 : 0;
  const prixMoyenAcquisition = partsAcquises > 0 ? totalInvesti / partsAcquises : 0;

  return {
    results: { totalInvesti, capitalFinal, performance, partsAcquises, prixMoyenAcquisition, nbPeriodes },
    chart,
  };
}

export function useSimulateurCrypto() {
  const [params, setParamsState] = useState<SimulateurParams>(DEFAULT_PARAMS);
  const [results, setResults] = useState<SimulateurResults | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Coin search
  const [searchResults, setSearchResults] = useState<CoinSearchResult[]>(POPULAR_COINS);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setParams = useCallback((patch: Partial<SimulateurParams>) => {
    setParamsState((prev) => ({ ...prev, ...patch }));
  }, []);

  const searchCoin = useCallback((query: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!query || query.length < 2) {
      setSearchResults(POPULAR_COINS);
      return;
    }
    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await searchCoins(query);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  }, []);

  const simulate = useCallback(async () => {
    if (!params.coinId) {
      setError("Veuillez sélectionner un actif numérique.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const from = new Date(params.dateDebut);
      const to = new Date(params.dateFin);
      const prices = await getMarketChart(params.coinId, from, to, params.coinSymbol);
      const { results, chart } = computeDCA(prices, params.montant, params.frequence, from, to);
      setResults(results);
      setChartData(chart);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la simulation.");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const reset = useCallback(() => {
    setParamsState(DEFAULT_PARAMS);
    setResults(null);
    setChartData([]);
    setError(null);
  }, []);

  return {
    params,
    setParams,
    results,
    chartData,
    isLoading,
    error,
    searchResults,
    isSearching,
    searchCoin,
    simulate,
    reset,
  };
}
