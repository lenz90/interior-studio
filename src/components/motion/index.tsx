"use client";

import { useRef } from "react";
import { MotionGlobalConfig, motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Revelado que se repite cada vez que el elemento entra en pantalla. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "article" | "p" | "span";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/** Línea fina que se dibuja al entrar (y se redibuja al volver a entrar). */
export function DrawLine({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={`h-px w-full origin-left bg-ink/30 ${className}`}
      initial={{ scaleX: reduce ? 1 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: false, amount: 1 }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    />
  );
}

/** Línea cuyo avance sigue el scroll de su contenedor. */
export function ScrollLine({ target, className = "" }: { target: React.RefObject<HTMLElement | null>; className?: string }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start 80%", "end 60%"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  return (
    <div aria-hidden="true" className={`relative h-px w-full bg-ink/15 ${className}`}>
      <motion.div className="absolute inset-0 origin-left bg-terracota" style={{ scaleX: reduce ? 1 : scaleX }} />
    </div>
  );
}

/** Foto con parallax leve (máx. 8 %) y escala lenta al pasar el cursor. */
export function Photo({ className = "", color = "var(--wheat)", label, children }: { className?: string; color?: string; label: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <div ref={ref} role="img" aria-label={label} className={`group relative overflow-hidden rounded-t-[999px] ${className}`} style={{ background: color }}>
      <motion.div className="absolute inset-x-0 -inset-y-[10%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]" style={{ y: reduce ? 0 : y, background: color }} />
      {children}
    </div>
  );
}

/** Bloque que se desplaza y se desvanece suavemente mientras se hace scroll. */
export function Drift({ children, className = "", distance = 60 }: { children: React.ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.25]);
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y, opacity }}>
      {children}
    </motion.div>
  );
}

/** Línea de título: entra desde una máscara, escalonada. El observador va en la máscara (no en el texto desplazado). */
export function Line({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span className="block overflow-hidden pb-[0.08em]" initial="hidden" whileInView="shown" viewport={{ once: false, amount: 0.6 }}>
      <motion.span
        className="block"
        variants={{
          hidden: reduce ? { opacity: 0 } : { y: "105%" },
          shown: { y: 0, opacity: 1, transition: { duration: 0.9, delay, ease: EASE } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/** Contenedor con entrada escalonada de hijos <StaggerItem>. */
export function Stagger({ children, className, step = 0.09, as = "div" }: { children: React.ReactNode; className?: string; step?: number; as?: "div" | "ol" | "ul" }) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag className={className} initial="hidden" whileInView="shown" viewport={{ once: false, amount: 0.2 }} variants={{ hidden: {}, shown: { transition: { staggerChildren: step } } }}>
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag className={className} variants={{ hidden: { opacity: 0, y: reduce ? 0 : 32 }, shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}>
      {children}
    </Tag>
  );
}

/** Con ?capture=1 las animaciones saltan al estado final (capturas de pantalla reproducibles). */
export function CaptureMode() {
  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("capture")) {
    MotionGlobalConfig.skipAnimations = true;
  }
  return null;
}
