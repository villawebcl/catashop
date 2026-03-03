# Catashop Work Continuity

## Estado actual (marzo 2026)
- CI en verde.
- E2E Staging en verde.
- E2E Production en verde.
- E2E Checkout Real en verde.
- Observability Smoke en verde.
- Baseline etiquetada: `v1.0.0-hardening`.

## Lo que ya se profesionalizo
1. Seguridad de pedidos (RPC segura + total server-side).
2. RLS admin real para productos/pedidos/storage.
3. Flujo carrito -> pedido -> WhatsApp estable.
4. Confirmacion de venta admin con descuento de stock transaccional.
5. Hardening web y rollout CSP compatible (nonce en Report-Only).
6. Observabilidad basica con alerta por rafaga.
7. Suite de tests y workflows por entorno.
8. SEO tecnico base y mejoras de performance en UI.

## Workflows disponibles
- `CI` (automatico en push/PR a main).
- `E2E Staging` (manual).
- `E2E Production` (manual).
- `E2E Checkout Real` (manual).
- `Observability Smoke` (manual).

## Variables clave
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `CSP_ENFORCE_NONCE`
- `NEXT_PUBLIC_OBSERVABILITY_ENABLED`
- `OBSERVABILITY_WEBHOOK_URL`
- `OBSERVABILITY_WEBHOOK_TOKEN`
- `OBS_ALERT_THRESHOLD`

## Como retomar trabajo sin perder contexto
1. Leer `docs/APP_CONTEXT.md`.
2. Leer `docs/PROJECT_STATUS_AND_ROADMAP.md`.
3. Revisar `docs/OPERATIONS_RUNBOOK.md`.
4. Revisar ultimos commits en `main`.
5. Correr `CI` antes de mergear cambios relevantes.

## Proximo backlog sugerido
- P0: pipeline de reportes CSP (`report-uri` / `report-to`) con ingestion/alerta.
- P1: E2E admin real controlado con dataset QA aislado.
- P1: performance budget por ruta en CI.
- P2: mejoras de accesibilidad avanzada y auditoria automatica.
