"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    setBusy(true);
    setMsg(null);
    const supabase = createClient();
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg("Correo o contraseña incorrectos.");
      router.push("/app");
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setBusy(false);
      if (error) return setMsg(error.message);
      if (data.session) {
        router.push("/app");
        router.refresh();
      } else {
        setMsg("Revisa tu correo y confirma la cuenta para entrar.");
      }
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <div className="card stack" style={{ width: "100%", maxWidth: 400, padding: 32, ["--gap" as string]: "20px" }}>
        <Link href="/" className="serif" style={{ fontSize: "1.625rem", textDecoration: "none" }}>[Nombre del estudio]</Link>
        <h1 style={{ margin: 0, fontSize: "1.375rem", fontWeight: 500 }}>
          {mode === "signin" ? "Entrar a tu espacio de trabajo" : "Crear la cuenta del estudio"}
        </h1>
        <form onSubmit={onSubmit} className="stack" style={{ ["--gap" as string]: "14px" }}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} />
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? "Un momento…" : mode === "signin" ? "Entrar" : "Crear cuenta"}
          </Button>
        </form>
        {msg && <p role="status" className="ink2" style={{ margin: 0, fontSize: "0.875rem" }}>{msg}</p>}
        <button
          type="button"
          className="btn"
          style={{ background: "transparent", color: "var(--accent)", padding: 0, minHeight: 32 }}
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMsg(null); }}
        >
          {mode === "signin" ? "¿Primera vez? Crear cuenta" : "Ya tengo cuenta"}
        </button>
        <p className="muted" style={{ margin: 0, fontSize: "0.8125rem" }}>
          La primera cuenta creada queda como dueña del estudio.
        </p>
      </div>
    </main>
  );
}
