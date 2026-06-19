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
  _coinSymbol = ""
): Promise<{ timestamp: number; price: number }[]> {
  const qs = new URLSearchParams({
    path: `/coins/${coinId}/market_chart/range`,
    vs_currency: "eur",
    from: String(Math.floor(from.getTime() / 1000)),
    to: String(Math.floor(to.getTime() / 1000)),
  });

  const res = await fetch(`/api/coingecko?${qs.toString()}`);
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);

  const data = await res.json() as { prices?: [number, number][] };
  if (!data.prices?.length) throw new Error("Aucune donnée disponible pour cet actif sur cette période.");

  return data.prices.map(([ts, price]) => ({ timestamp: ts, price }));
}
