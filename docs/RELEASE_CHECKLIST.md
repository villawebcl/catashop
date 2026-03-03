# Catashop Release Checklist

## Pre-release
1. Confirmar `main` en verde: `CI`, `E2E Staging`, `E2E Production`.
2. Verificar variables:
   - `CSP_ENFORCE_NONCE=true` en entorno objetivo.
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - `OBSERVABILITY_WEBHOOK_URL` y `OBS_ALERT_THRESHOLD`.
3. Ejecutar smoke real no destructivo:
   - Workflow `E2E Checkout Real`.
4. Confirmar dominio productivo responde:
   - `/`, `/productos`, `/carrito`.

## Release
1. Deploy de `main`.
2. Validación manual rápida:
   - agregar producto al carrito;
   - abrir formulario de envío;
   - confirmar que WhatsApp se abre en nueva pestaña.
3. Revisar panel admin:
   - carga de pedidos;
   - cambio de estado de orden.

## Post-release (30 min)
1. Revisar errores en observabilidad (`warn/error`).
2. Verificar que no existan picos de `error_burst_threshold_reached`.
3. Confirmar que stock y pedidos se registran en Supabase.

## Rollback
1. Revertir deployment en Vercel al último estable.
2. Si aplica, desactivar temporalmente CSP strict:
   - `CSP_ENFORCE_NONCE=false`.
3. Re-ejecutar `E2E Production` y validar home/productos/carrito.
