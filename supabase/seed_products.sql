-- Seed de productos ficticios para pruebas locales / QA.
-- Seguro para re-ejecutar: primero elimina solo productos de seed (code LIKE 'SEED-%').

delete from public.products
where code like 'SEED-%';

insert into public.products (
  readable_id,
  name,
  price,
  stock,
  category,
  code,
  detail,
  image_url,
  is_featured,
  is_offer
)
values
  ('SEED001', 'Set de Contenedores Herméticos', 12990, 18, 'Cocina', 'SEED-001', 'Pack de 5 contenedores de distintos tamaños.', null, true, false),
  ('SEED002', 'Lámpara LED Escritorio', 15990, 9, 'Tecnología', 'SEED-002', 'Luz regulable con cuello flexible y puerto USB.', null, true, true),
  ('SEED003', 'Organizador Multiuso 3 Niveles', 11990, 14, 'Hogar', 'SEED-003', 'Ideal para baño, cocina o escritorio.', null, false, false),
  ('SEED004', 'Mochila Escolar Impermeable', 24990, 7, 'Escolar', 'SEED-004', 'Compartimentos amplios y cierre reforzado.', null, false, true),
  ('SEED005', 'Kit Jardín Inicial', 18990, 11, 'Jardín', 'SEED-005', 'Incluye pala, rastrillo, tijera y guantes.', null, true, false),
  ('SEED006', 'Difusor Aromático 300ml', 13990, 16, 'Decoración', 'SEED-006', 'Humidificador ultrasónico con luz ambiental.', null, false, false),
  ('SEED007', 'Cepillo Removedor de Pelos', 7990, 30, 'Mascotas', 'SEED-007', 'Remueve pelo de ropa y muebles sin adhesivo.', null, false, true),
  ('SEED008', 'Botella Térmica 1L', 10990, 22, 'Cuidado personal', 'SEED-008', 'Mantiene temperatura hasta 12 horas.', null, false, false),
  ('SEED009', 'Set de Tazas Cerámica x4', 16990, 10, 'Regalos', 'SEED-009', 'Diseño minimalista, ideal para regalo.', null, true, false),
  ('SEED010', 'Cinta LED RGB 5m', 9990, 20, 'Tecnología', 'SEED-010', 'Control remoto y modos de color dinámicos.', null, false, true),
  ('SEED011', 'Canasto de Ropa Plegable', 8990, 25, 'Hogar', 'SEED-011', 'Estructura liviana y resistente.', null, false, false),
  ('SEED012', 'Tabla de Corte Bambú', 6990, 28, 'Cocina', 'SEED-012', 'Superficie antibacteriana natural.', null, false, false);
