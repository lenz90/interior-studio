---
name: frontend-design
description: Pautas para diseñar y construir interfaces con identidad propia (no plantilla). Usar antes de cualquier cambio visual de la landing o la app de interior-studio.
---

# Frontend design

No existía un skill público en el entorno (`/mnt/skills/public/frontend-design/SKILL.md`), así que estas pautas son las del proyecto. Se leen junto con `design/brief.md` (dirección vigente), `docs/marca.md` (paleta B) y los tableros de `design/`.

## Antes de programar
1. Define una **dirección estética intencional** en una frase y escríbela (o confirma la de `design/brief.md`). Todo lo demás se decide contra ella.
2. Revisa los tableros de `design/` y los tokens de `src/app/globals.css`. No inventes valores fuera de los tokens.

## Principios
- **Tipografía con personalidad.** Nada de fuentes genéricas ni de sistema como protagonista. Títulos con tracking ligeramente negativo y interlineado cerrado; cuerpo cómodo (16–18 px, 1.6). Cargar con `next/font`, nunca con `@import`.
- **Composición con asimetría y ritmo.** Rejilla de 12 columnas usada de forma desigual, bloques y líneas, vacíos deliberados. Alternar densidad entre secciones.
- **Fondos con textura sutil**, no colores planos: grano SVG al 3–4 %. Sin sombras pesadas.
- **Movimiento orquestado**, no animaciones sueltas: entradas escalonadas con un mismo easing, hovers de 200–300 ms, revelados al hacer scroll. Un solo lenguaje de movimiento en todo el sitio.
- **Evitar el aspecto de plantilla**: tarjetas con sombra, gradientes de moda, botones genéricos, iconos decorativos sin función.
- **Detalles de arquitectura**: líneas finas (hairlines), numeración de secciones, proporciones controladas, arcos en fotos.

## No negociable
- Paleta B en variables CSS; contraste de texto ≥ 4,5:1 (trigo solo decorativo).
- Escala fluida con `clamp()`/`rem`; sin anchos fijos ni tamaños en px que se estiren.
- `prefers-reduced-motion` respetado y `:focus-visible` en todo elemento interactivo.
- Textos, precios y plazos no se inventan: marcadores `[ ]`.

## Cierre
Revisar 390, 768, 1440, 1920 y 2560 px, guardar capturas en `design/capturas/` y pasar el agente `revision-diseno`.
