"use client";

import { X } from "lucide-react";
import { Logo } from "./Logo";
import { useSidebar } from "./SidebarContext";
import { IconMenu } from "@/components/ui/icons";

export function Header() {
  const { mobileOpen, setMobileOpen } = useSidebar();

  return (
    <header
      className="sticky top-0 z-40 flex h-16 shrink-0 items-center px-4 lg:px-8 border-b border-[var(--si-border)] lg:border-transparent"
    >
      <Logo height={28} />

      <div className="flex-1" />

      <a
        href="https://sinvestir.fr"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm hidden lg:block"
        style={{ color: "var(--si-text-secondary)" }}
      >
        Découvrir S&apos;investir
      </a>

      {/* Hamburger / Close — mobile only, toujours à droite */}
      <button
        className="lg:hidden flex items-center justify-center ml-3"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {mobileOpen
          ? <X size={22} style={{ color: "var(--si-text)" }} />
          : <IconMenu style={{ color: "var(--si-text)" }} />
        }
      </button>
    </header>
  );
}
