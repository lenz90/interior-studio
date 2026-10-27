# Brief de diseño: dirección propuesta

> Estado: **borrador a confirmar**. No se implementa nada hasta que se apruebe.
> Lo marcado como *(supuesto)* no está confirmado.

## Dirección
**«Plano y material»**: la calidez de un estudio de interiores con el rigor de una oficina de arquitectura. Se transmite criterio con jerarquía tipográfica fuerte, rejilla visible por detalles (líneas finas, numeración), fotos con arco y mucho aire. Cálida y táctil (lino, trigo, terracota, café), no tecnológica.

Referentes (rive.app, epic.net, awwwards.com, spline.design): se toma el **criterio** (jerarquía, ritmo de secciones, movimiento contenido), no su estilo. *(Supuesto: este borrador no incluye un análisis en vivo de esos sitios; puedo hacerlo antes de implementar.)*

## Diagnóstico de la tipografía (paso 1)
- Instrument Serif y DM Sans **sí se cargan**: usan `next/font/google` (autoalojadas), ambas en estado `loaded`, sin `@import`.
- **Causa del aspecto alargado:** Instrument Serif es una serif *condensada* por diseño (letras estrechas y altas, sin eje de ancho). Con el título a ~72–92 px, `letter-spacing: normal` y `line-height` cerrado, el efecto se acentúa. No es un fallo de carga ni de `font-stretch`.
- Agravantes menores: solo se carga el peso 400 (sin cursiva) y el cuerpo no tiene `line-height` global.
- Mi primer PR escaló `html` a 112,5 % / 125 % desde 1500 / 1900 px; eso agranda, pero no deforma.

**Decisión pendiente:** (a) mantener Instrument Serif (aprobada en `docs/marca.md`) y compensar con tracking −0.02em, tamaños más contenidos, cursiva para énfasis y etiquetas DM Sans en mayúsculas con tracking; o (b) probar una serif menos condensada.
*Recomendación: (a).*

## Sistema de tokens
**Color (Paleta B, variables en `:root`)**
| Token | Hex | Uso |
|---|---|---|
| `--bg` | #F6F1EB | Fondo |
| `--linen` | #EFE4D6 | Secciones alternas |
| `--wheat` | #D9C3A5 | Solo decorativo, nunca texto |
| `--accent` | #A4502F | Acento / botones (hover #8A4226) |
| `--sage` | #5F6E55 | Apoyo, estados |
| `--ink` | #2B211C | Texto y fondos oscuros |
| `--ink-2` | #5A4A40 | Texto secundario |

Contraste (cálculo aproximado, *supuesto* hasta medirlo con herramienta): café/fondo ≈14:1, terracota/fondo ≈5:1, `--ink-2`/fondo >7:1. **Aviso:** salvia sobre lino queda ≈4,3:1 (< 4,5), así que salvia solo como texto sobre `--bg` o como elemento no textual.

**Tipografía**
- Display: Instrument Serif, `letter-spacing: -0.02em`, `line-height: 1.0–1.05`, escala con `clamp()`.
- Cuerpo: DM Sans 16–18 px (`clamp(1rem, …, 1.125rem)`), `line-height: 1.6`.
- Etiquetas: DM Sans 12–13 px, mayúsculas, tracking 0.12em.
- Sin tamaños en px fijos.

**Rejilla y espacio**
- 12 columnas, contenedor máximo **1440 px**, márgenes fluidos con `clamp()`. Fondos de sección a sangre completa.
- Espaciado en escala de 8 px; ritmo vertical entre secciones constante.
- *(Cambio frente al primer PR: se retira el escalado de `html` y el contenedor de 92 rem; en 1920 y 2560 el contenido se queda en 1440 y crecen los márgenes.)*

**Detalles de arquitectura**
- Numeración **01 — 06**: Hero, Servicios, Cómo trabajo, Proyectos, Sobre mí, Contacto.
- Hairlines de 1 px (`--ink` al 20–40 %) como separadores y estructura.
- Grano SVG (`feTurbulence`) al 3–4 % solo en fondos claros. Sin sombras pesadas.
- Fotos con arco superior y proporción fija (4:5 o 3:4). Placeholders en trigo hasta tener fotos reales.
- Composición asimétrica (columnas desiguales, títulos desplazados) en lugar de tarjetas genéricas.

## Movimiento
- **Librería: Motion** (ya instalada): API declarativa, `whileInView` y `useScroll`, y respeta `prefers-reduced-motion`.
- Easing `cubic-bezier(0.22, 1, 0.36, 1)`. Entradas 600–900 ms con escalonado de 60–90 ms; hovers 200–300 ms.
- Scroll: revelados suaves, líneas que se dibujan (`scaleX` de 0 a 1), parallax leve en fotos (≤ 8 %).
- Hover: subrayado que crece, imagen que escala 1.03 en ~600 ms, flecha que se desplaza en botones.
- `:focus-visible` visible en todo elemento interactivo; reduced-motion deja solo fundidos.

## Stack (propuesta única)
- **Tailwind + shadcn/ui: no recomendado.** Obligaría a reescribir todo el CSS y a reconfigurar la paleta, con riesgo de alejarse de los tableros. Se mantiene CSS propio con tokens.
- **Motion y dnd-kit: sí**, ya instalados en la rama `feat/frontend-fluido` (kanban con arrastrar y soltar). No se instala nada nuevo.

## Alcance
- Estructura aprobada de la landing intacta: Hero, Servicios (Asesoría, Proyecto de diseño, Llave en mano), Cómo trabajo (5 pasos), Proyectos, Sobre mí y Contacto.
- Sin cambios de textos, precios ni plazos; `[Nombre del estudio]` sigue como marcador.
- **No se toca backend ni Supabase** en esta fase.
- La app interna (`/app`) hereda tokens y tipografía; no se rediseña su estructura.

## Fases (un commit por fase)
1. **Tokens y tipografía:** `:root`, escala fluida, `next/font` (con cursiva), grano, hairlines, retirada del escalado de `html`.
2. **Landing:** composición asimétrica, numeración, arcos, sustitución de tarjetas.
3. **Movimiento:** entradas, líneas, parallax, hovers y foco.
4. **App interna:** alineación con tokens (sin cambiar estructura).
5. **Responsive y entrega:** 390, 768, 1440, 1920 y 2560 px; capturas en `design/capturas/` (antes y después) y agente `revision-diseno`.

## Preguntas para confirmar
1. ¿Mantener Instrument Serif con compensaciones (a) o probar otra serif (b)?
2. ¿Contenedor máximo de 1440 px aun si en 2560 quedan márgenes amplios?
3. ¿Sigo en la rama `feat/frontend-fluido` (mismo PR) o abro rama nueva para esta fase?
4. ¿Hago antes el análisis de los referentes?
