-- ============================================================
-- migration_roles.sql
-- Añade la columna 'rol' a la tabla usuarios para soportar
-- el sistema de roles ROLE_ADMIN / ROLE_USER.
-- Ejecutar una sola vez sobre la BD existente.
-- ============================================================

ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS rol VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER';

-- Asignar ROLE_ADMIN al usuario administrador
UPDATE usuarios
SET rol = 'ROLE_ADMIN'
WHERE nombre = 'admin';
