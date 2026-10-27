"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type BusinessTask = {
  id: string;
  title: string;
  area: string;
  owner_name: string | null;
  status: "todo" | "doing" | "waiting" | "done";
  high_priority: boolean;
  note: string | null;
};

const COLUMNS: { key: BusinessTask["status"]; label: string }[] = [
  { key: "todo", label: "Por hacer" },
  { key: "doing", label: "En curso" },
  { key: "waiting", label: "Esperando" },
  { key: "done", label: "Hecho" },
];
const AREAS = ["Marca", "Ventas", "Finanzas", "Contenido", "Web", "Estrategia"];

export default function Kanban({ initial }: { initial: BusinessTask[] }) {
  const supabase = useMemo(() => createClient(), []);
  const [tasks, setTasks] = useState<BusinessTask[]>(initial);
  const [filter, setFilter] = useState("Todas");
  const [draft, setDraft] = useState("");
  const [draftArea, setDraftArea] = useState(AREAS[0]);
  const [draftOwner, setDraftOwner] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function patch(id: string, changes: Partial<BusinessTask>) {
    const before = tasks;
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...changes } : t)));
    const { error } = await supabase.from("business_tasks").update(changes).eq("id", id);
    if (error) {
      setTasks(before);
      setError("No se pudo guardar el cambio.");
    }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    const { data, error } = await supabase
      .from("business_tasks")
      .insert({ title, area: draftArea, owner_name: draftOwner.trim() || null })
      .select("id, title, area, owner_name, status, high_priority, note")
      .single();
    if (error || !data) return setError("No se pudo crear la tarea.");
    setTasks((ts) => [...ts, data as BusinessTask]);
    setDraft("");
    setDraftOwner("");
  }

  async function remove(id: string) {
    const before = tasks;
    setTasks((ts) => ts.filter((t) => t.id !== id));
    const { error } = await supabase.from("business_tasks").delete().eq("id", id);
    if (error) {
      setTasks(before);
      setError("No se pudo eliminar la tarea.");
    }
  }

  const visible = tasks.filter((t) => filter === "Todas" || t.area === filter);

  return (
    <>
      <form onSubmit={add} aria-label="Nueva tarea" className="card row" style={{ padding: 16, alignItems: "flex-end" }}>
        <label className="field" style={{ flex: "3 1 260px" }}>
          Nueva tarea
          <input className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ej.: Definir el nombre del estudio" />
        </label>
        <label className="field" style={{ flex: "1 1 180px" }}>
          Responsable (opcional)
          <input className="input" value={draftOwner} onChange={(e) => setDraftOwner(e.target.value)} placeholder="Nombre o déjalo vacío" />
        </label>
        <label className="field" style={{ flex: "1 1 150px" }}>
          Área
          <select className="input" value={draftArea} onChange={(e) => setDraftArea(e.target.value)}>
            {AREAS.map((a) => <option key={a}>{a}</option>)}
          </select>
        </label>
        <button className="btn btn-primary" type="submit">+ Agregar</button>
      </form>

      {error && <p role="alert" style={{ margin: 0, color: "var(--accent-hover)" }}>{error}</p>}

      <div role="group" aria-label="Filtrar por área" className="row" style={{ ["--gap" as string]: "8px" }}>
        {["Todas", ...AREAS].map((a) => {
          const on = a === filter;
          return (
            <button
              key={a}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(a)}
              className="btn"
              style={{ fontSize: 14, fontWeight: 400, minHeight: 40, padding: "8px 14px", ...(on ? { background: "var(--ink)", color: "#fff" } : { background: "#fff", border: "1px solid var(--line-strong)" }) }}
            >
              {a}
            </button>
          );
        })}
      </div>

      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(220px, 1fr))", gap: 16, minWidth: 920, alignItems: "start" }}>
          {COLUMNS.map((col, ci) => {
            const cards = visible.filter((t) => t.status === col.key);
            return (
              <section key={col.key} aria-label={col.label} style={{ background: "var(--linen)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10, minHeight: 420 }}>
                <div className="row between" style={{ padding: "2px 4px 6px" }}>
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{col.label}</h2>
                  <span className="ink2" style={{ fontSize: 13, background: "var(--bg)", borderRadius: 999, padding: "2px 10px" }}>{cards.length}</span>
                </div>
                {cards.map((t) => (
                  <article key={t.id} style={{ background: "#fff", borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="row" style={{ ["--gap" as string]: "6px" }}>
                      <span className="badge badge-done">{t.area}</span>
                      {t.high_priority && col.key !== "done" && <span className="badge badge-new">Prioridad alta</span>}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.4, ...(col.key === "done" ? { color: "var(--muted)", textDecoration: "line-through" } : {}) }}>{t.title}</span>
                    {t.note && <span className="muted" style={{ fontSize: 13 }}>{t.note}</span>}
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }} className="muted">
                      <span className="sr-only">Responsable de {t.title}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
                      <input
                        defaultValue={t.owner_name ?? ""}
                        placeholder="Sin responsable"
                        onBlur={(e) => {
                          const v = e.currentTarget.value.trim() || null;
                          if (v !== t.owner_name) patch(t.id, { owner_name: v });
                        }}
                        style={{ flex: 1, minWidth: 0, font: "inherit", fontSize: 13, color: "var(--ink)", padding: "6px 8px", borderRadius: 6, border: "1px solid var(--line)", background: "#fbf7f2" }}
                      />
                    </label>
                    <div className="row between" style={{ ["--gap" as string]: "8px" }}>
                      <button type="button" aria-label={`Mover "${t.title}" a la izquierda`} disabled={ci === 0} onClick={() => patch(t.id, { status: COLUMNS[ci - 1].key })} className="btn" style={arrowStyle}>←</button>
                      <button type="button" aria-label={`Eliminar "${t.title}"`} onClick={() => remove(t.id)} className="btn" style={{ ...arrowStyle, fontSize: 12, width: "auto", padding: "0 10px", color: "var(--muted)" }}>Eliminar</button>
                      <button type="button" aria-label={`Mover "${t.title}" a la derecha`} disabled={ci === COLUMNS.length - 1} onClick={() => patch(t.id, { status: COLUMNS[ci + 1].key })} className="btn" style={arrowStyle}>→</button>
                    </div>
                  </article>
                ))}
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}

const arrowStyle: React.CSSProperties = {
  fontSize: 16,
  width: 44,
  minHeight: 36,
  padding: 0,
  borderRadius: 8,
  border: "1px solid var(--line-strong)",
  background: "#fff",
  color: "var(--ink)",
};
