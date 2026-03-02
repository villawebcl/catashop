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

## Progreso ejecutado
- `docs: add project status and sprint roadmap`
  - Se agregó esta documentación y referencia en README.
- `chore: add quality scripts and env template`
  - Se añadieron scripts `typecheck`, `format`, `check` y `.env.example`.
- `fix(db): align base schema with order and product identifiers`
  - `supabase/schema.sql` ahora incluye `readable_id` y `customer_details`.
- `chore: resolve baseline lint errors without behavior changes`
  - Se removieron errores de lint críticos del baseline.
- `security: add baseline HTTP security headers and CSP`
  - Se añadieron headers de hardening en `next.config.ts`.
- `security: validate and sanitize checkout customer data`
  - Validación y saneo del checkout antes de persistir y enviar por WhatsApp.

## Próximos pasos inmediatos
1. Endurecer RLS para admin real (no solo `authenticated`).
2. Agregar anti-abuse para creación de órdenes públicas.
3. Mejorar integridad de precios/totales (recalcular server-side en Supabase).
4. Arrancar Sprint 2 con mejoras de performance (`next/image`) y accesibilidad.
