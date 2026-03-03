# Catashop Operations Runbook

## Observability

### Variables
- `NEXT_PUBLIC_OBSERVABILITY_ENABLED=true`: habilita envío de `warn/error` desde navegador a `/api/observability`.
- `OBSERVABILITY_WEBHOOK_URL`: destino HTTP para eventos y alertas.
- `OBSERVABILITY_WEBHOOK_TOKEN`: bearer token opcional del webhook.
- `OBS_ALERT_THRESHOLD=20`: cantidad de errores iguales en 5 minutos para disparar alerta.

### Tipos de eventos enviados
- `type: "event"`: evento individual (`warn` o `error`).
- `type: "alert"`: alerta de ráfaga de errores (`error_burst_threshold_reached`).

### Verificación rápida
1. Levantar app con observabilidad habilitada.
2. Generar un `logger.error(...)` manual.
3. Confirmar recepción en el webhook.
4. Repetir error >= `OBS_ALERT_THRESHOLD` dentro de 5 min y verificar `type: "alert"`.

### Smoke automatizado
- Workflow: `.github/workflows/observability-smoke.yml`.
- Input `target`:
  - `staging` usa secret `STAGING_BASE_URL`.
  - `production` usa secret `PRODUCTION_BASE_URL`.
- Resultado esperado: `Observability smoke OK` y status `204`.
- Verificación adicional: revisar en tu destino `OBSERVABILITY_WEBHOOK_URL` que llegue `type: "event"` con `source: "catashop-web"`.

## CSP Nonce Rollout

### Variables
- `CSP_ENFORCE_NONCE=false` (por defecto): modo compatible (`script-src 'unsafe-inline'`).
- `CSP_ENFORCE_NONCE=true`: activa política nonce en `Content-Security-Policy-Report-Only` (rollout seguro).

### Procedimiento recomendado
1. Activar primero en staging con `CSP_ENFORCE_NONCE=true`.
2. Ejecutar workflow `E2E Staging` con input `expect_nonce_csp=true`.
3. Validar home, productos, carrito, admin, checkout y popup WhatsApp.
4. Verificar en headers que exista `content-security-policy-report-only` con `script-src 'self' 'nonce-...`.
5. Si todo pasa, activar en producción y ejecutar `E2E Production`.

### Rollback inmediato
1. Cambiar `CSP_ENFORCE_NONCE=false`.
2. Redeploy.

## E2E

### CI pull requests
- Job `e2e-smoke` ejecuta Playwright con mocks (`checkout` y `admin`).

### Staging real (manual)
- Workflow: `.github/workflows/e2e-staging.yml`.
- Requiere secret `STAGING_BASE_URL`.
- Ejecuta smoke browser sin mocks contra staging.
- Input opcional `expect_nonce_csp=true` valida header CSP en modo nonce estricto.
- Input opcional `expect_nonce_csp=true` valida presencia de nonce en headers CSP/Report-Only.

### Checkout real no destructivo (manual)
- Workflow: `.github/workflows/e2e-checkout-real.yml`.
- Requiere secret `STAGING_BASE_URL`.
- Valida carga de productos, agregado al carrito y apertura de formulario de envío sin enviar orden.

### Produccion real (manual)
- Workflow: `.github/workflows/e2e-production.yml`.
- Requiere secret `PRODUCTION_BASE_URL` (ejemplo: `https://catashop.cl` o dominio canonico productivo).
- Ejecuta smoke browser sin mocks contra produccion.
- Input por defecto `expect_nonce_csp=true` valida header CSP en modo nonce estricto.
- Input por defecto `expect_nonce_csp=true` valida presencia de nonce en headers CSP/Report-Only.
- Nota: en algunos runners/edges, ciertos headers pueden no estar expuestos al test. En ese caso se valida nonce por señal disponible y se recomienda confirmacion manual en navegador (`Network -> / -> content-security-policy`).
