"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/app", label: "Panel" },
  { href: "/app/proyectos", label: "Proyectos" },
  { href: "/app/clientes", label: "Clientes" },
  { href: "/app/finanzas", label: "Finanzas" },
  { href: "/app/tareas", label: "Tareas del negocio" },
];

export default function AppNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="app-aside">
      <Link href="/" className="serif" style={{ fontSize: "1.625rem", color: "var(--bg)", textDecoration: "none" }}>
        [Nombre del estudio]
      </Link>
      <nav aria-label="Espacio de trabajo" style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.9375rem" }}>
        {links.map((l) => {
          const active = l.href === "/app" ? pathname === "/app" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className="nav-link"
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8, fontSize: "0.8125rem", color: "var(--on-dark-2)" }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{email}</span>
        <button type="button" onClick={signOut} className="btn" style={{ background: "transparent", color: "var(--bg)", border: "1px solid var(--muted)", minHeight: 44 }}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
