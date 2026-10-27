import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CLIENT_STAGES, money } from "@/lib/format";
import { addClient } from "../actions";
import StageSelect from "@/components/StageSelect";

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ etapa?: string }> }) {
  const { etapa } = await searchParams;
  const filter = etapa && CLIENT_STAGES[etapa] ? etapa : "all";
  const supabase = await createClient();
  const { data: all } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
  const clients = (all ?? []).filter((c) => filter === "all" || c.stage === filter);
  const tabs = [["all", "Todos"], ...Object.entries(CLIENT_STAGES)];

  return (
    <>
      <div className="stack" style={{ ["--gap" as string]: "6px" }}>
        <h1 className="serif" style={{ margin: 0, fontSize: "var(--fs-h1)" }}>Clientes</h1>
        <span className="muted">Desde el primer contacto hasta el seguimiento.</span>
      </div>

      <nav aria-label="Filtrar por etapa" className="row" style={{ ["--gap" as string]: "8px" }}>
        {tabs.map(([key, label]) => {
          const on = key === filter;
          const count = key === "all" ? (all ?? []).length : (all ?? []).filter((c) => c.stage === key).length;
          return (
            <Link
              key={key}
              href={key === "all" ? "/app/clientes" : `/app/clientes?etapa=${key}`}
              aria-current={on ? "page" : undefined}
              className="btn"
              style={{ fontSize: "0.875rem", fontWeight: 400, ...(on ? { background: "var(--ink)", color: "#fff" } : { background: "#fff", border: "1px solid var(--line-strong)" }) }}
            >
              {label} · {count}
            </Link>
          );
        })}
      </nav>

      <section className="card" style={{ padding: "8px 24px 16px" }}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Cliente</th>
                <th scope="col">Espacio</th>
                <th scope="col">Etapa</th>
                <th scope="col">Origen</th>
                <th scope="col">Próximo paso</th>
                <th scope="col" style={{ textAlign: "right" }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 && (
                <tr><td colSpan={6} className="empty">No hay clientes en esta etapa.</td></tr>
              )}
              {clients.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.name}{c.contact && <div className="muted" style={{ fontSize: "0.8125rem", fontWeight: 400 }}>{c.contact}</div>}</td>
                  <td>{c.space}</td>
                  <td><StageSelect id={c.id} stage={c.stage} /></td>
                  <td className="muted">{c.source}</td>
                  <td>{c.next_step}</td>
                  <td style={{ textAlign: "right" }}>{c.value != null ? money(c.value) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <form action={addClient} className="card stack">
        <h2 style={{ margin: 0, fontSize: "1.125rem" }}>Nuevo cliente</h2>
        <div className="grid-auto" style={{ ["--min" as string]: "200px", ["--gap" as string]: "12px" }}>
          <label className="field">Nombre<input className="input" name="name" required /></label>
          <label className="field">Contacto<input className="input" name="contact" placeholder="Correo o WhatsApp" /></label>
          <label className="field">Espacio<input className="input" name="space" placeholder="Ej.: Vivienda · sala y comedor" /></label>
          <label className="field">Etapa
            <select className="input" name="stage" defaultValue="new">
              {Object.entries(CLIENT_STAGES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="field">Origen<input className="input" name="source" placeholder="Web, Instagram, recomendación…" /></label>
          <label className="field">Próximo paso<input className="input" name="next_step" /></label>
          <label className="field">Valor estimado<input className="input" name="value" inputMode="numeric" /></label>
        </div>
        <div><button className="btn btn-primary">+ Agregar cliente</button></div>
      </form>
    </>
  );
}
