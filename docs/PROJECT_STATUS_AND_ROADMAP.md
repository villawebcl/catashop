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
- `security(db): enforce admin-only RLS via admin_users table`
  - Se reemplazó control por `authenticated` con control por `admin_users` + `is_admin()`.
- `security(db): secure order creation via RPC + anti-abuse`
  - Se agregó `create_order_secure` para recalcular total server-side.
  - Insert público directo en `orders` quedó deshabilitado.
  - Se añadió rate limit básico por `client_key` en `order_request_log`.
- `security: route checkout through secure order RPC`
  - El checkout ahora persiste pedido con `create_order_secure` antes de abrir WhatsApp.
- `perf(a11y): optimize product images and improve modal/cart accessibility`
  - Se migró a `next/image` en flujos críticos con fallback controlado.
  - Se mejoró focus handling del modal y etiquetado de cantidad en carrito.
- `ops: add CI workflow and global error boundary`
  - Se agregó pipeline de calidad en GitHub Actions.
  - Se añadió `src/app/error.tsx` para manejo global de errores en runtime.
- `test: add baseline unit tests for checkout, message format and order payload`
  - Suite mínima sin dependencias externas (`node:test` + compilación TS dedicada).
  - CI ahora ejecuta `npm run test` además de lint/typecheck/build.
- `test: add checkout smoke for wa.me flow`
  - Se agregó smoke test del armado de URL de checkout por WhatsApp.
- `test(e2e): add Playwright smoke for admin login and sold flow`
  - Se agregó cobertura browser del panel admin con marcado de orden vendida.
- `ops: add centralized logger with basic redaction`
  - Se reemplazaron errores críticos por `logger` para trazabilidad consistente.
- `ops: add observability ingest endpoint and webhook forwarding`
  - Nuevo endpoint `/api/observability` con rate limit por IP.
  - `logger` envía `warn/error` en producción cuando se habilita por env.
- `ops: add error burst alerting and operations runbook`
  - Se agregó umbral de alerta por ráfaga de errores (`OBS_ALERT_THRESHOLD`).
  - Runbook operativo para observabilidad, CSP rollout y e2e staging.
- `security(csp): add nonce rollout strategy via middleware`
  - CSP dinámica por request en middleware con `x-nonce` y toggle `CSP_ENFORCE_NONCE`.
- `test(e2e): add staging real smoke path`
  - Workflow manual `e2e-staging` con `STAGING_BASE_URL` por secret.
- `security(storage): lock write policies to public.is_admin()`
  - Upload/update/delete de imágenes en bucket `products` ahora exige admin real.
- `security(orders): transactional mark sold via RPC`
  - Se agregó `mark_order_sold_secure` para descontar stock y cerrar orden de forma atómica.
  - El panel admin dejó de hacer descuento de stock en loop desde cliente.

## Próximos pasos inmediatos
1. Ejecutar `E2E Production` con validacion nonce (`expect_nonce_csp=true`) y dejar evidencia de release.
2. Conectar webhook de observabilidad a herramienta de alertas (Slack/PagerDuty/Email).
3. Expandir e2e real para incluir checkout controlado con dataset aislado de pruebas.
