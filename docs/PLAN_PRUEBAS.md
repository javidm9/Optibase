# Plan de Pruebas — OPTIBASE

**Proyecto:** TFG Optibase — ERP para el sector óptico  
**Versión:** 1.0  
**Fecha:** 2026-05-05

---

## 1. Casos de prueba automatizados (JUnit 5)

### 1.1 Autenticación y autorización (`AuthControllerTest`)

| ID          | Descripción                                        | Tipo          | Resultado esperado                         | Estado      |
|-------------|----------------------------------------------------|---------------|--------------------------------------------|-------------|
| TC-AUTH-01  | Login correcto con credenciales ADMIN              | Automatizado  | HTTP 200, body con `token` y `rol=ROLE_ADMIN` | ✅ Definido |
| TC-AUTH-01b | Login correcto con credenciales USER               | Automatizado  | HTTP 200, body con `token` y `rol=ROLE_USER`  | ✅ Definido |
| TC-AUTH-02  | Login con contraseña incorrecta                    | Automatizado  | HTTP 401, `{"error":"Credenciales incorrectas"}` | ✅ Definido |
| TC-AUTH-03  | Login con usuario inexistente                      | Automatizado  | HTTP 401, `{"error":"Credenciales incorrectas"}` | ✅ Definido |
| TC-AUTH-04  | GET `/api/clientes` sin token de autorización      | Automatizado  | HTTP 401                                   | ✅ Definido |
| TC-AUTH-05  | GET `/api/clientes` con token ROLE_ADMIN           | Automatizado  | HTTP 200, array JSON (puede estar vacío)   | ✅ Definido |
| TC-AUTH-06  | POST `/api/clientes` con token ROLE_USER           | Automatizado  | HTTP 403 (acceso denegado)                 | ✅ Definido |

### 1.2 Servicio de clientes (`ClienteServiceTest`)

| ID         | Descripción                                      | Tipo          | Resultado esperado                           | Estado      |
|------------|--------------------------------------------------|---------------|----------------------------------------------|-------------|
| TC-CLI-01  | `obtenerClientes()` devuelve lista completa      | Automatizado  | Lista no vacía con los clientes del mock     | ✅ Definido |
| TC-CLI-02  | `obtenerPorId(id)` con ID existente              | Automatizado  | `Optional<ClienteModel>` con valor presente  | ✅ Definido |
| TC-CLI-03  | `obtenerPorId(id)` con ID inexistente            | Automatizado  | `orElseThrow` lanza `RuntimeException`       | ✅ Definido |
| TC-CLI-04  | `guardarCliente(cliente)` persiste y devuelve    | Automatizado  | Objeto `ClienteModel` no nulo                | ✅ Definido |
| TC-CLI-05  | `eliminarCliente(id)` delega en repositorio      | Automatizado  | Verificación de llamada a `deleteById`       | ✅ Definido |

---

## 2. Casos de prueba manuales — End-to-End (E2E)

| ID        | Descripción                                           | Tipo    | Resultado esperado                           | Estado     |
|-----------|-------------------------------------------------------|---------|----------------------------------------------|------------|
| TC-E2E-01 | Arrancar back y front y acceder a `localhost:4200`    | Manual  | Página de login visible, sin errores en consola | 🔲 Pendiente |
| TC-E2E-02 | Login como admin y navegar a sección Clientes         | Manual  | Listado de clientes visible, botones de edición activos | 🔲 Pendiente |
| TC-E2E-03 | Login como usuario normal e intentar crear cliente    | Manual  | Botón de creación deshabilitado o respuesta 403 | 🔲 Pendiente |
| TC-E2E-04 | Cerrar sesión y verificar que la ruta protegida redirige | Manual | Redirección al login, token eliminado del storage | 🔲 Pendiente |

---

## 3. Casos de prueba de backup y restauración

| ID        | Descripción                                    | Tipo    | Resultado esperado                              | Estado     |
|-----------|------------------------------------------------|---------|-------------------------------------------------|------------|
| TC-BKP-01 | Ejecutar `backup.bat` / `backup.sh`            | Manual  | Fichero `.sql` creado en `scripts/backups/` con timestamp | 🔲 Pendiente |
| TC-BKP-02 | Verificar contenido del fichero de backup      | Manual  | El `.sql` contiene DDL + DML de todas las tablas | 🔲 Pendiente |
| TC-BKP-03 | Ejecutar `restore.bat` con el backup generado  | Manual  | BD restaurada correctamente, datos coinciden    | 🔲 Pendiente |

---

## 4. Instrucciones de ejecución

### 4.1 Tests automatizados (Maven)

```bash
# Desde el directorio backDevelop/
cd backDevelop

# Ejecutar todos los tests (usa H2 en memoria, no necesita MySQL)
mvn test

# Ejecutar solo los tests de autenticación
mvn test -Dtest=AuthControllerTest

# Ejecutar solo los tests de servicio de clientes
mvn test -Dtest=ClienteServiceTest

# Generar informe de cobertura (si tienes JaCoCo configurado)
mvn verify
```

> **Nota:** Los tests usan el perfil `test` con H2 en memoria. No es necesario tener MySQL arrancado.

### 4.2 Prueba de backup y restauración (paso a paso)

**Paso 1 — Backup:**
```bat
cd scripts
backup.bat
# Introducir la contraseña de MySQL cuando la pida
# Verificar que se crea scripts/backups/optibase_YYYYMMDD_HHMMSS.sql
```

**Paso 2 — Verificar contenido:**
```bash
# Comprobar que el fichero no está vacío y contiene las tablas
head -50 scripts/backups/optibase_*.sql
```

**Paso 3 — Restaurar:**
```bat
restore.bat scripts\backups\optibase_YYYYMMDD_HHMMSS.sql
# Confirmar con 's' cuando pregunte
# Introducir contraseña de MySQL
# Verificar mensaje [OK]
```

**Paso 4 — Verificar restauración:**
- Acceder a MySQL Workbench o consola y comprobar que los datos están presentes.
- Arrancar la aplicación y hacer login para confirmar el funcionamiento.
