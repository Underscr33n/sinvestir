interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  sub?: string;
  highlight?: boolean;
  positive?: boolean | null;
}

export function StatCard({ icon, label, value, sub, highlight, positive }: StatCardProps) {
  const valueColor =
    positive === true
      ? "var(--si-success)"
      : positive === false
      ? "var(--si-danger)"
      : "var(--si-text)";

  return (
    <div
      className="flex flex-col gap-2 rounded-xl p-4 border"
      style={{
        background: highlight ? "var(--si-bg-elevated)" : "var(--si-bg-card)",
        borderColor: highlight ? "var(--si-primary)" : "var(--si-border)",
        boxShadow: highlight ? "0 0 0 1px var(--si-primary)22" : undefined,
      }}
    >
      <div className="flex items-center gap-2">
        <span style={{ color: "var(--si-text-muted)" }}>{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--si-text-muted)" }}>
          {label}
        </span>
      </div>
      <div>
        <p
          className="text-xl font-bold leading-tight"
          style={{ color: value !== null ? valueColor : "var(--si-text-muted)" }}
        >
          {value ?? "—"}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: "var(--si-text-muted)" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
