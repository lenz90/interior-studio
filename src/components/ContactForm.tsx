"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const fieldStyle: React.CSSProperties = {
  font: "inherit",
  fontSize: 16,
  padding: 14,
  borderRadius: 4,
  border: "1px solid #6b5b50",
  background: "#3a2e27",
  color: "#f6f1eb",
};
const labelStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, fontSize: 14 };

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.from("contact_requests").insert({
      name: String(form.get("name") || "").trim(),
      contact: String(form.get("contact") || "").trim(),
      space_type: String(form.get("space_type") || ""),
      message: String(form.get("message") || "").trim(),
    });
    setStatus(error ? "error" : "sent");
    if (!error) formEl.reset();
  }

  if (status === "sent") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }} role="status">
        <p className="serif" style={{ fontSize: 32, margin: 0 }}>¡Gracias! Recibí tu mensaje.</p>
        <p style={{ margin: 0, color: "var(--on-dark-2)" }}>Te escribo pronto para agendar una conversación.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <label style={labelStyle}>
        Nombre
        <input name="name" required maxLength={120} style={fieldStyle} />
      </label>
      <label style={labelStyle}>
        Correo o WhatsApp
        <input name="contact" required minLength={3} maxLength={160} style={fieldStyle} />
      </label>
      <label style={labelStyle}>
        Tipo de espacio
        <select name="space_type" style={fieldStyle} defaultValue="Vivienda">
          <option>Vivienda</option>
          <option>Oficina</option>
          <option>Local comercial</option>
          <option>Otro</option>
        </select>
      </label>
      <label style={labelStyle}>
        ¿Qué te gustaría cambiar?
        <textarea name="message" rows={4} maxLength={2000} style={fieldStyle} />
      </label>
      <button type="submit" className="btn btn-light" disabled={status === "sending"} style={{ padding: 16, fontSize: 16 }}>
        {status === "sending" ? "Enviando…" : "Enviar solicitud"}
      </button>
      {status === "error" && (
        <span role="alert" style={{ fontSize: 14, color: "#f5c4b0" }}>
          No se pudo enviar. Inténtalo de nuevo en un momento.
        </span>
      )}
    </form>
  );
}
