export const STAGES = [
  "Contacto",
  "Briefing",
  "Concepto",
  "Presupuesto",
  "Aprobación",
  "Compras",
  "Obra",
  "Entrega",
  "Seguimiento",
] as const;

export const CLIENT_STAGES: Record<string, string> = {
  new: "Contacto nuevo",
  proposal: "Propuesta enviada",
  active: "Cliente activo",
  done: "Terminado",
};

export const SERVICES: Record<string, string> = {
  consulting: "Asesoría",
  design: "Proyecto de diseño",
  turnkey: "Llave en mano",
};

export function money(n: number | string | null | undefined) {
  const v = Number(n ?? 0);
  return "$ " + v.toLocaleString("es-CO", { maximumFractionDigits: 0 });
}

export function shortDate(d: string | null | undefined) {
  if (!d) return "";
  return new Date(d + (d.length === 10 ? "T12:00:00" : "")).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}
