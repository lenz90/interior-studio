import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

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

const gap = (v: string) => ({ ["--gap" as string]: v });

export default function Home() {
  return (
    <main>
      <header className="container row between" style={{ paddingBlock: "1.5rem", gap: "1rem" }}>
        <Link href="#inicio" className="serif" style={{ fontSize: "clamp(1.5rem, 1.2rem + 0.8vw, 2rem)", textDecoration: "none" }}>
          {STUDIO_NAME} <span className="muted">· interiores</span>
        </Link>
        <nav aria-label="Principal" className="row site-nav" style={{ gap: "clamp(1rem, 0.5rem + 1.6vw, 2rem)", fontSize: "0.9375rem" }}>
          <a href="#servicios">Servicios</a>
          <a href="#proceso">Cómo trabajo</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#contacto" className="btn btn-primary">Agenda una consulta</a>
        </nav>
      </header>

      <section id="inicio" className="container grid-auto" style={{ ...gap("clamp(2rem, 1rem + 3vw, 4rem)"), ["--min" as string]: "min(20rem, 100%)", alignItems: "center", paddingTop: "clamp(2rem, 1rem + 3vw, 4rem)", paddingBottom: "var(--section-y)" }}>
        <div className="stack" style={gap("1.5rem")}>
          <Reveal onMount>
            <p className="muted" style={{ margin: 0, fontSize: "0.875rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Estudio de diseño de interiores
            </p>
          </Reveal>
          <Reveal onMount delay={0.08}>
            <h1 className="serif h-display" style={{ margin: 0 }}>
              Espacios que se sienten tuyos, de principio a fin.
            </h1>
          </Reveal>
          <Reveal onMount delay={0.16}>
            <p className="ink2 lead" style={{ margin: 0, maxWidth: "34rem" }}>
              Diseño tu casa o tu negocio con un proceso claro: una sola persona te acompaña desde la primera idea hasta la entrega de llaves.
            </p>
          </Reveal>
          <Reveal onMount delay={0.24} className="row">
            <a href="#contacto" className="btn btn-primary" style={{ padding: "1rem 1.75rem" }}>Agenda una consulta</a>
            <a href="#proyectos" className="btn btn-outline" style={{ padding: "1rem 1.75rem" }}>Ver proyectos</a>
          </Reveal>
        </div>
        <Reveal onMount delay={0.12}>
          <div role="img" aria-label="Espacio para foto principal de un proyecto" className="media" style={{ height: "clamp(20rem, 12rem + 30vw, 40rem)", display: "flex", alignItems: "flex-end", padding: "1.25rem" }}>
            <span className="ink2" style={{ fontSize: "0.8125rem", background: "var(--bg)", padding: "6px 10px", borderRadius: 4 }}>
              [Foto principal de un proyecto]
            </span>
          </div>
        </Reveal>
      </section>

      <section id="servicios" style={{ background: "var(--surface)" }}>
        <div className="container stack section-y" style={gap("clamp(1.75rem, 1rem + 2vw, 3rem)")}>
          <Reveal><h2 className="serif h-section" style={{ margin: 0 }}>Servicios</h2></Reveal>
          <Stagger className="grid-auto" style={{ ["--min" as string]: "min(17rem, 100%)", ...gap("clamp(1rem, 0.5rem + 1.6vw, 2rem)") }}>
            {services.map((s) => (
              <StaggerItem key={s.title} className="stack" style={{ borderTop: "1px solid var(--ink)", paddingTop: "1.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.375rem", fontWeight: 500 }}>{s.title}</h3>
                <p className="ink2" style={{ margin: 0, lineHeight: 1.6 }}>{s.text}</p>
                <p style={{ margin: 0, fontWeight: 500 }}>Desde [PRECIO]</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="proceso" className="container stack section-y" style={gap("clamp(1.75rem, 1rem + 2vw, 3rem)")}>
        <Reveal className="stack" style={{ maxWidth: "40rem" }}>
          <h2 className="serif h-section" style={{ margin: 0 }}>Cómo trabajo</h2>
          <p className="ink2 lead" style={{ margin: 0 }}>
            Sabes en todo momento en qué etapa está tu proyecto y qué sigue.
          </p>
        </Reveal>
        <Stagger as="ol" className="grid-auto" style={{ margin: 0, padding: 0, listStyle: "none", ["--min" as string]: "min(12.5rem, 100%)", ...gap("clamp(1rem, 0.5rem + 1.6vw, 2rem)") }}>
          {steps.map(([title, text], i) => (
            <StaggerItem as="li" key={title} className="stack" style={gap("0.5rem")}>
              <span className="serif" style={{ fontSize: "2.5rem", color: "var(--accent)" }}>{String(i + 1).padStart(2, "0")}</span>
              <strong style={{ fontWeight: 500, fontSize: "1.125rem" }}>{title}</strong>
              <span className="ink2" style={{ lineHeight: 1.5 }}>{text}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="proyectos" style={{ background: "var(--surface)" }}>
        <div className="container stack section-y" style={gap("clamp(1.75rem, 1rem + 2vw, 3rem)")}>
          <Reveal><h2 className="serif h-section" style={{ margin: 0 }}>Proyectos</h2></Reveal>
          <Stagger className="grid-auto" style={{ ["--min" as string]: "min(18rem, 100%)", ...gap("clamp(1rem, 0.5rem + 1.6vw, 2rem)") }}>
            {projects.map((p) => (
              <StaggerItem key={p.title}>
                <a href="#contacto" className="stack media-link" style={{ textDecoration: "none" }}>
                  <div role="img" aria-label="Espacio para foto de proyecto" className="media" style={{ height: "clamp(16rem, 10rem + 18vw, 28rem)" }}>
                    <div className="media-zoom" style={{ background: p.color }} />
                  </div>
                  <span style={{ fontSize: "1.125rem", fontWeight: 500 }}>{p.title}</span>
                  <span className="muted">{p.meta}</span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="container grid-auto section-y" style={{ ["--min" as string]: "min(18rem, 100%)", ...gap("clamp(2rem, 1rem + 3vw, 4rem)"), alignItems: "center" }}>
        <Reveal>
          <div role="img" aria-label="Espacio para foto de la diseñadora" className="media" style={{ height: "clamp(18rem, 10rem + 22vw, 32rem)" }} />
        </Reveal>
        <Reveal delay={0.1} className="stack" style={gap("1rem")}>
          <h2 className="serif h-section" style={{ margin: 0 }}>Sobre mí</h2>
          <p className="ink2 lead" style={{ margin: 0, lineHeight: 1.7 }}>
            [Tu historia en 3–4 líneas: formación, experiencia y por qué trabajas sola: trato directo, una sola persona responsable de tu proyecto.]
          </p>
        </Reveal>
      </section>

      <section id="contacto" style={{ background: "var(--ink)", color: "var(--bg)" }}>
        <div className="container grid-auto section-y" style={{ ["--min" as string]: "min(20rem, 100%)", ...gap("clamp(2rem, 1rem + 3vw, 4rem)") }}>
          <Reveal className="stack" style={gap("1rem")}>
            <h2 className="serif h-section" style={{ margin: 0 }}>Cuéntame de tu espacio</h2>
            <p className="lead" style={{ margin: 0, color: "var(--on-dark-2)" }}>
              Te respondo en [PLAZO] para agendar una primera conversación sin costo.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <footer className="container row between muted" style={{ paddingBlock: "2rem", fontSize: "0.875rem" }}>
        <span>{STUDIO_NAME} · interiores</span>
        <span>
          [Ciudad] · [Instagram] · [WhatsApp] · <Link href="/login">Acceso</Link>
        </span>
      </footer>
    </main>
  );
}
