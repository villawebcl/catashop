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

## Variables de entorno

Crea un archivo `.env.local` con:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
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
- `npm run test`: placeholder temporal (pendiente suite real)
- `npm run build`: build de producción
- `npm run check`: lint + typecheck + build

## CI

- Se incluye pipeline en `.github/workflows/ci.yml` con:
  - instalación (`npm ci`)
  - lint
  - typecheck
  - build

## Seguridad de pedidos

- El checkout usa la función SQL `create_order_secure` para:
  - recalcular totales desde precios de base de datos;
  - normalizar items del pedido;
  - aplicar rate limit básico por `client_key`.
- El insert directo público en `orders` quedó deshabilitado por RLS.

## Notas

- El número de WhatsApp configurado está en `src/app/carrito/page.tsx`.
- La moneda está formateada a CLP en `src/lib/format.ts`.
- Para desplegar, usa Vercel con las mismas variables de entorno.

## Estado y roadmap técnico

- Revisa `docs/PROJECT_STATUS_AND_ROADMAP.md` para el estado actual, riesgos y plan de mejora por sprints.
