"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { type CoinSearchResult } from "@/lib/coingecko";
import { FieldLabel } from "./FieldLabel";

interface CoinSearchProps {
  value: string;
  searchResults: CoinSearchResult[];
  isSearching: boolean;
  onSearch: (query: string) => void;
  onSelect: (id: string, name: string, symbol: string) => void;
}

export function CoinSearch({ value, searchResults, isSearching, onSearch, onSelect }: CoinSearchProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleSearch = (v: string) => {
    setQuery(v);
    setOpen(true);
    onSearch(v);
  };

  const handleSelect = (id: string, name: string, symbol: string) => {
    setQuery(name);
    setOpen(false);
    onSelect(id, name, symbol);
  };

  return (
    <div>
      <FieldLabel label="Actif numérique" tooltip="Choisissez la crypto-monnaie à simuler" />
      <div className="relative" ref={ref}>
        <div className="flex items-center gap-2 border-b py-2" style={{ borderColor: "var(--si-border)" }}>
          <input
            type="text"
            placeholder="Rechercher Bitcoin, Ethereum…"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: "var(--si-text)" }}
          />
          {isSearching
            ? <span className="text-xs" style={{ color: "var(--si-text-muted)" }}>…</span>
            : <Search size={14} style={{ color: "var(--si-text-muted)" }} />
          }
        </div>

        {open && searchResults.length > 0 && (
          <div
            className="absolute z-50 left-0 right-0 mt-1 rounded-xl border overflow-hidden shadow-2xl max-h-64 overflow-y-auto"
            style={{ background: "var(--si-bg-elevated)", borderColor: "var(--si-border)" }}
          >
            {searchResults.map((c) => (
              <button
                key={c.id}
                onMouseDown={() => handleSelect(c.id, c.name, c.symbol)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:opacity-80 transition-opacity"
                style={{ color: "var(--si-text)", borderBottom: "1px solid var(--si-border)" }}
              >
                {c.thumb && (
                  <Image src={c.thumb} alt={c.name} width={20} height={20} className="rounded-full" unoptimized />
                )}
                <span className="font-medium">{c.name}</span>
                <span className="uppercase text-xs ml-auto" style={{ color: "var(--si-text-muted)" }}>{c.symbol}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
