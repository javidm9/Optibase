@echo off
:: ============================================================
:: restore.bat — Restauracion de la base de datos Optibase
:: Uso: restore.bat <ruta_al_fichero.sql>
:: ============================================================

SET DB_HOST=localhost
SET DB_PORT=3306
SET DB_NAME=optibase_db
SET DB_USER=root

:: Comprobar que se ha pasado un fichero como parametro
IF "%~1"=="" (
    echo [ERROR] Debes indicar el fichero SQL a restaurar.
    echo Uso: restore.bat ^<ruta_al_fichero.sql^>
    EXIT /B 1
)

SET SQL_FILE=%~1

IF NOT EXIST "%SQL_FILE%" (
    echo [ERROR] El fichero no existe: %SQL_FILE%
    EXIT /B 1
)

echo ============================================================
echo  ATENCION: Esta operacion SOBREESCRIBIRA la base de datos
echo  %DB_NAME% en %DB_HOST%:%DB_PORT%
echo  Fichero a restaurar: %SQL_FILE%
echo ============================================================
echo.
SET /P CONFIRM=¿Confirmas la restauracion? (s/N):

IF /I NOT "%CONFIRM%"=="s" (
    echo Operacion cancelada.
    EXIT /B 0
)

:: Pedir contraseña de forma interactiva
SET /P DB_PASS=Introduce la contrasena de MySQL para el usuario %DB_USER%:

echo.
echo Restaurando base de datos %DB_NAME%...
echo.

mysql ^
    --host=%DB_HOST% ^
    --port=%DB_PORT% ^
    --user=%DB_USER% ^
    --password=%DB_PASS% ^
    %DB_NAME% < "%SQL_FILE%"

IF %ERRORLEVEL% EQU 0 (
    echo [OK] Restauracion completada correctamente.
) ELSE (
    echo [ERROR] La restauracion fallo con codigo de error %ERRORLEVEL%
    EXIT /B 1
)
