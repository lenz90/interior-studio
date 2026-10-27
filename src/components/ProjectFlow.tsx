"use client";

import { useOptimistic, useState, useTransition } from "react";
import { motion, useReducedMotion } from "motion/react";
import { STAGES } from "@/lib/format";
import { addProjectTask, setProjectStage, toggleProjectTask } from "@/app/app/actions";

type Task = { id: string; stage: number; title: string; done: boolean };

export default function ProjectFlow({ projectId, stage, tasks }: { projectId: string; stage: number; tasks: Task[] }) {
  const [picked, setPicked] = useState(stage);
  const [pending, startTransition] = useTransition();
  const reduce = useReducedMotion();
  const [optTasks, setOptTask] = useOptimistic(tasks, (cur: Task[], p: { id: string; done: boolean }) => cur.map((t) => (t.id === p.id ? { ...t, done: p.done } : t)));
  const [optStage, setOptStage] = useOptimistic(stage, (_: number, next: number) => next);
  const stageTasks = optTasks.filter((t) => t.stage === picked);
  const status = picked < optStage ? "Completada" : picked === optStage ? "En curso" : "Pendiente";
  const statusColor = picked < optStage ? "var(--muted)" : picked === optStage ? "var(--accent)" : "var(--ochre)";

  return (
    <section aria-label="Flujo de trabajo" className="card stack" style={{ ["--gap" as string]: "20px" }}>
      <div className="row between">
        <h2 style={{ margin: 0, fontSize: "1.125rem" }}>Flujo de trabajo</h2>
        <span className="muted" style={{ fontSize: "0.875rem" }}>Toca una etapa para ver su lista</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "repeat(9, minmax(96px, 1fr))", gap: 6, minWidth: 880 }}>
          {STAGES.map((name, i) => {
            const done = i < optStage;
            const active = i === optStage;
            const sel = i === picked;
            return (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => setPicked(i)}
                  aria-pressed={sel}
                  style={{ font: "inherit", width: "100%", minHeight: 76, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "10px 4px", borderRadius: 8, cursor: "pointer", border: 0, background: sel ? "#f5e2d8" : "transparent" }}
                >
                  <span style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 600, ...(done ? { background: "var(--accent)", color: "#fff" } : active ? { background: "#fff", color: "var(--accent)", border: "2px solid var(--accent)" } : { background: "var(--line)", color: "var(--ink-2)" }) }}>
                    {done ? "✓" : i + 1}
                  </span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--ink)", fontWeight: sel ? 600 : 400 }}>{name}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="stack" style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
        <div className="row" style={{ alignItems: "baseline" }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 500 }}>{STAGES[picked]}</h3>
          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: statusColor }}>{status}</span>
          {picked !== optStage && (
            <button
              type="button"
              className="btn btn-outline"
              disabled={pending}
              style={{ minHeight: 44, padding: "6px 14px", fontSize: "0.875rem", marginLeft: "auto" }}
              onClick={() => startTransition(async () => { setOptStage(picked); await setProjectStage(projectId, picked); })}
            >
              Marcar como etapa actual
            </button>
          )}
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {stageTasks.length === 0 && <li className="empty">Sin tareas en esta etapa.</li>}
          {stageTasks.map((t) => (
            <motion.li key={t.id} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <label style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <input
                  type="checkbox"
                  checked={t.done}
                  style={{ width: 20, height: 20, accentColor: "var(--accent)" }}
                  onChange={(e) => { const v = e.currentTarget.checked; startTransition(async () => { setOptTask({ id: t.id, done: v }); await toggleProjectTask(t.id, projectId, v); }); }}
                />
                <span style={t.done ? { color: "var(--muted)", textDecoration: "line-through" } : undefined}>{t.title}</span>
              </label>
            </motion.li>
          ))}
        </ul>
        <form action={addProjectTask} className="row">
          <input type="hidden" name="project_id" value={projectId} />
          <input type="hidden" name="stage" value={picked} />
          <label className="field" style={{ flex: "1 1 240px" }}>
            <span className="sr-only">Nueva tarea</span>
            <input className="input" name="title" required placeholder={`Nueva tarea en ${STAGES[picked]}`} />
          </label>
          <button className="btn btn-outline">Agregar</button>
        </form>
      </div>
    </section>
  );
}
