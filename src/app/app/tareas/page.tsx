import { createClient } from "@/lib/supabase/server";
import Kanban, { type BusinessTask } from "@/components/Kanban";

export default async function TasksPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("business_tasks")
    .select("id, title, area, owner_name, status, high_priority, note")
    .order("created_at");

  return (
    <>
      <div className="stack" style={{ ["--gap" as string]: "6px" }}>
        <h1 className="serif" style={{ margin: 0, fontSize: 44 }}>Tareas del negocio</h1>
        <span className="muted">Lo que haces para mejorar el estudio: marca, ventas, finanzas y operación. Los proyectos de clientes van en Proyectos.</span>
      </div>
      <Kanban initial={(data ?? []) as BusinessTask[]} />
      <section aria-label="Revisión semanal" className="card row" style={{ alignItems: "flex-start", ["--gap" as string]: "24px" }}>
        <div className="stack" style={{ flex: "1 1 220px", ["--gap" as string]: "4px" }}>
          <h2 style={{ margin: 0, fontSize: 17 }}>Revisión semanal</h2>
          <span className="muted" style={{ fontSize: 14 }}>Cada viernes, 10 minutos para mejorar el negocio.</span>
        </div>
        <ul className="ink2" style={{ flex: "3 1 420px", margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>¿Qué tareas cerré y cuál me trabó?</li>
          <li>¿Qué aprendí de clientes o ventas esta semana?</li>
          <li>¿Qué 3 tareas muevo a &quot;En curso&quot; la próxima semana?</li>
        </ul>
      </section>
    </>
  );
}
