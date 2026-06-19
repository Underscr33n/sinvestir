interface InputFieldProps {
  value: string | number;
  onChange: (v: string) => void;
  unit?: string;
  type?: string;
  min?: number;
}

export function InputField({ value, onChange, unit, type = "number", min }: InputFieldProps) {
  return (
    <div className="flex items-center border-b py-2" style={{ borderColor: "var(--si-border)" }}>
      <input
        type={type}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-base"
        style={{ color: "var(--si-text)" }}
      />
      {unit && (
        <span className="text-sm font-medium ml-2 shrink-0" style={{ color: "var(--si-text-muted)" }}>
          {unit}
        </span>
      )}
    </div>
  );
}
