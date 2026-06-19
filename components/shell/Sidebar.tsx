"use client";

import {
  LayoutDashboard,
  LineChart,
  GitCompare,
  BookMarked,
  Gift,
  Settings,
  Lightbulb,
  LogOut,
  ChevronLeft,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import { useTheme } from "./ThemeContext";

const navItems = [
  { href: "/simulateur-crypto", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/simulateur-crypto", label: "Les simulateurs", icon: LineChart },
  { href: "#", label: "Les comparateurs", icon: GitCompare },
  { href: "#", label: "Mes simulations", icon: BookMarked },
  { href: "#", label: "Formation offerte", icon: Gift },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const { theme, toggle } = useTheme();
  const c = collapsed;

  const handleLogout = () => {
    document.cookie = "si_auth=; Max-Age=0; path=/";
    router.push("/login");
  };

  function NavContent({ mobile = false }: { mobile?: boolean }) {
    const expanded = mobile || !c;
    return (
      <div
        className={`flex flex-col py-6 gap-10 ${mobile ? "h-full" : "flex-1 overflow-y-auto rounded-2xl border border-[var(--si-border)]"}`}
        style={{ background: "var(--si-bg-card)" }}
      >
        {/* User info */}
        <div className={`flex items-center gap-3 ${expanded ? "px-6" : "justify-center px-0"}`}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium text-[var(--si-text)] shrink-0 bg-[var(--si-bg-elevated)] border border-[var(--si-border)]">
            LB
          </div>
          {expanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-normal text-[var(--si-text)] truncate">lotfi berrahal</p>
              <p className="text-xs font-light truncate" style={{ color: "var(--si-primary)" }}>
                lotfi.berrahal@gmail.com
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col justify-between">
          <ul className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = href !== "#" && pathname.startsWith(href);
              return (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={() => mobile && setMobileOpen(false)}
                    title={!expanded ? label : undefined}
                    className={[
                      "flex items-center py-3 text-sm font-normal transition-all duration-300 whitespace-nowrap overflow-hidden",
                      expanded ? "gap-3 px-6" : "justify-center px-0",
                      active
                        ? "bg-[var(--si-bg-elevated)] text-[var(--si-text)]"
                        : "text-[var(--si-text-muted)] hover:text-[var(--si-text)] hover:bg-[var(--si-bg-elevated)]",
                      expanded && active
                        ? "border-l-2 border-[var(--si-primary)]"
                        : "border-l-2 border-transparent",
                    ].join(" ")}
                  >
                    <Icon size={20} className="shrink-0" aria-hidden />
                    {expanded && <span className="truncate">{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Bottom actions */}
          <div className="space-y-1 mt-4">
            <button
              onClick={toggle}
              title={!expanded ? (theme === "dark" ? "Mode clair" : "Mode sombre") : undefined}
              className={`w-full flex items-center justify-center py-3 text-sm font-light text-[var(--si-text-secondary)] hover:text-[var(--si-text)] transition-all ${expanded ? "gap-2 px-6" : ""}`}
            >
              {theme === "dark" ? <Sun size={16} className="shrink-0" /> : <Moon size={16} className="shrink-0" />}
              {expanded && <span className="truncate">{theme === "dark" ? "Mode clair" : "Mode sombre"}</span>}
            </button>
            <button
              title={!expanded ? "Gérer mon compte" : undefined}
              className={`w-full flex items-center justify-center py-3 text-sm font-light text-[var(--si-text-secondary)] hover:text-[var(--si-text)] transition-all ${expanded ? "gap-2 px-6" : ""}`}
            >
              <Settings size={16} className="shrink-0" />
              {expanded && <span className="truncate">Gérer mon compte</span>}
            </button>
            <button
              title={!expanded ? "Faire une suggestion" : undefined}
              className={`w-full flex items-center justify-center py-3 text-sm font-light text-[var(--si-text-secondary)] hover:text-[var(--si-text)] transition-all ${expanded ? "gap-2 px-6" : ""}`}
            >
              <Lightbulb size={16} className="shrink-0" />
              {expanded && <span className="truncate">Faire une suggestion</span>}
            </button>
            <div className={`pt-1 flex ${expanded ? "px-6" : "justify-center"}`}>
              <button
                onClick={handleLogout}
                title={!expanded ? "Déconnexion" : undefined}
                className={`flex items-center justify-center gap-2 rounded-full text-sm font-light text-white transition-all duration-300 ${expanded ? "w-full py-3" : "w-12 h-12"}`}
                style={{ background: "linear-gradient(to right, #0049C6, #04265F)" }}
              >
                <LogOut size={18} className="shrink-0" />
                {expanded && <span className="truncate">Déconnexion</span>}
              </button>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <>
      {/* Mobile drawer — s'ouvre sous le header, full-width */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto animate-slide-in"
          style={{ background: "var(--si-bg-card)" }}
        >
          <NavContent mobile />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:flex-col p-6 transition-all duration-300 ${c ? "lg:w-[136px]" : "lg:w-[300px]"}`}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!c)}
          className="absolute top-1/2 -translate-y-1/2 right-0 w-6 h-16 flex items-center justify-center rounded-r-2xl z-10 bg-[var(--si-bg-elevated)] text-[var(--si-text-secondary)] hover:bg-[var(--si-border)] transition-colors"
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-300 ${c ? "rotate-180" : ""}`}
          />
        </button>

        <NavContent />
      </aside>
    </>
  );
}
