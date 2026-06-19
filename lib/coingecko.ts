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

// Maps CoinGecko coin ID to Binance EUR pair symbol
const BINANCE_EUR_PAIRS: Record<string, string> = {
  bitcoin: "BTCEUR",
  ethereum: "ETHEUR",
  binancecoin: "BNBEUR",
  ripple: "XRPEUR",
  solana: "SOLEUR",
  dogecoin: "DOGEEUR",
  cardano: "ADAEUR",
  chainlink: "LINKEUR",
  polkadot: "DOTEUR",
  uniswap: "UNIEUR",
  litecoin: "LTCEUR",
  stellar: "XLMEUR",
  "bitcoin-cash": "BCHEUR",
  avalanche: "AVAXEUR",
  "avalanche-2": "AVAXEUR",
  cosmos: "ATOMEUR",
};

// Fallback: USDT pair (virtually all coins exist on Binance vs USDT)
function toBinanceSymbol(coinId: string, coinSymbol: string): { symbol: string; currency: "EUR" | "USDT" } {
  const eurPair = BINANCE_EUR_PAIRS[coinId];
  if (eurPair) return { symbol: eurPair, currency: "EUR" };
  return { symbol: `${coinSymbol.toUpperCase()}USDT`, currency: "USDT" };
}

export async function getMarketChart(
  coinId: string,
  from: Date,
  to: Date,
  coinSymbol = ""
): Promise<{ timestamp: number; price: number }[]> {
  const { symbol } = toBinanceSymbol(coinId, coinSymbol || coinId);

  const params = new URLSearchParams({
    symbol,
    startTime: String(from.getTime()),
    endTime: String(to.getTime()),
  });

  const res = await fetch(`/api/binance?${params.toString()}`);
  if (!res.ok) throw new Error(`Binance ${res.status}`);

  const klines: [number, string][] = await res.json();
  return klines.map(([ts, price]) => ({ timestamp: ts, price: parseFloat(price) }));
}
