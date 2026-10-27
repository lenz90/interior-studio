---
name: responsive-qa
description: Checklist de responsive y capturas de interior-studio. Leer solo al cerrar un cambio visual.
---

# Responsive QA

1. Anchos: 390, 768, 1440, 1920, 2560. Sin scroll horizontal (`scrollWidth === clientWidth`), sin contenedores de ancho fijo.
2. Objetivos táctiles ≥ 44 px; foco visible; contraste ≥ 4,5:1.
3. Capturas en `design/capturas/` como `<pagina>-<ancho>-antes|despues.png`.
4. Pasar el agente `revision-diseno` con el diff como contexto (no todo el repo).
