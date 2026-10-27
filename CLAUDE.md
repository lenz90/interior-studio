# interior-studio

Web pública + espacio de trabajo interno para un estudio de diseño de interiores de **una sola persona**.
Nombre comercial: **pendiente** (en la UI aparece como `[Nombre del estudio]`; cambiar en un solo lugar cuando se decida — buscar ese texto).

## Stack
- Next.js 15 (App Router, TypeScript, Server Actions), React 19, CSS plano en `src/app/globals.css` (sin Tailwind).
- Supabase (proyecto `interior-studio`, ref `fpnntpjbbwbrjpqbpvxk`, us-east-1): Postgres + Auth (email/contraseña) + RLS.
- Vercel: despliegue automático en cada push a `main`; ramas → previews.
- Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (ver `.env.example`).

## Estructura
- `src/app/page.tsx` — landing pública (estructura aprobada; no cambiar secciones sin pedirlo).
- `src/app/login` — acceso. La **primera cuenta creada** se vuelve dueña (`studio_members`, trigger en BD).
- `src/app/app/*` — app interna (protegida por middleware + RLS): Panel, Proyectos (flujo de 9 etapas), Clientes, Finanzas, Tareas del negocio (kanban).
- `src/app/app/actions.ts` — server actions. `src/components/` — componentes cliente.
- `supabase/migrations/` — esquema (fuente de verdad). Cambios de BD = nueva migración, nunca editar una ya aplicada.
- `design/` — tableros del diseño aprobado (`.dc.html`). Son la referencia visual: comparar con ellos antes de cambiar UI.
- `docs/` — contexto de negocio (marca, producto, decisiones). Leer solo lo necesario para la tarea.

## Reglas
- Idioma de la UI: español. Código y nombres de BD: inglés.
- Paleta B Terracota en variables CSS (`--bg #F6F1EB`, `--accent #A4502F`, `--ink #2B211C`, etc.). No introducir colores fuera de la paleta; contraste de texto ≥ 4.5:1.
- Tipografía: Instrument Serif (títulos) + DM Sans (texto) vía `next/font`.
- Toda tabla nueva: RLS activado + políticas con `public.is_studio_member()`.
- No inventar precios, plazos, testimonios ni fotos: usar marcadores `[ ]`.
- Trabajar en ramas y PR; `main` = producción.

## Diseño
- Cualquier cambio visual: leer `.claude/skills/frontend-design/SKILL.md` (corto, con tabla) y de ahí **solo** el skill que toque: `design-tokens`, `motion` o `responsive-qa`. No leer `docs/` ni `design/` completos.
- Dirección vigente en `design/brief.md`. Tableros `design/*.dc.html`: solo el de la página que se edita.
- Landing a medida; app interna con shadcn/ui + Tailwind tematizados con la Paleta B.
- Al terminar: `revision-diseno` con el diff (no el repo entero).

## Flujo de trabajo con agentes
Ver `.claude/agents/`. Al terminar una tarea relevante, dejar un traspaso corto (Decidido / Pendiente / Afecta a) en la descripción del PR.
