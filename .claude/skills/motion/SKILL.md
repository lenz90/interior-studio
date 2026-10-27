---
name: motion
description: Lenguaje de movimiento de interior-studio (Motion). Leer solo al añadir o cambiar animaciones, hovers o efectos de scroll.
---

# Movimiento

- Librería: **Motion** (`motion/react`). Easing único `cubic-bezier(0.22, 1, 0.36, 1)`.
- Entradas 600–900 ms con escalonado de 60–90 ms; hovers 200–300 ms.
- **Nada de "una sola vez y estático"**: combinar revelados que se repiten (`viewport={{ once: false, amount: 0.3 }}`) con movimiento atado al scroll (`useScroll` + `useTransform`): parallax ≤ 8 %, líneas que se dibujan con el avance, texto que cambia de opacidad/posición con el progreso.
- Hovers: subrayado que crece, imagen `scale(1.03)` lenta, flecha que se desplaza.
- Todo componente animado usa `useReducedMotion` (solo fundidos). Foco con `:focus-visible`.
- Componentes reutilizables en `src/components/motion/`. No animar propiedades que provoquen layout.
