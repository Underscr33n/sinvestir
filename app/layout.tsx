import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Simulateurs S'investir",
  description: "Les simulateurs et comparateurs financiers pour chiffrer vos décisions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="min-h-full" style={{ background: "var(--si-bg)", color: "var(--si-text)" }}>
        {children}
      </body>
    </html>
  );
}
