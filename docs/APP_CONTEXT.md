# Catashop App Context

## Que es Catashop
- Catashop es una tienda/catalogo web.
- La compra se coordina por WhatsApp (no hay pago online dentro del sitio).
- El flujo principal es: explorar productos -> carrito -> registrar pedido -> abrir WhatsApp.

## Objetivo del producto
- Mostrar productos con stock y precio actualizados.
- Permitir que clientes armen su pedido rapido.
- Dar al admin control para gestionar productos y pedidos.
- Mantener seguridad y operacion profesional en produccion.

## Flujo principal (cliente)
1. Usuario navega `/productos` o `/ofertas`.
2. Agrega items al carrito (`localStorage`, key `aurora-cart`).
3. En `/carrito` completa datos de envio.
4. La app llama RPC `create_order_secure` en Supabase.
5. Si se registra el pedido, abre `wa.me` en nueva pestana con mensaje formateado.

## Flujo principal (admin)
1. Admin entra a `/admin`.
2. Gestiona catalogo (`products`).
3. Revisa pedidos (`orders`).
4. Marca pedido vendido con RPC `mark_order_sold_secure` (descuenta stock de forma transaccional).

## Stack tecnico
- Frontend: Next.js App Router + React + TypeScript + Tailwind.
- Backend de datos: Supabase (Postgres + Auth + Storage + RPC).
- CI/CD: GitHub Actions + Vercel.
- Tests: Node test runner (unit) + Playwright (E2E/smoke).

## Fuentes de verdad
- Productos: tabla `public.products`.
- Pedidos: tabla `public.orders`.
- Stock/precio final de pedido: calculado en backend por `create_order_secure`.

## Seguridad clave implementada
- RLS + helper `public.is_admin()` para operaciones sensibles.
- RPC seguras para crear pedido y marcar venta.
- CSP y headers de seguridad.
- Observabilidad con redaccion basica y rate limit.

## Entornos
- Local: desarrollo y depuracion.
- Staging: validaciones reales pre-produccion.
- Production: dominio publico del negocio.

## Regla operativa importante
- Cambios incrementales, en commits pequenos, sin romper funcionalidad existente.
