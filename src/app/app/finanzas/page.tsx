import { createClient } from "@/lib/supabase/server";
import { money, shortDate } from "@/lib/format";
import { addTransaction, markPaid } from "../actions";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default async function FinancePage() {
  const supabase = await createClient();
  const since = new Date();
  since.setMonth(since.getMonth() - 5, 1);
  const sinceStr = since.toISOString().slice(0, 10);
  const [{ data: recent }, { data: receivables }] = await Promise.all([
    supabase.from("transactions").select("*").eq("status", "paid").gte("date", sinceStr).order("date", { ascending: false }),
    supabase.from("transactions").select("*").eq("kind", "income").eq("status", "pending").order("due_date"),
  ]);

  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7);
  const tx = recent ?? [];
  const sum = (rows: typeof tx, kind: string, month?: string) =>
    rows.filter((t) => t.kind === kind && (!month || String(t.date).startsWith(month))).reduce((s, t) => s + Number(t.amount), 0);
  const income = sum(tx, "income", thisMonth);
  const expense = sum(tx, "expense", thisMonth);
  const receivable = (receivables ?? []).reduce((s, t) => s + Number(t.amount), 0);

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { key, label: MONTHS[d.getMonth()], inc: sum(tx, "income", key), exp: sum(tx, "expense", key) };
  });
  const max = Math.max(1, ...months.map((m) => Math.max(m.inc, m.exp)));
  const expenses = tx.filter((t) => t.kind === "expense").slice(0, 6);

  return (
    <>
      <div className="stack" style={{ ["--gap" as string]: "6px" }}>
        <h1 className="serif" style={{ margin: 0, fontSize: "var(--fs-h1)" }}>Finanzas</h1>
        <span className="muted" style={{ textTransform: "capitalize" }}>{now.toLocaleDateString("es-CO", { month: "long", year: "numeric" })}</span>
      </div>

      <div className="grid-auto" style={{ ["--min" as string]: "180px", ["--gap" as string]: "16px" }}>
        <Stat label="Ingresos del mes" value={money(income)} />
        <Stat label="Gastos del mes" value={money(expense)} />
        <Stat label="Ganancia" value={money(income - expense)} accent />
        <Stat label="Por cobrar" value={money(receivable)} />
      </div>

      <section className="card stack" style={{ ["--gap" as string]: "16px" }}>
        <div className="row between">
          <h2 style={{ margin: 0, fontSize: "1.125rem" }}>Últimos 6 meses</h2>
          <div className="row" style={{ fontSize: "0.875rem", ["--gap" as string]: "16px" }}>
            <span className="row" style={{ ["--gap" as string]: "6px" }}><span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: 2, background: "var(--accent)" }} />Ingresos</span>
            <span className="row" style={{ ["--gap" as string]: "6px" }}><span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: 2, background: "var(--wheat)" }} />Gastos</span>
          </div>
        </div>
        <div role="img" aria-label="Ingresos y gastos de los últimos seis meses" style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 16, alignItems: "end", height: 240, borderBottom: "1px solid var(--line-strong)" }}>
          {months.map((m) => (
            <div key={m.key} style={{ display: "flex", gap: 6, alignItems: "flex-end", justifyContent: "center", height: "100%" }}>
              <span title={`${m.label}: ingresos ${money(m.inc)}`} style={{ width: 24, borderRadius: "3px 3px 0 0", background: "var(--accent)", height: `${(m.inc / max) * 200}px` }} />
              <span title={`${m.label}: gastos ${money(m.exp)}`} style={{ width: 24, borderRadius: "3px 3px 0 0", background: "var(--wheat)", height: `${(m.exp / max) * 200}px` }} />
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 16 }}>
          {months.map((m) => <span key={m.key} className="muted" style={{ textAlign: "center", fontSize: "0.8125rem" }}>{m.label}</span>)}
        </div>
      </section>

      <div className="grid-auto" style={{ ["--min" as string]: "320px", alignItems: "start" }}>
        <section className="card stack">
          <h2 style={{ margin: 0, fontSize: "1.125rem" }}>Por cobrar</h2>
          {(receivables ?? []).length === 0 && <p className="empty">Nada pendiente de cobro.</p>}
          {(receivables ?? []).map((t) => (
            <div key={t.id} className="list-row" style={{ alignItems: "center" }}>
              <span className="stack" style={{ ["--gap" as string]: "2px" }}>
                <strong style={{ fontWeight: 500 }}>{t.description}</strong>
                {t.due_date && <span style={{ fontSize: "0.8125rem", color: "var(--ochre)", fontWeight: 600 }}>Vence {shortDate(t.due_date)}</span>}
              </span>
              <span className="row">
                <span style={{ fontWeight: 500 }}>{money(t.amount)}</span>
                <form action={markPaid.bind(null, t.id)}><button className="btn btn-outline" style={{ minHeight: 34, padding: "4px 12px", fontSize: "0.8125rem" }}>Cobrado</button></form>
              </span>
            </div>
          ))}
        </section>

        <section className="card stack">
          <h2 style={{ margin: 0, fontSize: "1.125rem" }}>Últimos gastos</h2>
          {expenses.length === 0 && <p className="empty">Sin gastos registrados.</p>}
          {expenses.map((t) => (
            <div key={t.id} className="list-row"><span>{t.description}</span><span>{money(t.amount)}</span></div>
          ))}
        </section>

        <section className="card stack">
          <h2 style={{ margin: 0, fontSize: "1.125rem" }}>Punto de equilibrio</h2>
          <p className="ink2" style={{ margin: 0, lineHeight: 1.6 }}>Necesitas cubrir [COSTOS FIJOS] al mes, lo que equivale a [N] proyectos de tamaño medio.</p>
          <span className="muted" style={{ fontSize: "0.8125rem" }}>Se completa cuando definas precios y costos fijos.</span>
        </section>
      </div>

      <form action={addTransaction} className="card stack">
        <h2 style={{ margin: 0, fontSize: "1.125rem" }}>Registrar movimiento</h2>
        <div className="grid-auto" style={{ ["--min" as string]: "180px", ["--gap" as string]: "12px" }}>
          <label className="field">Tipo
            <select className="input" name="kind" defaultValue="income"><option value="income">Ingreso</option><option value="expense">Gasto</option></select>
          </label>
          <label className="field">Descripción<input className="input" name="description" required placeholder="Ej.: Anticipo Familia R." /></label>
          <label className="field">Monto<input className="input" name="amount" required inputMode="numeric" /></label>
          <label className="field">Categoría<input className="input" name="category" placeholder="Software, movilidad…" /></label>
          <label className="field">Estado
            <select className="input" name="status" defaultValue="paid"><option value="paid">Pagado / cobrado</option><option value="pending">Pendiente de cobro</option></select>
          </label>
          <label className="field">Vence (si está pendiente)<input className="input" type="date" name="due_date" /></label>
        </div>
        <div><button className="btn btn-primary">Guardar</button></div>
      </form>
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="card stack" style={{ padding: 20, ["--gap" as string]: "6px" }}>
      <span className="muted" style={{ fontSize: "0.875rem" }}>{label}</span>
      <span style={{ fontSize: "1.875rem", fontWeight: 500, color: accent ? "var(--accent)" : undefined }}>{value}</span>
    </div>
  );
}
