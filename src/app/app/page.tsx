import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { STAGES, money, shortDate } from "@/lib/format";
import { addDecision, convertRequest } from "./actions";

export default async function PanelPage() {
  const supabase = await createClient();
  const [projects, requests, tasks, pending, decisions] = await Promise.all([
    supabase.from("projects").select("id, name, stage, clients(name)").lt("stage", 8).order("created_at", { ascending: false }).limit(5),
    supabase.from("contact_requests").select("*").eq("handled", false).order("created_at", { ascending: false }).limit(5),
    supabase.from("business_tasks").select("id, title, area, owner_name").eq("status", "doing").order("created_at").limit(6),
    supabase.from("transactions").select("amount").eq("kind", "income").eq("status", "pending"),
    supabase.from("decisions").select("*").order("created_at", { ascending: false }).limit(6),
  ]);

  const receivable = (pending.data ?? []).reduce((s, t) => s + Number(t.amount), 0);
  const today = new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });

  return (
    <>
      <div className="row between" style={{ alignItems: "flex-end" }}>
        <div className="stack" style={{ ["--gap" as string]: "6px" }}>
          <span className="muted" style={{ fontSize: "0.875rem", textTransform: "capitalize" }}>{today}</span>
          <h1 className="serif" style={{ margin: 0, fontSize: "var(--fs-h1)" }}>Hola de nuevo</h1>
        </div>
        <div className="row">
          <Link href="/app/tareas" className="btn btn-outline">+ Tarea</Link>
          <Link href="/app/proyectos" className="btn btn-primary">+ Nuevo proyecto</Link>
        </div>
      </div>

      <div className="grid-auto" style={{ ["--min" as string]: "180px", ["--gap" as string]: "16px" }}>
        <Stat label="Proyectos activos" value={String(projects.data?.length ?? 0)} />
        <Stat label="Contactos nuevos" value={String(requests.data?.length ?? 0)} />
        <Stat label="Por cobrar" value={money(receivable)} />
        <Stat label="Tareas en curso" value={String(tasks.data?.length ?? 0)} />
      </div>

      <div className="grid-auto" style={{ ["--min" as string]: "340px", alignItems: "start" }}>
        <section className="card stack">
          <div className="row between"><h2 style={{ margin: 0, fontSize: "1.125rem" }}>En curso</h2><Link href="/app/tareas" style={{ fontSize: "0.875rem" }}>Ver tablero</Link></div>
          {(tasks.data ?? []).length === 0 && <p className="empty">Nada en curso. Mueve tareas desde el tablero.</p>}
          {(tasks.data ?? []).map((t) => (
            <div key={t.id} className="list-row">
              <span>{t.title}</span>
              <span className="muted" style={{ fontSize: "0.8125rem" }}>{t.owner_name || t.area}</span>
            </div>
          ))}
        </section>

        <section className="card stack">
          <div className="row between"><h2 style={{ margin: 0, fontSize: "1.125rem" }}>Proyectos en curso</h2><Link href="/app/proyectos" style={{ fontSize: "0.875rem" }}>Ver todos</Link></div>
          {(projects.data ?? []).length === 0 && <p className="empty">Aún no hay proyectos.</p>}
          {(projects.data ?? []).map((p) => {
            const client = (p.clients as unknown as { name: string } | null)?.name;
            return (
              <Link key={p.id} href={`/app/proyectos/${p.id}`} className="stack" style={{ textDecoration: "none", ["--gap" as string]: "8px", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <span className="row between">
                  <strong style={{ fontWeight: 500 }}>{p.name}{client ? ` · ${client}` : ""}</strong>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--accent)" }}>{STAGES[p.stage]}</span>
                </span>
                <span style={{ height: 6, background: "var(--line)", borderRadius: 3, display: "block" }}>
                  <span style={{ display: "block", width: `${Math.round(((p.stage + 1) / STAGES.length) * 100)}%`, height: 6, background: "var(--accent)", borderRadius: 3 }} />
                </span>
              </Link>
            );
          })}
        </section>

        <section className="card stack">
          <div className="row between"><h2 style={{ margin: 0, fontSize: "1.125rem" }}>Contactos nuevos (web)</h2><Link href="/app/clientes" style={{ fontSize: "0.875rem" }}>Ver clientes</Link></div>
          {(requests.data ?? []).length === 0 && <p className="empty">Sin solicitudes nuevas.</p>}
          {(requests.data ?? []).map((r) => (
            <div key={r.id} className="stack" style={{ ["--gap" as string]: "6px", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
              <strong style={{ fontWeight: 500 }}>{r.name} · {r.space_type}</strong>
              <span className="muted" style={{ fontSize: "0.875rem" }}>{r.contact} · {shortDate(r.created_at)}</span>
              {r.message && <span className="ink2" style={{ fontSize: "0.875rem" }}>“{r.message}”</span>}
              <form action={convertRequest.bind(null, r.id)}>
                <button className="btn btn-outline" style={{ minHeight: 36, padding: "6px 14px", fontSize: "0.875rem" }}>Pasar a clientes</button>
              </form>
            </div>
          ))}
        </section>

        <section id="decisiones" className="card stack">
          <h2 style={{ margin: 0, fontSize: "1.125rem" }}>Negocio y decisiones</h2>
          {(decisions.data ?? []).map((d) => (
            <div key={d.id} className="stack" style={{ ["--gap" as string]: "4px", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: d.kind === "question" ? 600 : 400, color: d.kind === "question" ? "var(--ochre)" : "var(--muted)" }}>
                {d.kind === "question" ? "Pregunta abierta" : `Decidido · ${shortDate(d.created_at)}`}
              </span>
              <span>{d.text}</span>
            </div>
          ))}
          <form action={addDecision} className="row" style={{ alignItems: "flex-end" }}>
            <label className="field" style={{ flex: "3 1 200px" }}>
              <span className="sr-only">Texto</span>
              <input className="input" name="text" placeholder="Nueva decisión o pregunta" required />
            </label>
            <label className="field" style={{ flex: "1 1 120px" }}>
              <span className="sr-only">Tipo</span>
              <select className="input" name="kind" defaultValue="decision">
                <option value="decision">Decisión</option>
                <option value="question">Pregunta</option>
              </select>
            </label>
            <button className="btn btn-outline">Registrar</button>
          </form>
        </section>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card stack" style={{ padding: 20, ["--gap" as string]: "6px" }}>
      <span className="muted" style={{ fontSize: "0.875rem" }}>{label}</span>
      <span style={{ fontSize: "2rem", fontWeight: 500 }}>{value}</span>
    </div>
  );
}
