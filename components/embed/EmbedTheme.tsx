"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Correspondance param URL → variable CSS
const CSS_VAR_MAP: Record<string, string> = {
  bg:            "--si-bg",
  bgCard:        "--si-bg-card",
  bgElevated:    "--si-bg-elevated",
  border:        "--si-border",
  borderLight:   "--si-border-light",
  primary:       "--si-primary",
  text:          "--si-text",
  textSecondary: "--si-text-secondary",
  textMuted:     "--si-text-muted",
  success:       "--si-success",
  danger:        "--si-danger",
};

export function EmbedTheme() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(CSS_VAR_MAP).forEach(([param, cssVar]) => {
      const value = searchParams.get(param);
      if (value) {
        // Accepte les couleurs avec ou sans # (# est encodé en %23 dans les URLs)
        root.style.setProperty(cssVar, value.startsWith("#") ? value : `#${value}`);
      }
    });
  }, [searchParams]);

  return null;
}
