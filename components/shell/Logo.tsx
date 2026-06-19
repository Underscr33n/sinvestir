"use client";

import Image from "next/image";

// viewBox 0 0 301 60 → ratio 301/60 ≈ 5.017
export function Logo({ height = 32 }: { height?: number }) {
  const width = Math.round(height * (301 / 60));
  return (
    <Image
      src="/logo-simulateurs.svg"
      alt="S'investir Simulateurs"
      width={width}
      height={height}
      priority
      style={{ display: "block" }}
    />
  );
}
