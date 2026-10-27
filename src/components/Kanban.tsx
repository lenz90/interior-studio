"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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

type Status = BusinessTask["status"];

const COLUMNS: { key: Status; label: string }[] = [
  { key: "todo", label: "Por hacer" },
  { key: "doing", label: "En curso" },
  { key: "waiting", label: "Esperando" },
  { key: "done", label: "Hecho" },
];
const AREAS = ["Marca", "Ventas", "Finanzas", "Contenido", "Web", "Estrategia"];
const labelOf = (s: Status) => COLUMNS.find((c) => c.key === s)?.label ?? s;
const isTemp = (id: string) => id.startsWith("tmp-");

const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  return hits.length ? hits : rectIntersection(args);
};

export default function Kanban({ initial }: { initial: BusinessTask[] }) {
  const supabase = useMemo(() => createClient(), []);
  const reduce = useReducedMotion();
  const [tasks, setTasks] = useState<BusinessTask[]>(initial);
  const [filter, setFilter] = useState("Todas");
  const [draft, setDraft] = useState("");
  const [draftArea, setDraftArea] = useState(AREAS[0]);
  const [draftOwner, setDraftOwner] = useState("");
  const [toast, setToast] = useState<{ text: string; kind: "ok" | "error" } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const notify = useCallback((text: string, kind: "ok" | "error" = "error") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ text, kind });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  async function patch(id: string, changes: Partial<BusinessTask>, okMsg?: string) {
    const before = tasks;
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...changes } : t)));
    const { error } = await supabase.from("business_tasks").update(changes).eq("id", id);
    if (error) {
      setTasks(before);
      notify("No se pudo guardar el cambio. Se restauró la tarea.");
    } else if (okMsg) {
      notify(okMsg, "ok");
    }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    const owner = draftOwner.trim() || null;
    const tempId = `tmp-${Date.now()}`;
    const temp: BusinessTask = { id: tempId, title, area: draftArea, owner_name: owner, status: "todo", high_priority: false, note: null };
    setTasks((ts) => [...ts, temp]);
    setDraft("");
    setDraftOwner("");
    const { data, error } = await supabase
      .from("business_tasks")
      .insert({ title, area: draftArea, owner_name: owner })
      .select("id, title, area, owner_name, status, high_priority, note")
      .single();
    if (error || !data) {
      setTasks((ts) => ts.filter((t) => t.id !== tempId));
      setDraft(title);
      return notify("No se pudo crear la tarea.");
    }
    setTasks((ts) => ts.map((t) => (t.id === tempId ? (data as BusinessTask) : t)));
  }

  async function remove(id: string) {
    const before = tasks;
    setTasks((ts) => ts.filter((t) => t.id !== id));
    const { error } = await supabase.from("business_tasks").delete().eq("id", id);
    if (error) {
      setTasks(before);
      notify("No se pudo eliminar la tarea.");
    }
  }

  /** Al cambiar de columna la tarjeta se remonta: devuelve el foco a su asa. */
  function refocusGrip(id: string) {
    setTimeout(() => document.querySelector<HTMLElement>(`[data-grip="${id}"]`)?.focus(), 350);
  }

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const id = String(e.active.id);
    const target = e.over?.id as Status | undefined;
    const task = tasks.find((t) => t.id === id);
    if (!task || !target || target === task.status || isTemp(id)) return;
    void patch(id, { status: target }, `Movida a «${labelOf(target)}»`);
  }

  const visible = tasks.filter((t) => filter === "Todas" || t.area === filter);
  const active = tasks.find((t) => t.id === activeId) ?? null;

  const announcements = {
    onDragStart: ({ active }: { active: { id: string | number } }) => `Tarea «${tasks.find((t) => t.id === active.id)?.title ?? ""}» levantada.`,
    onDragOver: ({ over }: { over: { id: string | number } | null }) => (over ? `Sobre la columna «${labelOf(over.id as Status)}».` : "Fuera de las columnas."),
    onDragEnd: ({ over }: { over: { id: string | number } | null }) => (over ? `Tarea soltada en «${labelOf(over.id as Status)}».` : "Tarea soltada sin cambios."),
    onDragCancel: () => "Movimiento cancelado.",
  };

  return (
    <>
      <form onSubmit={add} aria-label="Nueva tarea" className="card row" style={{ alignItems: "flex-end" }}>
        <label className="field" style={{ flex: "3 1 16rem" }}>
          Nueva tarea
          <input className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ej.: Definir el nombre del estudio" />
        </label>
        <label className="field" style={{ flex: "1 1 11rem" }}>
          Responsable (opcional)
          <input className="input" value={draftOwner} onChange={(e) => setDraftOwner(e.target.value)} placeholder="Nombre o déjalo vacío" />
        </label>
        <label className="field" style={{ flex: "1 1 9rem" }}>
          Área
          <select className="input" value={draftArea} onChange={(e) => setDraftArea(e.target.value)}>
            {AREAS.map((a) => <option key={a}>{a}</option>)}
          </select>
        </label>
        <button className="btn btn-primary" type="submit">+ Agregar</button>
      </form>

      <div role="group" aria-label="Filtrar por área" className="row" style={{ ["--gap" as string]: "0.5rem" }}>
        {["Todas", ...AREAS].map((a) => (
          <button key={a} type="button" aria-pressed={a === filter} onClick={() => setFilter(a)} className="btn chip">
            {a}
          </button>
        ))}
      </div>

      <p className="muted" style={{ margin: 0, fontSize: "0.8125rem" }}>
        Arrastra las tarjetas con el asa ⠿ entre columnas, o usa las flechas. Con teclado, usa las flechas ← → de cada tarjeta (Espacio sobre el asa también la levanta).
      </p>

      <DndContext
        id="business-kanban"
        sensors={sensors}
        collisionDetection={collision}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
        accessibility={{
          announcements,
          screenReaderInstructions: { draggable: "Para mover la tarea, pulsa Espacio, usa las flechas y pulsa Espacio de nuevo para soltarla. Escape cancela." },
        }}
      >
        <div className="kanban">
          {COLUMNS.map((col, ci) => (
            <Column key={col.key} id={col.key} label={col.label} count={visible.filter((t) => t.status === col.key).length}>
              <AnimatePresence mode="popLayout" initial={false}>
                {visible
                  .filter((t) => t.status === col.key)
                  .map((t) => (
                    <motion.div
                      key={t.id}
                      layout={reduce ? false : "position"}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
                      animate={{ opacity: isTemp(t.id) ? 0.6 : 1, scale: 1, y: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <TaskCard
                        task={t}
                        done={col.key === "done"}
                        dragging={activeId === t.id}
                        left={ci > 0 ? COLUMNS[ci - 1] : null}
                        right={ci < COLUMNS.length - 1 ? COLUMNS[ci + 1] : null}
                        onMove={(s) => { patch(t.id, { status: s }, `Movida a «${labelOf(s)}»`); refocusGrip(t.id); }}
                        onOwner={(v) => patch(t.id, { owner_name: v })}
                        onRemove={() => remove(t.id)}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </Column>
          ))}
        </div>
        <DragOverlay dropAnimation={reduce ? null : { duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}>
          {active ? <CardBody task={active} done={active.status === "done"} overlay /> : null}
        </DragOverlay>
      </DndContext>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.text}
            className="toast"
            role={toast.kind === "error" ? "alert" : "status"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            style={toast.kind === "error" ? { background: "var(--accent-hover)", color: "#fff" } : undefined}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Column({ id, label, count, children }: { id: Status; label: string; count: number; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <section ref={setNodeRef} aria-label={label} className="kcol" data-over={isOver}>
      <div className="row between" style={{ padding: "2px 4px 6px" }}>
        <h2 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600 }}>{label}</h2>
        <span className="ink2" style={{ fontSize: "0.8125rem", background: "var(--bg)", borderRadius: 999, padding: "2px 10px" }}>{count}</span>
      </div>
      {children}
    </section>
  );
}

function TaskCard({
  task, done, dragging, left, right, onMove, onOwner, onRemove,
}: {
  task: BusinessTask;
  done: boolean;
  dragging: boolean;
  left: { key: Status; label: string } | null;
  right: { key: Status; label: string } | null;
  onMove: (s: Status) => void;
  onOwner: (v: string | null) => void;
  onRemove: () => void;
}) {
  const pending = isTemp(task.id);
  const { attributes, listeners, setNodeRef } = useDraggable({ id: task.id, disabled: pending });
  return (
    <CardBody
      task={task}
      done={done}
      dragging={dragging}
      nodeRef={setNodeRef}
      grip={
        <button type="button" className="kgrip" aria-label={`Arrastrar «${task.title}»`} data-grip={task.id} disabled={pending} {...attributes} {...listeners}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {[6, 12, 18].flatMap((y) => [9, 15].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />))}
          </svg>
        </button>
      }
      footer={
        <>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.75rem" }} className="muted">
            <span className="sr-only">Responsable de {task.title}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
            <input
              className="input"
              defaultValue={task.owner_name ?? ""}
              placeholder="Sin responsable"
              disabled={pending}
              onBlur={(e) => {
                const v = e.currentTarget.value.trim() || null;
                if (v !== task.owner_name) onOwner(v);
              }}
              style={{ flex: 1, minWidth: 0, fontSize: "1rem", padding: "6px 8px", minHeight: 44, borderRadius: 6, borderColor: "var(--line)", background: "#fbf7f2" }}
            />
          </label>
          <div className="row between" style={{ ["--gap" as string]: "0.5rem" }}>
            <button type="button" aria-label={`Mover «${task.title}» a ${left?.label ?? "la izquierda"}`} disabled={!left || pending} onClick={() => left && onMove(left.key)} className="btn kbtn">←</button>
            <button type="button" aria-label={`Eliminar «${task.title}»`} disabled={pending} onClick={onRemove} className="btn kbtn" style={{ width: "auto", padding: "0 0.75rem", fontSize: "0.75rem", color: "var(--muted)" }}>Eliminar</button>
            <button type="button" aria-label={`Mover «${task.title}» a ${right?.label ?? "la derecha"}`} disabled={!right || pending} onClick={() => right && onMove(right.key)} className="btn kbtn">→</button>
          </div>
        </>
      }
    />
  );
}

function CardBody({
  task, done, dragging, overlay, nodeRef, grip, footer,
}: {
  task: BusinessTask;
  done: boolean;
  dragging?: boolean;
  overlay?: boolean;
  nodeRef?: (el: HTMLElement | null) => void;
  grip?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <article ref={nodeRef} className={`kcard${overlay ? " kcard-overlay" : ""}`} data-dragging={dragging ? "true" : undefined}>
      <div className="row between" style={{ ["--gap" as string]: "0.375rem", flexWrap: "nowrap", alignItems: "flex-start" }}>
        <div className="row" style={{ ["--gap" as string]: "0.375rem" }}>
          <span className="badge badge-done">{task.area}</span>
          {task.high_priority && !done && <span className="badge badge-new">Prioridad alta</span>}
        </div>
        {grip ?? (overlay ? <span className="kgrip" aria-hidden="true" /> : null)}
      </div>
      <span style={{ fontSize: "0.9375rem", fontWeight: 500, lineHeight: 1.4, ...(done ? { color: "var(--muted)", textDecoration: "line-through" } : {}) }}>{task.title}</span>
      {task.note && <span className="muted" style={{ fontSize: "0.8125rem" }}>{task.note}</span>}
      {footer}
    </article>
  );
}
