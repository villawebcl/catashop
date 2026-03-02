# Catashop - E-commerce minimalista

E-commerce minimalista con compra por WhatsApp, variedad de productos y gestión en Supabase.

## Requisitos

- Node.js 18+
- Proyecto de Supabase configurado

## Configuración de Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta el script `supabase/schema.sql` en el SQL Editor.
3. Verifica que exista el bucket `products` y que sea público.
4. Crea un usuario administrador (Auth → Users) para acceder al panel `/admin`.
5. Marca ese usuario como admin ejecutando en SQL Editor:

```
insert into public.admin_users (user_id)
values ('<UUID_DEL_USUARIO_AUTH>')
on conflict (user_id) do nothing;
```

Si ya tenías el proyecto corriendo antes de estos cambios de seguridad, aplica además:

```
-- Ejecuta el contenido de:
supabase/policies.sql
```

## Seed de productos ficticios (QA)

Para poblar catálogo rápidamente con datos de prueba, ejecuta en SQL Editor:

```
-- Ejecuta el contenido de:
supabase/seed_products.sql
```

Este seed:
- inserta 12 productos ficticios;
- usa `code` con prefijo `SEED-`;
- es idempotente (borra e inserta solo registros `SEED-*`).

## Variables de entorno

Crea un archivo `.env.local` con:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_OBSERVABILITY_ENABLED=false
OBSERVABILITY_WEBHOOK_URL=
OBSERVABILITY_WEBHOOK_TOKEN=
```

Tip: puedes copiar la plantilla base:

```
cp .env.example .env.local
```

## Desarrollo

Instala dependencias y ejecuta:

```
npm install
npm run dev
```

## Scripts útiles

- `npm run lint`: reglas ESLint
- `npm run typecheck`: chequeo de tipos TypeScript
- `npm run format`: autocorrección con ESLint
- `npm run test`: tests unitarios base (Node test runner + TypeScript)
- `npm run e2e`: smoke e2e (Playwright)
- `npm run e2e:headed`: smoke e2e en modo visible
- `npm run e2e:install`: instala browser Chromium para Playwright
- `npm run build`: build de producción
- `npm run check`: lint + typecheck + build

## CI

- Se incluye pipeline en `.github/workflows/ci.yml` con:
  - instalación (`npm ci`)
  - lint
  - typecheck
  - build
  - smoke e2e Playwright (`chromium`)

## Seguridad de pedidos

- El checkout usa la función SQL `create_order_secure` para:
  - recalcular totales desde precios de base de datos;
  - normalizar items del pedido;
  - aplicar rate limit básico por `client_key`.
- La acción de admin para vender una orden usa `mark_order_sold_secure`:
  - lock transaccional de orden y productos;
  - validación de stock suficiente antes de descontar;
  - actualización atómica de stock + estado de orden.
- El insert directo público en `orders` quedó deshabilitado por RLS.
- Existe smoke test del flujo de checkout hacia `wa.me` en `tests/checkout-smoke.test.ts`.
- E2E Playwright incluye:
  - checkout -> popup WhatsApp;
  - admin login + marcado de orden vendida (RPC mockeada).

## Logging

- Usa `src/lib/logger.ts` para trazas de error/advertencia con redacción básica de email/teléfono.

## Observabilidad

- Endpoint interno: `POST /api/observability`.
- Activación cliente: `NEXT_PUBLIC_OBSERVABILITY_ENABLED=true` (solo recomendado en producción).
- Si defines `OBSERVABILITY_WEBHOOK_URL`, los eventos `warn/error` se reenvían allí.
- Si además defines `OBSERVABILITY_WEBHOOK_TOKEN`, se envía en `Authorization: Bearer <token>`.
- Incluye rate limit básico por IP para evitar abuso.

## Seguridad de Storage

- Las políticas de `storage.objects` del bucket `products` ahora usan `public.is_admin()` para upload/update/delete.

## CSP hardening

- `script-src` no permite `unsafe-eval`.
- `unsafe-inline` se mantiene habilitado por compatibilidad con runtime de Next.js.
- Próxima fase recomendada: nonce/hash strategy para retirar `unsafe-inline` sin romper hidratación.

## Notas

- El número de WhatsApp configurado está en `src/app/carrito/page.tsx`.
- La moneda está formateada a CLP en `src/lib/format.ts`.
- Para desplegar, usa Vercel con las mismas variables de entorno.

## Estado y roadmap técnico

- Revisa `docs/PROJECT_STATUS_AND_ROADMAP.md` para el estado actual, riesgos y plan de mejora por sprints.
