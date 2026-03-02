# Catashop: Estado Actual y Roadmap

## Estado actual (marzo 2026)
- Stack: Next.js App Router + React + TypeScript + Tailwind.
- Datos y auth: Supabase (tablas `products`, `orders`, bucket `products`).
- Checkout: el flujo termina en WhatsApp (`wa.me`) y no hay pago directo.
- Fuente de verdad de catálogo: tabla `products`.
- Carrito: estado en cliente con persistencia en `localStorage`.

## Riesgos identificados
- Integridad de pedido: total y líneas del pedido dependen del cliente.
- Seguridad de acceso admin: políticas basadas en `authenticated` sin rol admin estricto.
- Hardening web incompleto: faltan cabeceras de seguridad en Next.
- Calidad operativa: faltan tests, CI y scripts estándar de validación.

## Orden de ejecución (incremental)
1. Sprint 0 (higiene):
   - Documentación técnica y operacional.
   - Scripts de calidad (`typecheck`, `check`, `format`).
   - Alineación esquema DB con columnas usadas por la app.
2. Sprint 1 (seguridad):
   - Headers de seguridad.
   - Validación/sanitización de inputs.
   - Endurecimiento de políticas RLS y control anti-abuso.
3. Sprint 2 (calidad/performance):
   - Refactor de dominio (carrito/pedido).
   - Mejora UX del checkout por WhatsApp.
   - Ajustes de performance/SEO/a11y.
4. Sprint 3 (tests/CI):
   - Unit tests críticos + smoke e2e.
   - Pipeline CI (lint + typecheck + test + build).

## Entregables por commit
- Commits pequeños y con alcance único.
- Verificación local por cada bloque.
- Notas de rollback y criterios de aceptación por cambio.
