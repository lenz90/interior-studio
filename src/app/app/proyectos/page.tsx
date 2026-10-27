import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { STAGES, SERVICES, money } from "@/lib/format";
import { addProject } from "../actions";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const [{ data: projects }, { data: clients }] = await Promise.all([
    supabase.from("projects").select("id, name, stage, service, budget, spent, clients(name)").order("created_at", { ascending: false }),
    supabase.from("clients").select("id, name").order("name"),
  ]);

  return (
    <>
      <div className="stack" style={{ ["--gap" as string]: "6px" }}>
        <h1 className="serif" style={{ margin: 0, fontSize: 44 }}>Proyectos</h1>
        <span className="muted">Cada proyecto avanza por 9 etapas, de Contacto a Seguimiento.</span>
      </div>

      <form action={addProject} className="card row" style={{ alignItems: "flex-end", padding: 16 }}>
        <label className="field" style={{ flex: "3 1 220px" }}>Nombre del proyecto<input className="input" name="name" required placeholder="Ej.: Depto. Centro" /></label>
        <label className="field" style={{ flex: "2 1 180px" }}>Cliente
          <select className="input" name="client_id" defaultValue="">
            <option value="">Sin cliente</option>
            {(clients ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="field" style={{ flex: "2 1 180px" }}>Servicio
          <select className="input" name="service" defaultValue="design">
            {Object.entries(SERVICES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="field" style={{ flex: "1 1 140px" }}>Presupuesto<input className="input" name="budget" inputMode="numeric" placeholder="0" /></label>
        <button className="btn btn-primary">+ Crear proyecto</button>
      </form>

      <div className="grid-auto" style={{ ["--min" as string]: "300px" }}>
        {(projects ?? []).length === 0 && <p className="empty">Todavía no hay proyectos. Crea el primero arriba.</p>}
        {(projects ?? []).map((p) => {
          const client = (p.clients as unknown as { name: string } | null)?.name;
          return (
            <Link key={p.id} href={`/app/proyectos/${p.id}`} className="card stack" style={{ textDecoration: "none" }}>
              <span className="row between">
                <strong style={{ fontWeight: 500, fontSize: 18 }}>{p.name}</strong>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>{STAGES[p.stage]}</span>
              </span>
              <span className="muted" style={{ fontSize: 14 }}>{client ?? "Sin cliente"} · {SERVICES[p.service]}</span>
              <span style={{ height: 6, background: "var(--line)", borderRadius: 3, display: "block" }}>
                <span style={{ display: "block", width: `${Math.round(((p.stage + 1) / STAGES.length) * 100)}%`, height: 6, background: "var(--accent)", borderRadius: 3 }} />
              </span>
              <span className="muted" style={{ fontSize: 13 }}>Presupuesto {money(p.budget)} · Comprado {money(p.spent)}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
