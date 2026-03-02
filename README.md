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

## Variables de entorno

Crea un archivo `.env.local` con:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## Desarrollo

Instala dependencias y ejecuta:

```
npm install
npm run dev
```

## Notas

- El número de WhatsApp configurado está en `src/app/carrito/page.tsx`.
- La moneda está formateada a CLP en `src/lib/format.ts`.
- Para desplegar, usa Vercel con las mismas variables de entorno.

## Estado y roadmap técnico

- Revisa `docs/PROJECT_STATUS_AND_ROADMAP.md` para el estado actual, riesgos y plan de mejora por sprints.
