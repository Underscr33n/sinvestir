import { InfoTooltip } from "@/components/ui/InfoTooltip";

interface FieldLabelProps {
  label: string;
  tooltip?: string;
}

export function FieldLabel({ label, tooltip }: FieldLabelProps) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <span className="text-xs font-medium" style={{ color: "var(--si-primary)" }}>{label}</span>
      {tooltip && <InfoTooltip text={tooltip} />}
    </div>
  );
}
