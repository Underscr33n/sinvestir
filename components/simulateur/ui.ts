export const FREQUENCES = [
  { value: "unique" as const, label: "Une seule fois" },
  { value: "quotidien" as const, label: "Par jour" },
  { value: "hebdomadaire" as const, label: "Par semaine" },
  { value: "mensuel" as const, label: "Par mois" },
];

export function fmtEur(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n);
}

export function fmtPct(n: number) {
  return new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
