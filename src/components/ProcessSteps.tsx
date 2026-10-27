"use client";

import { useRef } from "react";
import { ScrollLine, Stagger, StaggerItem } from "@/components/motion";

const steps = [
  ["Conversamos", "Entiendo tu espacio, tu estilo y tu presupuesto."],
  ["Concepto", "Moodboard y propuesta de distribución."],
  ["Presupuesto", "Costos claros antes de comprar nada."],
  ["Ejecución", "Compras, proveedores y obra coordinados."],
  ["Entrega", "Revisión final y seguimiento después."],
];

/** Cinco pasos en línea de tiempo; la línea se completa con el scroll y los pasos se escalonan en vertical. */
export default function ProcessSteps() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="flex flex-col gap-8">
      <ScrollLine target={ref} />
      <Stagger as="ol" className="grid list-none grid-cols-1 gap-x-[clamp(1rem,0.5rem+2vw,2.5rem)] gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-5" step={0.12}>
        {steps.map(([title, text], i) => (
          <StaggerItem as="li" key={title} className={`flex flex-col gap-3 ${i % 2 ? "lg:mt-14" : ""}`}>
            <span className="font-serif text-[clamp(3rem,2rem+3vw,5rem)] leading-none tracking-tight text-terracota">{String(i + 1).padStart(2, "0")}</span>
            <strong className="text-[1.125rem] font-medium">{title}</strong>
            <span className="leading-relaxed text-ink-2">{text}</span>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
