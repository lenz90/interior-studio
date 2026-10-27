---
name: design-tokens
description: Tokens de color, tipografía, rejilla y espaciado de interior-studio. Leer solo al tocar globals.css, colores, tipos o espaciado.
---

# Tokens

- **Color (Paleta B)**: `--bg #F6F1EB`, `--linen #EFE4D6`, `--wheat #D9C3A5` (solo decorativo), `--accent #A4502F` (hover `#8A4226`), `--sage #5F6E55` (texto solo sobre `--bg`), `--ink #2B211C`, `--ink-2 #5A4A40`. Nada fuera de esta lista. Texto ≥ 4,5:1.
- **Tipos**: Instrument Serif (display, `-0.02em`, lh 1.0–1.05, normal e *italic*) y DM Sans (cuerpo 16–18 px, lh 1.6; etiquetas 12–13 px en mayúsculas, tracking 0.12em). Siempre `next/font`; escala con `clamp()`.
- **Rejilla**: 12 columnas, contenedor máx. 1440 px (90rem), márgenes fluidos, espaciado en múltiplos de 8 px.
- **Detalles**: hairlines 1 px, numeración 01—06, grano SVG 3–4 % en fondos claros, fotos con arco superior (4:5 o 3:4), sin sombras pesadas.
- Los tokens viven en `src/app/globals.css` (`:root` y `@theme`). No dupliques valores: referencia la variable.
