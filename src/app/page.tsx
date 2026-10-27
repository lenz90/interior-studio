import Link from "next/link";
import ContactForm from "@/components/ContactForm";

const STUDIO_NAME = "[Nombre del estudio]";

const services = [
  {
    title: "Asesoría",
    text: "Una sesión para ordenar ideas, elegir colores, materiales y distribución. Te llevas una guía para hacerlo tú.",
  },
  {
    title: "Proyecto de diseño",
    text: "Concepto, moodboard, planos, renders y lista de compras detallada, lista para ejecutar.",
  },
  {
    title: "Llave en mano",
    text: "Diseño, compras, proveedores y supervisión de obra. Recibes el espacio terminado.",
  },
];

const steps = [
  ["Conversamos", "Entiendo tu espacio, tu estilo y tu presupuesto."],
  ["Concepto", "Moodboard y propuesta de distribución."],
  ["Presupuesto", "Costos claros antes de comprar nada."],
  ["Ejecución", "Compras, proveedores y obra coordinados."],
  ["Entrega", "Revisión final y seguimiento después."],
];

const projects = [
  { title: "[Proyecto 1: tipo de espacio]", meta: "[Zona · año]", color: "#d9c3a5" },
  { title: "[Proyecto 2: tipo de espacio]", meta: "[Zona · año]", color: "#c7b49a" },
  { title: "[Proyecto 3: tipo de espacio]", meta: "[Zona · año]", color: "#e2d2bc" },
];

const h2: React.CSSProperties = { margin: 0, fontSize: 48 };

export default function Home() {
  return (
    <main>
      <header className="container row between" style={{ paddingTop: 24, paddingBottom: 24, gap: 16 }}>
        <Link href="#inicio" className="serif" style={{ fontSize: 28, textDecoration: "none" }}>
          {STUDIO_NAME} <span className="muted">· interiores</span>
        </Link>
        <nav aria-label="Principal" className="row" style={{ gap: 28, fontSize: 15 }}>
          <a href="#servicios" style={{ textDecoration: "none" }}>Servicios</a>
          <a href="#proceso" style={{ textDecoration: "none" }}>Cómo trabajo</a>
          <a href="#proyectos" style={{ textDecoration: "none" }}>Proyectos</a>
          <a href="#contacto" className="btn btn-primary">Agenda una consulta</a>
        </nav>
      </header>

      <section id="inicio" className="container grid-auto" style={{ ["--min" as string]: "320px", ["--gap" as string]: "48px", alignItems: "center", paddingTop: 56, paddingBottom: 80 }}>
        <div className="stack" style={{ ["--gap" as string]: "24px" }}>
          <p className="muted" style={{ margin: 0, fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Estudio de diseño de interiores
          </p>
          <h1 className="serif" style={{ margin: 0, fontSize: "clamp(44px, 7vw, 72px)", lineHeight: 1.02 }}>
            Espacios que se sienten tuyos, de principio a fin.
          </h1>
          <p className="ink2" style={{ margin: 0, fontSize: 19, lineHeight: 1.6, maxWidth: 520 }}>
            Diseño tu casa o tu negocio con un proceso claro: una sola persona te acompaña desde la primera idea hasta la entrega de llaves.
          </p>
          <div className="row">
            <a href="#contacto" className="btn btn-primary" style={{ padding: "16px 28px" }}>Agenda una consulta</a>
            <a href="#proyectos" className="btn btn-outline" style={{ padding: "15px 28px" }}>Ver proyectos</a>
          </div>
        </div>
        <div role="img" aria-label="Espacio para foto principal de un proyecto" style={{ height: 520, borderRadius: 4, background: "var(--wheat)", display: "flex", alignItems: "flex-end", padding: 20 }}>
          <span className="ink2" style={{ fontSize: 13, background: "var(--bg)", padding: "6px 10px", borderRadius: 4 }}>
            [Foto principal de un proyecto]
          </span>
        </div>
      </section>

      <section id="servicios" style={{ background: "var(--surface)" }}>
        <div className="container stack" style={{ paddingTop: 88, paddingBottom: 88, ["--gap" as string]: "40px" }}>
          <h2 className="serif" style={h2}>Servicios</h2>
          <div className="grid-auto" style={{ ["--gap" as string]: "24px" }}>
            {services.map((s) => (
              <div key={s.title} className="stack" style={{ borderTop: "1px solid var(--ink)", paddingTop: 24 }}>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 500 }}>{s.title}</h3>
                <p className="ink2" style={{ margin: 0, lineHeight: 1.6 }}>{s.text}</p>
                <p style={{ margin: 0, fontWeight: 500 }}>Desde [PRECIO]</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="proceso" className="container stack" style={{ paddingTop: 88, paddingBottom: 88, ["--gap" as string]: "40px" }}>
        <div className="stack" style={{ maxWidth: 640 }}>
          <h2 className="serif" style={h2}>Cómo trabajo</h2>
          <p className="ink2" style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}>
            Sabes en todo momento en qué etapa está tu proyecto y qué sigue.
          </p>
        </div>
        <ol className="grid-auto" style={{ margin: 0, padding: 0, listStyle: "none", ["--min" as string]: "200px", ["--gap" as string]: "24px" }}>
          {steps.map(([title, text], i) => (
            <li key={title} className="stack" style={{ ["--gap" as string]: "8px" }}>
              <span className="serif" style={{ fontSize: 40, color: "var(--accent)" }}>{String(i + 1).padStart(2, "0")}</span>
              <strong style={{ fontWeight: 500, fontSize: 18 }}>{title}</strong>
              <span className="ink2" style={{ lineHeight: 1.5 }}>{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section id="proyectos" style={{ background: "var(--surface)" }}>
        <div className="container stack" style={{ paddingTop: 88, paddingBottom: 88, ["--gap" as string]: "40px" }}>
          <h2 className="serif" style={h2}>Proyectos</h2>
          <div className="grid-auto" style={{ ["--min" as string]: "300px", ["--gap" as string]: "24px" }}>
            {projects.map((p) => (
              <a key={p.title} href="#contacto" className="stack" style={{ textDecoration: "none" }}>
                <div role="img" aria-label="Espacio para foto de proyecto" style={{ height: 360, background: p.color, borderRadius: 4 }} />
                <span style={{ fontSize: 18, fontWeight: 500 }}>{p.title}</span>
                <span className="muted">{p.meta}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container grid-auto" style={{ ["--min" as string]: "300px", ["--gap" as string]: "48px", alignItems: "center", paddingTop: 88, paddingBottom: 88 }}>
        <div role="img" aria-label="Espacio para foto de la diseñadora" style={{ height: 420, background: "var(--wheat)", borderRadius: 4 }} />
        <div className="stack" style={{ ["--gap" as string]: "16px" }}>
          <h2 className="serif" style={h2}>Sobre mí</h2>
          <p className="ink2" style={{ margin: 0, fontSize: 17, lineHeight: 1.7 }}>
            [Tu historia en 3–4 líneas: formación, experiencia y por qué trabajas sola: trato directo, una sola persona responsable de tu proyecto.]
          </p>
        </div>
      </section>

      <section id="contacto" style={{ background: "var(--ink)", color: "var(--bg)" }}>
        <div className="container grid-auto" style={{ ["--min" as string]: "320px", ["--gap" as string]: "48px", paddingTop: 88, paddingBottom: 88 }}>
          <div className="stack" style={{ ["--gap" as string]: "16px" }}>
            <h2 className="serif" style={h2}>Cuéntame de tu espacio</h2>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "var(--on-dark-2)" }}>
              Te respondo en [PLAZO] para agendar una primera conversación sin costo.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="container row between muted" style={{ paddingTop: 32, paddingBottom: 32, fontSize: 14 }}>
        <span>{STUDIO_NAME} · interiores</span>
        <span>
          [Ciudad] · [Instagram] · [WhatsApp] · <Link href="/login">Acceso</Link>
        </span>
      </footer>
    </main>
  );
}
