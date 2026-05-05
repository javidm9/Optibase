@echo off
:: ============================================================
:: backup.bat — Copia de seguridad de la base de datos Optibase
:: Uso: backup.bat
:: ============================================================

SET DB_HOST=localhost
SET DB_PORT=3306
SET DB_NAME=optibase_db
SET DB_USER=root
SET BACKUP_DIR=%~dp0backups

:: Crear carpeta de backups si no existe
IF NOT EXIST "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
)

:: Generar timestamp
FOR /F "tokens=1-6 delims=/:. " %%A IN ("%DATE% %TIME%") DO (
    SET YYYY=%%C
    SET MM=%%B
    SET DD=%%A
    SET HH=%%D
    SET MIN=%%E
    SET SS=%%F
)

:: Normalizar con ceros si hace falta (formato local puede variar)
SET TIMESTAMP=%YYYY%%MM%%DD%_%HH%%MIN%%SS%
SET TIMESTAMP=%TIMESTAMP: =0%
SET BACKUP_FILE=%BACKUP_DIR%\optibase_%TIMESTAMP%.sql

:: Pedir contraseña de forma interactiva
SET /P DB_PASS=Introduce la contrasena de MySQL para el usuario %DB_USER%:

echo.
echo Iniciando backup de la base de datos %DB_NAME%...
echo Destino: %BACKUP_FILE%
echo.

mysqldump ^
    --host=%DB_HOST% ^
    --port=%DB_PORT% ^
    --user=%DB_USER% ^
    --password=%DB_PASS% ^
    --single-transaction ^
    --add-drop-table ^
    --routines ^
    --triggers ^
    %DB_NAME% > "%BACKUP_FILE%"

IF %ERRORLEVEL% EQU 0 (
    echo [OK] Backup completado correctamente: %BACKUP_FILE%
) ELSE (
    echo [ERROR] El backup fallo con codigo de error %ERRORLEVEL%
    IF EXIST "%BACKUP_FILE%" DEL "%BACKUP_FILE%"
    EXIT /B 1
)
