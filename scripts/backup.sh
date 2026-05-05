#!/usr/bin/env bash
# ============================================================
# backup.sh — Copia de seguridad de la base de datos Optibase
# Uso: ./backup.sh
# ============================================================

set -euo pipefail

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-optibase_db}"
DB_USER="${DB_USER:-root}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${SCRIPT_DIR}/backups"

# Crear carpeta de backups si no existe
mkdir -p "${BACKUP_DIR}"

# Generar timestamp
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/optibase_${TIMESTAMP}.sql"

# Pedir contraseña de forma interactiva
read -rsp "Introduce la contrasena de MySQL para el usuario ${DB_USER}: " DB_PASS
echo

echo ""
echo "Iniciando backup de la base de datos ${DB_NAME}..."
echo "Destino: ${BACKUP_FILE}"
echo ""

if mysqldump \
    --host="${DB_HOST}" \
    --port="${DB_PORT}" \
    --user="${DB_USER}" \
    --password="${DB_PASS}" \
    --single-transaction \
    --add-drop-table \
    --routines \
    --triggers \
    "${DB_NAME}" > "${BACKUP_FILE}"; then
    echo "[OK] Backup completado correctamente: ${BACKUP_FILE}"
else
    echo "[ERROR] El backup fallo" >&2
    rm -f "${BACKUP_FILE}"
    exit 1
fi
