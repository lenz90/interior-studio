import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SERVICES, money } from "@/lib/format";
import { updateProjectMoney } from "../../actions";
import ProjectFlow from "@/components/ProjectFlow";

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: project }, { data: tasks }] = await Promise.all([
    supabase.from("projects").select("*, clients(name)").eq("id", id).maybeSingle(),
    supabase.from("project_tasks").select("id, stage, title, done").eq("project_id", id).order("created_at"),
  ]);
  if (!project) notFound();

  const client = (project.clients as { name: string } | null)?.name;
  const budget = Number(project.budget);
  const spent = Number(project.spent);
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;

  return (
    <>
      <div className="stack" style={{ ["--gap" as string]: "8px" }}>
        <Link href="/app/proyectos" className="muted" style={{ fontSize: "0.875rem" }}>← Proyectos</Link>
        <h1 className="serif" style={{ margin: 0, fontSize: "var(--fs-h1)" }}>{project.name}</h1>
        <span className="muted">{client ?? "Sin cliente"} · {SERVICES[project.service]}</span>
      </div>

      <ProjectFlow projectId={project.id} stage={project.stage} tasks={tasks ?? []} />

      <section className="card stack" style={{ maxWidth: 520 }}>
        <h2 style={{ margin: 0, fontSize: "1.125rem" }}>Presupuesto del proyecto</h2>
        <div className="row between"><span className="muted">Aprobado</span><strong style={{ fontWeight: 500 }}>{money(budget)}</strong></div>
        <div className="row between"><span className="muted">Comprado hasta hoy</span><strong style={{ fontWeight: 500 }}>{money(spent)}</strong></div>
        <span style={{ height: 8, background: "var(--line)", borderRadius: 4, display: "block" }}>
          <span style={{ display: "block", width: `${pct}%`, height: 8, background: "var(--accent)", borderRadius: 4 }} />
        </span>
        <div className="row between"><span className="muted">Disponible</span><strong style={{ fontWeight: 500 }}>{money(budget - spent)}</strong></div>
        <form action={updateProjectMoney} className="row" style={{ alignItems: "flex-end" }}>
          <input type="hidden" name="id" value={project.id} />
          <label className="field" style={{ flex: "1 1 120px" }}>Aprobado<input className="input" name="budget" defaultValue={budget} inputMode="numeric" /></label>
          <label className="field" style={{ flex: "1 1 120px" }}>Comprado<input className="input" name="spent" defaultValue={spent} inputMode="numeric" /></label>
          <button className="btn btn-outline">Guardar</button>
        </form>
      </section>
    </>
  );
}
