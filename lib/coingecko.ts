export interface CoinSearchResult {
  id: string;
  symbol: string;
  name: string;
  thumb: string;
}

async function cgFetch(path: string, params: Record<string, string> = {}): Promise<unknown> {
  const qs = new URLSearchParams({ path, ...params });
  const res = await fetch(`/api/coingecko?${qs.toString()}`);
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  return res.json();
}

export async function searchCoins(query: string): Promise<CoinSearchResult[]> {
  if (!query || query.length < 2) return [];
  const data = await cgFetch("/search", { query }) as { coins?: { id: string; symbol: string; name: string; thumb: string }[] };
  return (data.coins ?? []).slice(0, 20).map((c) => ({
    id: c.id,
    symbol: c.symbol,
    name: c.name,
    thumb: c.thumb,
  }));
}


export async function getMarketChart(
  coinId: string,
  from: Date,
  to: Date,
  coinSymbol = ""
): Promise<{ timestamp: number; price: number }[]> {
  const qs = new URLSearchParams({
    coinId,
    symbol: coinSymbol || coinId,
    startTime: String(from.getTime()),
    endTime: String(to.getTime()),
  });

  const res = await fetch(`/api/binance?${qs.toString()}`);
  if (!res.ok) throw new Error(`Données indisponibles pour cet actif (${res.status})`);

  const prices: [number, number][] = await res.json();
  if (!prices.length) throw new Error("Aucune donnée disponible pour cet actif sur cette période.");
  return prices.map(([ts, price]) => ({ timestamp: ts, price }));
}
