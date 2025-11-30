-- ========================================
-- SQL DE PRUEBA PARA CU04 - RESERVAR HABITACIÓN
-- Base de datos: disenodb (PostgreSQL)
-- ========================================

-- 1. LIMPIAR DATOS EXISTENTES
TRUNCATE TABLE reserva_habitaciones CASCADE;
TRUNCATE TABLE reserva CASCADE;
TRUNCATE TABLE habitacion CASCADE;

-- 2. INSERTAR HABITACIONES DE PRUEBA
-- Habitaciones INDIVIDUALES ESTÁNDAR
INSERT INTO habitacion (numero, tipo_habitacion, estado, capacidad, valor_por_noche, descripcion, hora_salida) VALUES
(101, 'INDIVIDUAL_ESTANDAR', 'DISPONIBLE', 1, 5000.00, 'Habitación individual con baño privado', '10:00:00'),
(102, 'INDIVIDUAL_ESTANDAR', 'DISPONIBLE', 1, 5000.00, 'Habitación individual con baño privado', '10:00:00'),
(103, 'INDIVIDUAL_ESTANDAR', 'DISPONIBLE', 1, 5000.00, 'Habitación individual con baño privado', '10:00:00');

-- Habitaciones DOBLES ESTÁNDAR
INSERT INTO habitacion (numero, tipo_habitacion, estado, capacidad, valor_por_noche, descripcion, hora_salida) VALUES
(201, 'DOBLE_ESTANDAR', 'DISPONIBLE', 2, 7500.00, 'Habitación doble con dos camas', '10:00:00'),
(202, 'DOBLE_ESTANDAR', 'DISPONIBLE', 2, 7500.00, 'Habitación doble con dos camas', '10:00:00'),
(203, 'DOBLE_ESTANDAR', 'DISPONIBLE', 2, 7500.00, 'Habitación doble con dos camas', '10:00:00');

-- Habitaciones DOBLES SUPERIOR
INSERT INTO habitacion (numero, tipo_habitacion, estado, capacidad, valor_por_noche, descripcion, hora_salida) VALUES
(301, 'DOBLE_SUPERIOR', 'DISPONIBLE', 2, 10000.00, 'Habitación doble superior con vista', '10:00:00'),
(302, 'DOBLE_SUPERIOR', 'DISPONIBLE', 2, 10000.00, 'Habitación doble superior con vista', '10:00:00');

-- Habitaciones SUPERIOR FAMILY PLAN
INSERT INTO habitacion (numero, tipo_habitacion, estado, capacidad, valor_por_noche, descripcion, hora_salida) VALUES
(401, 'SUPERIOR_FAMILY_PLAN', 'DISPONIBLE', 4, 15000.00, 'Habitación familiar con 2 camas dobles', '10:00:00'),
(402, 'SUPERIOR_FAMILY_PLAN', 'DISPONIBLE', 4, 15000.00, 'Habitación familiar con 2 camas dobles', '10:00:00');

-- SUITES
INSERT INTO habitacion (numero, tipo_habitacion, estado, capacidad, valor_por_noche, descripcion, hora_salida) VALUES
(501, 'SUITE', 'DISPONIBLE', 2, 20000.00, 'Suite de lujo con jacuzzi', '10:00:00'),
(502, 'SUITE', 'DISPONIBLE', 2, 20000.00, 'Suite de lujo con jacuzzi', '10:00:00');

-- Habitaciones en MANTENIMIENTO (no se pueden reservar)
INSERT INTO habitacion (numero, tipo_habitacion, estado, capacidad, valor_por_noche, descripcion, hora_salida) VALUES
(104, 'INDIVIDUAL_ESTANDAR', 'MANTENIMIENTO', 1, 5000.00, 'En mantenimiento', '10:00:00'),
(204, 'DOBLE_ESTANDAR', 'MANTENIMIENTO', 2, 7500.00, 'En mantenimiento', '10:00:00');

-- 3. INSERTAR RESERVAS DE PRUEBA

-- Reserva 1: Habitación 101 reservada del 05/12 al 10/12 (sin check-in = RESERVADA)
INSERT INTO reserva (fecha_inicio, fecha_fin, checked_in, apellido, nombre, telefono) 
VALUES ('2025-12-05', '2025-12-10', false, 'García', 'Juan', '1145678901');

INSERT INTO reserva_habitaciones (reserva_id, habitaciones_numero) 
VALUES ((SELECT MAX(id) FROM reserva), 101);

-- Reserva 2: Habitación 201 ocupada del 01/12 al 07/12 (con check-in = OCUPADA)
INSERT INTO reserva (fecha_inicio, fecha_fin, checked_in, apellido, nombre, telefono) 
VALUES ('2025-12-01', '2025-12-07', true, 'Pérez', 'María', '1156789012');

INSERT INTO reserva_habitaciones (reserva_id, habitaciones_numero) 
VALUES ((SELECT MAX(id) FROM reserva), 201);

-- Reserva 3: Habitación 301 reservada del 15/12 al 20/12 (sin check-in = RESERVADA)
INSERT INTO reserva (fecha_inicio, fecha_fin, checked_in, apellido, nombre, telefono) 
VALUES ('2025-12-15', '2025-12-20', false, 'López', 'Carlos', '1167890123');

INSERT INTO reserva_habitaciones (reserva_id, habitaciones_numero) 
VALUES ((SELECT MAX(id) FROM reserva), 301);

-- Reserva 4: Múltiples habitaciones (401 y 402) del 20/12 al 25/12 (RESERVADA)
INSERT INTO reserva (fecha_inicio, fecha_fin, checked_in, apellido, nombre, telefono) 
VALUES ('2025-12-20', '2025-12-25', false, 'Rodríguez', 'Ana', '1178901234');

INSERT INTO reserva_habitaciones (reserva_id, habitaciones_numero) 
VALUES 
    ((SELECT MAX(id) FROM reserva), 401),
    ((SELECT MAX(id) FROM reserva), 402);

-- Reserva 5: Suite 501 ocupada todo diciembre (OCUPADA)
INSERT INTO reserva (fecha_inicio, fecha_fin, checked_in, apellido, nombre, telefono) 
VALUES ('2025-12-01', '2025-12-31', true, 'Martínez', 'Luis', '1189012345');

INSERT INTO reserva_habitaciones (reserva_id, habitaciones_numero) 
VALUES ((SELECT MAX(id) FROM reserva), 501);

-- 4. VERIFICAR DATOS INSERTADOS
SELECT 'HABITACIONES DISPONIBLES:' as info;
SELECT numero, tipo_habitacion, estado, capacidad, valor_por_noche 
FROM habitacion 
WHERE estado = 'DISPONIBLE'
ORDER BY tipo_habitacion, numero;

SELECT 'HABITACIONES EN MANTENIMIENTO:' as info;
SELECT numero, tipo_habitacion, estado 
FROM habitacion 
WHERE estado = 'MANTENIMIENTO';

SELECT 'RESERVAS ACTIVAS:' as info;
SELECT r.id, r.apellido, r.nombre, r.telefono, r.fecha_inicio, r.fecha_fin, r.checked_in,
       STRING_AGG(rh.habitaciones_numero::TEXT, ', ') as habitaciones
FROM reserva r
LEFT JOIN reserva_habitaciones rh ON r.id = rh.reserva_id
GROUP BY r.id, r.apellido, r.nombre, r.telefono, r.fecha_inicio, r.fecha_fin, r.checked_in
ORDER BY r.fecha_inicio;

-- ========================================
-- CASOS DE PRUEBA RECOMENDADOS:
-- ========================================

/*
CASO 1 - Reserva exitosa de habitación disponible:
- Buscar: 01/12/2025 - 10/12/2025
- Seleccionar: Habitación 102 (DISPONIBLE en todo el rango)
- Datos: Apellido="Gómez", Nombre="Pedro", Teléfono="1190123456"
- Resultado esperado: ✅ Reserva creada exitosamente

CASO 2 - Intento de reservar habitación OCUPADA:
- Buscar: 01/12/2025 - 10/12/2025
- Intentar seleccionar: Habitación 201 (OCUPADA del 01 al 07)
- Resultado esperado: ⚠️ No permite selección (celda roja)

CASO 3 - Intento de reservar habitación RESERVADA:
- Buscar: 05/12/2025 - 12/12/2025
- Intentar seleccionar: Habitación 101 (RESERVADA del 05 al 10)
- Resultado esperado: ⚠️ No permite selección (celda morada)

CASO 4 - Reserva de múltiples habitaciones:
- Buscar: 10/12/2025 - 15/12/2025
- Seleccionar: Habitaciones 202, 203, 302 (todas DISPONIBLES)
- Datos: Apellido="Fernández", Nombre="Laura", Teléfono="1101234567"
- Resultado esperado: ✅ Reserva de 3 habitaciones exitosa

CASO 5 - Campos obligatorios vacíos:
- Seleccionar habitación disponible
- Dejar "Nombre" vacío
- Resultado esperado: ⚠️ Error "El nombre es obligatorio"

CASO 6 - Teléfono inválido:
- Seleccionar habitación disponible
- Teléfono: "123" (menos de 6 dígitos)
- Resultado esperado: ⚠️ Error "El teléfono debe tener entre 6 y 15 dígitos"

CASO 7 - Cancelar reserva:
- Seleccionar habitaciones
- Presionar RECHAZAR
- Resultado esperado: ✅ Grilla vuelve a estado original

CASO 8 - Período navideño (alta ocupación):
- Buscar: 20/12/2025 - 31/12/2025
- Ver que 401, 402 están RESERVADAS (20-25)
- Ver que 501 está OCUPADA (todo el mes)
- Seleccionar: Habitación 502 (DISPONIBLE)
- Resultado esperado: ✅ Reserva exitosa

CASO 9 - Fecha hasta anterior a fecha desde:
- Desde: 15/12/2025
- Hasta: 10/12/2025
- Resultado esperado: ⚠️ Error "La fecha hasta debe ser posterior a la fecha desde"

CASO 10 - Habitaciones en mantenimiento:
- Buscar: 01/12/2025 - 10/12/2025
- Ver habitaciones 104 y 204 en color GRIS (MANTENIMIENTO)
- No se pueden seleccionar
- Resultado esperado: ✅ No permite selección
*/

-- ========================================
-- CONSULTAS ÚTILES PARA DEBUGGING:
-- ========================================

-- Ver todas las reservas con sus habitaciones:
-- SELECT r.id, r.apellido, r.nombre, r.fecha_inicio, r.fecha_fin, r.checked_in,
--        h.numero as habitacion, h.tipo_habitacion
-- FROM reserva r
-- JOIN reserva_habitaciones rh ON r.id = rh.reserva_id
-- JOIN habitacion h ON h.numero = rh.habitaciones_numero
-- ORDER BY r.fecha_inicio, h.numero;

-- Ver habitaciones disponibles en un rango de fechas:
-- SELECT h.numero, h.tipo_habitacion, h.estado
-- FROM habitacion h
-- WHERE h.estado = 'DISPONIBLE'
--   AND h.numero NOT IN (
--     SELECT rh.habitaciones_numero
--     FROM reserva r
--     JOIN reserva_habitaciones rh ON r.id = rh.reserva_id
--     WHERE r.fecha_inicio <= '2025-12-10'
--       AND r.fecha_fin >= '2025-12-01'
--   )
-- ORDER BY h.tipo_habitacion, h.numero;

-- Ver ocupación del día específico:
-- SELECT h.numero, h.tipo_habitacion,
--        CASE
--          WHEN EXISTS (
--            SELECT 1 FROM reserva r
--            JOIN reserva_habitaciones rh ON r.id = rh.reserva_id
--            WHERE rh.habitaciones_numero = h.numero
--              AND r.fecha_inicio <= '2025-12-05'
--              AND r.fecha_fin >= '2025-12-05'
--              AND r.checked_in = true
--          ) THEN 'OCUPADA'
--          WHEN EXISTS (
--            SELECT 1 FROM reserva r
--            JOIN reserva_habitaciones rh ON r.id = rh.reserva_id
--            WHERE rh.habitaciones_numero = h.numero
--              AND r.fecha_inicio <= '2025-12-05'
--              AND r.fecha_fin >= '2025-12-05'
--              AND r.checked_in = false
--          ) THEN 'RESERVADA'
--          ELSE h.estado::TEXT
--        END as estado_real
-- FROM habitacion h
-- ORDER BY h.tipo_habitacion, h.numero;
