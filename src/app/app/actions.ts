"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function str(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}
function num(form: FormData, key: string) {
  const n = Number(str(form, key).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export async function addClient(form: FormData) {
  const name = str(form, "name");
  if (!name) return;
  const supabase = await createClient();
  await supabase.from("clients").insert({
    name,
    space: str(form, "space") || null,
    stage: str(form, "stage") || "new",
    source: str(form, "source") || null,
    next_step: str(form, "next_step") || null,
    contact: str(form, "contact") || null,
    value: str(form, "value") ? num(form, "value") : null,
  });
  revalidatePath("/app/clientes");
  revalidatePath("/app");
}

export async function updateClientStage(id: string, stage: string) {
  const supabase = await createClient();
  await supabase.from("clients").update({ stage }).eq("id", id);
  revalidatePath("/app/clientes");
}

export async function convertRequest(id: string) {
  const supabase = await createClient();
  const { data: req } = await supabase.from("contact_requests").select("*").eq("id", id).single();
  if (!req) return;
  await supabase.from("clients").insert({
    name: req.name,
    contact: req.contact,
    space: req.space_type,
    source: "Web",
    notes: req.message,
    stage: "new",
    next_step: "Responder y agendar llamada",
  });
  await supabase.from("contact_requests").update({ handled: true }).eq("id", id);
  revalidatePath("/app");
  revalidatePath("/app/clientes");
}

export async function addProject(form: FormData) {
  const name = str(form, "name");
  if (!name) return;
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .insert({
      name,
      client_id: str(form, "client_id") || null,
      service: str(form, "service") || "design",
      budget: num(form, "budget"),
    })
    .select("id")
    .single();
  revalidatePath("/app/proyectos");
  if (data?.id) redirect(`/app/proyectos/${data.id}`);
}

export async function setProjectStage(id: string, stage: number) {
  const supabase = await createClient();
  await supabase.from("projects").update({ stage }).eq("id", id);
  revalidatePath(`/app/proyectos/${id}`);
  revalidatePath("/app/proyectos");
  revalidatePath("/app");
}

export async function addProjectTask(form: FormData) {
  const projectId = str(form, "project_id");
  const title = str(form, "title");
  const stage = Number(str(form, "stage"));
  if (!projectId || !title || !Number.isInteger(stage)) return;
  const supabase = await createClient();
  await supabase.from("project_tasks").insert({ project_id: projectId, title, stage });
  revalidatePath(`/app/proyectos/${projectId}`);
}

export async function toggleProjectTask(id: string, projectId: string, done: boolean) {
  const supabase = await createClient();
  await supabase.from("project_tasks").update({ done }).eq("id", id);
  revalidatePath(`/app/proyectos/${projectId}`);
}

export async function updateProjectMoney(form: FormData) {
  const id = str(form, "id");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("projects").update({ budget: num(form, "budget"), spent: num(form, "spent") }).eq("id", id);
  revalidatePath(`/app/proyectos/${id}`);
}

export async function addTransaction(form: FormData) {
  const description = str(form, "description");
  const amount = num(form, "amount");
  if (!description || !amount) return;
  const supabase = await createClient();
  await supabase.from("transactions").insert({
    kind: str(form, "kind") === "expense" ? "expense" : "income",
    amount,
    description,
    category: str(form, "category") || null,
    status: str(form, "status") === "pending" ? "pending" : "paid",
    due_date: str(form, "due_date") || null,
    date: str(form, "date") || undefined,
  });
  revalidatePath("/app/finanzas");
  revalidatePath("/app");
}

export async function markPaid(id: string) {
  const supabase = await createClient();
  await supabase.from("transactions").update({ status: "paid", date: new Date().toISOString().slice(0, 10) }).eq("id", id);
  revalidatePath("/app/finanzas");
  revalidatePath("/app");
}

export async function addDecision(form: FormData) {
  const text = str(form, "text");
  if (!text) return;
  const supabase = await createClient();
  await supabase.from("decisions").insert({ text, kind: str(form, "kind") === "question" ? "question" : "decision" });
  revalidatePath("/app");
}
