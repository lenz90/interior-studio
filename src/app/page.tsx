import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import ProcessSteps from "@/components/ProcessSteps";
import { CaptureMode, Drift, DrawLine, Line, Photo, Reveal, Stagger, StaggerItem } from "@/components/motion";

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

const projects = [
  { title: "[Proyecto 1: tipo de espacio]", meta: "[Zona · año]", color: "#d9c3a5", span: "md:col-span-5", offset: "md:mt-0", ratio: "aspect-[4/5]" },
  { title: "[Proyecto 2: tipo de espacio]", meta: "[Zona · año]", color: "#c7b49a", span: "md:col-span-4 md:col-start-7", offset: "md:mt-28", ratio: "aspect-[3/4]" },
  { title: "[Proyecto 3: tipo de espacio]", meta: "[Zona · año]", color: "#e2d2bc", span: "md:col-span-3 md:col-start-11", offset: "md:mt-10", ratio: "aspect-[3/4]" },
];

function Num({ n, children }: { n: string; children?: React.ReactNode }) {
  return (
    <p className="label flex items-center gap-3 text-ink-2">
      <span className="text-[var(--accent-hover)]">{n}</span>
      <span aria-hidden="true" className="h-px w-8 bg-ink/40" />
      {children ? <span>{children}</span> : null}
    </p>
  );
}

export default function Home() {
  return (
    <main>
      <noscript>
        <style>{`[style*="opacity:0"],[style*="translateY(105%)"],[style*="scaleX(0)"]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <CaptureMode />
      <header className="wrap flex flex-wrap items-center justify-between gap-4 py-6">
        <Link href="#inicio" className="font-serif text-[clamp(1.5rem,1.2rem+0.8vw,2rem)] tracking-tight no-underline">
          {STUDIO_NAME} <span className="text-muted-foreground">· interiores</span>
        </Link>
        <nav aria-label="Principal" className="site-nav flex flex-wrap items-center gap-x-8 gap-y-2 text-[0.9375rem]">
          <a href="#servicios">Servicios</a>
          <a href="#proceso">Cómo trabajo</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#contacto" className="btn btn-primary">Agenda una consulta</a>
        </nav>
      </header>
      <div className="wrap"><DrawLine /></div>

      {/* 01 · Hero */}
      <section id="inicio" className="wrap grid grid-cols-12 gap-x-[clamp(1rem,0.5rem+2vw,2.5rem)] gap-y-12 pb-[clamp(4rem,2rem+6vw,8rem)] pt-[clamp(2.5rem,1rem+4vw,5rem)]">
        <Drift className="col-span-12 flex flex-col gap-8 md:col-span-7 md:pr-8 lg:pt-6">
          <Reveal>
            <Num n="01">Estudio de diseño de interiores</Num>
          </Reveal>
          <h1 className="display">
            <Line>Espacios que se</Line>
            <Line delay={0.08}>sienten <em className="italic">tuyos</em>,</Line>
            <Line delay={0.16}>de principio a fin.</Line>
          </h1>
          <Reveal delay={0.2} className="max-w-[34rem]">
            <p className="body-lg text-ink-2">
              Diseño tu casa o tu negocio con un proceso claro: una sola persona te acompaña desde la primera idea hasta la entrega de llaves.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="flex flex-wrap gap-3">
            <a href="#contacto" className="btn btn-primary btn-arrow" style={{ padding: "1rem 1.75rem" }}>
              Agenda una consulta <span aria-hidden="true" className="arrow">→</span>
            </a>
            <a href="#proyectos" className="btn btn-outline btn-arrow" style={{ padding: "1rem 1.75rem" }}>
              Ver proyectos <span aria-hidden="true" className="arrow">→</span>
            </a>
          </Reveal>
        </Drift>
        <Reveal delay={0.15} className="col-span-12 md:col-span-5 md:mt-16">
          <Photo label="Espacio para foto principal de un proyecto" className="aspect-[4/5] w-full">
            <span className="absolute bottom-5 left-5 rounded bg-background px-2.5 py-1.5 text-[0.8125rem] text-ink-2">[Foto principal de un proyecto]</span>
          </Photo>
        </Reveal>
      </section>

      {/* 02 · Servicios */}
      <section id="servicios" className="bg-linen">
        <div className="wrap sec grid grid-cols-12 gap-x-[clamp(1rem,0.5rem+2vw,2.5rem)] gap-y-12">
          <div className="col-span-12 flex flex-col gap-6 md:col-span-4 md:sticky md:top-8 md:self-start">
            <Reveal><Num n="02" /></Reveal>
            <Reveal delay={0.08}><h2 className="h2d">Servicios</h2></Reveal>
          </div>
          <Stagger className="col-span-12 md:col-span-7 md:col-start-6" step={0.12}>
            {services.map((s, i) => (
              <StaggerItem key={s.title}>
                <a href="#contacto" className="group block no-underline">
                  <DrawLine />
                  <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-3 py-8 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:pl-3 md:grid-cols-[3rem_1fr_auto]">
                    <span className="label text-[var(--accent-hover)]">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex flex-col gap-3">
                      <h3 className="h3d"><span className="underline-grow">{s.title}</span></h3>
                      <p className="max-w-[34rem] leading-relaxed text-ink-2">{s.text}</p>
                    </div>
                    <p className="col-start-2 font-medium md:col-start-auto md:text-right">Desde [PRECIO]</p>
                  </div>
                </a>
              </StaggerItem>
            ))}
            <DrawLine />
          </Stagger>
        </div>
      </section>

      {/* 03 · Cómo trabajo */}
      <section id="proceso" className="wrap sec flex flex-col gap-[clamp(2.5rem,1.5rem+3vw,5rem)]">
        <div className="grid grid-cols-12 gap-x-[clamp(1rem,0.5rem+2vw,2.5rem)] gap-y-6">
          <div className="col-span-12 flex flex-col gap-6 md:col-span-5">
            <Reveal><Num n="03" /></Reveal>
            <Reveal delay={0.08}><h2 className="h2d">Cómo trabajo</h2></Reveal>
          </div>
          <Reveal delay={0.15} className="col-span-12 md:col-span-4 md:col-start-8 md:self-end">
            <p className="body-lg text-ink-2">Sabes en todo momento en qué etapa está tu proyecto y qué sigue.</p>
          </Reveal>
        </div>
        <ProcessSteps />
      </section>

      {/* 04 · Proyectos */}
      <section id="proyectos" className="bg-linen">
        <div className="wrap sec flex flex-col gap-[clamp(2.5rem,1.5rem+3vw,5rem)]">
          <div className="flex flex-col gap-6">
            <Reveal><Num n="04" /></Reveal>
            <Reveal delay={0.08}><h2 className="h2d">Proyectos</h2></Reveal>
          </div>
          <div className="grid grid-cols-12 gap-x-[clamp(1rem,0.5rem+2vw,2.5rem)] gap-y-12">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1} className={`col-span-12 ${p.span} ${p.offset}`}>
                <a href="#contacto" className="group flex flex-col gap-4 no-underline">
                  <Photo label="Espacio para foto de proyecto" color={p.color} className={`${p.ratio} w-full`} />
                  <span className="flex flex-col gap-1">
                    <span className="text-[1.125rem] font-medium"><span className="underline-grow">{p.title}</span></span>
                    <span className="text-muted-foreground">{p.meta}</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 05 · Sobre mí */}
      <section className="wrap sec grid grid-cols-12 items-center gap-x-[clamp(1rem,0.5rem+2vw,2.5rem)] gap-y-12">
        <Reveal className="col-span-12 md:col-span-5">
          <Photo label="Espacio para foto de la diseñadora" className="aspect-[3/4] w-full" />
        </Reveal>
        <div className="col-span-12 flex flex-col gap-6 md:col-span-6 md:col-start-7">
          <Reveal><Num n="05" /></Reveal>
          <Reveal delay={0.08}><h2 className="h2d">Sobre mí</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="body-lg text-ink-2" style={{ lineHeight: 1.7 }}>
              [Tu historia en 3–4 líneas: formación, experiencia y por qué trabajas sola: trato directo, una sola persona responsable de tu proyecto.]
            </p>
          </Reveal>
        </div>
      </section>

      {/* 06 · Contacto */}
      <section id="contacto" className="bg-ink text-background">
        <div className="wrap sec grid grid-cols-12 gap-x-[clamp(1rem,0.5rem+2vw,2.5rem)] gap-y-12">
          <div className="col-span-12 flex flex-col gap-6 md:col-span-5">
            <Reveal><p className="label flex items-center gap-3 text-[var(--on-dark-2)]"><span className="text-[var(--wheat)]">06</span><span aria-hidden="true" className="h-px w-8 bg-background/40" /></p></Reveal>
            <Reveal delay={0.08}><h2 className="h2d">Cuéntame de tu espacio</h2></Reveal>
            <Reveal delay={0.16}>
              <p className="body-lg text-[var(--on-dark-2)]">Te respondo en [PLAZO] para agendar una primera conversación sin costo.</p>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="col-span-12 md:col-span-6 md:col-start-7">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <footer className="wrap flex flex-wrap items-center justify-between gap-3 py-8 text-sm text-muted-foreground">
        <span>{STUDIO_NAME} · interiores</span>
        <span>
          [Ciudad] · [Instagram] · [WhatsApp] · <Link href="/login">Acceso</Link>
        </span>
      </footer>
    </main>
  );
}
