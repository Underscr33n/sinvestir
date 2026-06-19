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

// CoinGecko Demo plan blocks days=max and large /range windows.
// Workaround: split the date range into ≤365-day chunks and concatenate results.
// Each /market_chart/range call with a ≤365-day window returns daily granularity.
const CHUNK_MS = 365 * 24 * 3600 * 1000;

export async function getMarketChart(
  coinId: string,
  from: Date,
  to: Date,
  _coinSymbol = ""
): Promise<{ timestamp: number; price: number }[]> {
  const allPrices: { timestamp: number; price: number }[] = [];
  let cursor = from.getTime();
  const end = to.getTime();

  while (cursor < end) {
    const chunkEnd = Math.min(cursor + CHUNK_MS, end);
    const data = await cgFetch(`/coins/${coinId}/market_chart/range`, {
      vs_currency: "eur",
      from: String(Math.floor(cursor / 1000)),
      to: String(Math.floor(chunkEnd / 1000)),
    }) as { prices?: [number, number][] };

    if (data.prices?.length) {
      allPrices.push(...data.prices.map(([ts, price]) => ({ timestamp: ts, price })));
    }

    cursor = chunkEnd + 1;
  }

  if (!allPrices.length) throw new Error("Aucune donnée disponible pour cet actif sur cette période.");
  return allPrices;
}
