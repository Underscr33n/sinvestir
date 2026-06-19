"use client";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { ThemeProvider } from "./ThemeContext";

function Inner({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className={`flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "lg:pl-[136px]" : "lg:pl-[300px]"}`}>
      <Header />
      <main className="flex-1 p-6 pt-10">{children}</main>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
    <SidebarProvider>
      <div className="min-h-screen" style={{ background: "var(--si-bg)" }}>
        <Sidebar />
        <Inner>{children}</Inner>
      </div>
    </SidebarProvider>
    </ThemeProvider>
  );
}
