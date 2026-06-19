import { NextRequest, NextResponse } from "next/server";

const BASE = "https://api.coingecko.com/api/v3";
export async function GET(request: NextRequest) {
  const apiKey = process.env.COINGECKO_API_KEY ?? "";
  const { searchParams } = request.nextUrl;
  const path = searchParams.get("path");
  if (!path) return NextResponse.json({ error: "missing path" }, { status: 400 });

  const params = new URLSearchParams(searchParams);
  params.delete("path");
  if (apiKey) params.set("x_cg_demo_api_key", apiKey);

  try {
    const url = `${BASE}${path}?${params.toString()}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return NextResponse.json({ error: `CoinGecko ${res.status}` }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
