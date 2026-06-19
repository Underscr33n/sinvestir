"use client";

import { Info } from "lucide-react";

interface InfoTooltipProps {
  text: string;
  size?: number;
}

export function InfoTooltip({ text, size = 12 }: InfoTooltipProps) {
  return (
    <span className="si-tooltip-wrap" aria-label={text}>
      <Info size={size} className="si-tooltip-icon" />
      <span className="si-tooltip-bubble" role="tooltip">{text}</span>
    </span>
  );
}
