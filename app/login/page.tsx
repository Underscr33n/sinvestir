"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DEMO_EMAIL = "lotfi.berrahal@gmail.com";
const DEMO_PASSWORD = "sinvestir2024";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      document.cookie = "si_auth=true; path=/; max-age=86400";
      router.push("/");
    } else {
      setError("Identifiants incorrects. Utilisez les identifiants de démo.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--si-bg)" }}
    >
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <Image
          src="/logo-simulateurs.svg"
          alt="S'investir Simulateurs"
          width={200}
          height={40}
          priority
        />

        <div
          className="w-full rounded-2xl border p-8 flex flex-col gap-6"
          style={{ background: "var(--si-bg-card)", borderColor: "var(--si-border)" }}
        >
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--si-text)" }}>
              Connexion
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--si-text-secondary)" }}>
              Accédez à vos simulateurs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--si-primary)" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={DEMO_EMAIL}
                className="px-3 py-2.5 rounded-lg border text-sm outline-none w-full"
                style={{
                  background: "var(--si-bg-elevated)",
                  borderColor: "var(--si-border-light)",
                  color: "var(--si-text)",
                }}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--si-primary)" }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="px-3 py-2.5 rounded-lg border text-sm outline-none w-full"
                style={{
                  background: "var(--si-bg-elevated)",
                  borderColor: "var(--si-border-light)",
                  color: "var(--si-text)",
                }}
                required
              />
            </div>

            {error && (
              <p className="text-xs rounded-lg px-3 py-2" style={{ background: "#ef444422", color: "var(--si-danger)" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-sm font-semibold transition-opacity disabled:opacity-60 mt-1"
              style={{ background: "var(--si-primary)", color: "#fff" }}
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <div
            className="text-xs rounded-lg px-3 py-2.5 border"
            style={{ borderColor: "var(--si-border)", color: "var(--si-text-muted)", background: "var(--si-bg-elevated)" }}
          >
            <span className="font-medium" style={{ color: "var(--si-text-secondary)" }}>Démo — </span>
            {DEMO_EMAIL} / {DEMO_PASSWORD}
          </div>
        </div>
      </div>
    </div>
  );
}
