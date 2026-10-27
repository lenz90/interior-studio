# interior-studio

Web y espacio de trabajo de un estudio de diseño de interiores de una sola persona.

- **Landing pública** con formulario de contacto (las solicitudes llegan al panel).
- **App interna** (`/app`): Panel, Proyectos con flujo de 9 etapas, Clientes, Finanzas y Tareas del negocio (kanban).

## Desarrollo local
```bash
cp .env.example .env.local   # completa la clave publicable de Supabase
npm install
npm run dev
```

## Despliegue
Vercel despliega automáticamente cada push a `main`. Las ramas generan vistas previas.

## Primer acceso
Entra a `/login` → "Crear cuenta". La primera cuenta queda como dueña del estudio.
