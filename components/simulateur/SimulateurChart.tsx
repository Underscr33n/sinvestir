"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { type ChartPoint } from "@/hooks/useSimulateurCrypto";
import { fmtEur } from "./ui";
import { IconActivity, IconBarChart } from "@/components/ui/icons";

interface SimulateurChartProps {
  data: ChartPoint[];
}

function ChartTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold"
      style={{ background: "var(--si-primary)", color: "#fff" }}
    >
      {children}
    </div>
  );
}

const TOOLTIP_STYLE = {
  background: "var(--si-bg-card)",
  border: "1px solid var(--si-border)",
  borderRadius: "8px",
  color: "var(--si-text)",
  fontSize: "12px",
};

export function SimulateurChart({ data }: SimulateurChartProps) {
  if (!data.length) return null;

  const gainsData = data.map((d) => ({
    date: d.date,
    gainsPerts: d.valeurPortefeuille - d.totalInvesti,
    totalInvesti: d.totalInvesti,
    prix: d.valeurPortefeuille,
  }));

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* Graphique 1 — Évolution du portefeuille */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--si-border)" }}>
        <ChartTitle>
          <IconActivity />
          Historique
        </ChartTitle>
        <div style={{ background: "var(--si-bg-card)" }} className="p-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="gradPortefeuille" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b6ef8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b6ef8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradInvesti" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f0b429" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f0b429" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--si-border)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--si-text-muted)", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "var(--si-border)" }}
                tickFormatter={(v) => v.slice(0, 4)}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "var(--si-text-muted)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`}
                width={48}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value, name) => [
                  fmtEur(Number(value)),
                  name === "valeurPortefeuille" ? "Valeur portefeuille" : "Total investi",
                ]}
                labelStyle={{ color: "var(--si-text-secondary)", marginBottom: "4px" }}
              />
              <Legend
                formatter={(v) => v === "valeurPortefeuille" ? "Valeur portefeuille" : "Total investi"}
                wrapperStyle={{ fontSize: "12px", color: "var(--si-text-secondary)" }}
              />
              <Area type="monotone" dataKey="totalInvesti" stroke="#f0b429" strokeWidth={1.5} fill="url(#gradInvesti)" dot={false} />
              <Area type="monotone" dataKey="valeurPortefeuille" stroke="#3b6ef8" strokeWidth={2} fill="url(#gradPortefeuille)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique 2 — Gains / Pertes */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--si-border)" }}>
        <ChartTitle>
          <IconBarChart />
          Gains / Pertes
        </ChartTitle>
        <div style={{ background: "var(--si-bg-card)" }} className="p-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={gainsData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="gradGains" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPertes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--si-border)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--si-text-muted)", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "var(--si-border)" }}
                tickFormatter={(v) => v.slice(0, 4)}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "var(--si-text-muted)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`}
                width={48}
              />
              <ReferenceLine y={0} stroke="var(--si-border-light)" strokeWidth={1.5} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value, name) => {
                  const v = Number(value);
                  if (name === "gainsPerts") return [fmtEur(v), v >= 0 ? "Gains" : "Pertes"];
                  if (name === "totalInvesti") return [fmtEur(v), "Total investi"];
                  if (name === "prix") return [fmtEur(v), "Valeur portefeuille"];
                  return [fmtEur(v), String(name)];
                }}
                labelStyle={{ color: "var(--si-text-secondary)", marginBottom: "4px" }}
              />
              <Legend
                formatter={(v) => {
                  if (v === "gainsPerts") return "Gains / Pertes";
                  if (v === "totalInvesti") return "Total investi";
                  return "Prix";
                }}
                wrapperStyle={{ fontSize: "12px", color: "var(--si-text-secondary)" }}
              />
              <Area
                type="monotone"
                dataKey="gainsPerts"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#gradGains)"
                dot={false}
              />
              <Area type="monotone" dataKey="totalInvesti" stroke="#f0b429" strokeWidth={1} strokeDasharray="4 3" fill="none" dot={false} />
              <Area type="monotone" dataKey="prix" stroke="#3b6ef8" strokeWidth={1} strokeDasharray="4 3" fill="none" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
