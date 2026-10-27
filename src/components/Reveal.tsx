"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Entrada suave al hacer scroll (o al montar con `onMount`). Respeta prefers-reduced-motion. */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  onMount = false,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  onMount?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const initial = reduce ? { opacity: 0 } : { opacity: 0, y };
  const shown = { opacity: 1, y: 0 };
  const transition = { duration: 0.6, delay, ease };
  return onMount ? (
    <motion.div className={className} style={style} initial={initial} animate={shown} transition={transition}>
      {children}
    </motion.div>
  ) : (
    <motion.div className={className} style={style} initial={initial} whileInView={shown} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={transition}>
      {children}
    </motion.div>
  );
}

/** Lista de elementos con entrada escalonada; cada hijo directo se anima. */
export function Stagger({
  children,
  className,
  style,
  step = 0.07,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  step?: number;
  as?: "div" | "ol";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      style={style}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: reduce ? 0 : step } } }}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  style,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: "div" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      style={style}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
        shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
      }}
    >
      {children}
    </Tag>
  );
}
