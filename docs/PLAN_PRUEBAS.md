# Plan de Pruebas — OPTIBASE

**Proyecto:** TFG Optibase — ERP para el sector óptico  
**Versión:** 1.1  
**Fecha:** 2026-05-14

---

## 1. Casos de prueba automatizados (JUnit 5)

### 1.1 Autenticación y autorización (`AuthControllerTest`)

| ID          | Descripción                                        | Tipo          | Resultado esperado                         | Estado      |
|-------------|----------------------------------------------------|---------------|--------------------------------------------|-------------|
| TC-AUTH-01  | Login correcto con credenciales ADMIN              | Automatizado  | HTTP 200, body con `token` y `rol=ROLE_ADMIN` | ✅ PASS (14/05/2026) |
| TC-AUTH-01b | Login correcto con credenciales USER               | Automatizado  | HTTP 200, body con `token` y `rol=ROLE_USER`  | ✅ PASS (14/05/2026) |
| TC-AUTH-02  | Login con contraseña incorrecta                    | Automatizado  | HTTP 401, `{"error":"Credenciales incorrectas"}` | ✅ PASS (14/05/2026) |
| TC-AUTH-03  | Login con usuario inexistente                      | Automatizado  | HTTP 401, `{"error":"Credenciales incorrectas"}` | ✅ PASS (14/05/2026) |
| TC-AUTH-04  | GET `/api/clientes` sin token de autorización      | Automatizado  | HTTP 401                                   | ✅ PASS (14/05/2026) |
| TC-AUTH-05  | GET `/api/clientes` con token ROLE_ADMIN           | Automatizado  | HTTP 200, array JSON (puede estar vacío)   | ✅ PASS (14/05/2026) |
| TC-AUTH-06  | POST `/api/clientes` con token ROLE_USER           | Automatizado  | HTTP 403 (acceso denegado)                 | ✅ PASS (14/05/2026) |

### 1.2 Servicio de clientes (`ClienteServiceTest`)

| ID         | Descripción                                      | Tipo          | Resultado esperado                           | Estado      |
|------------|--------------------------------------------------|---------------|----------------------------------------------|-------------|
| TC-CLI-01  | `obtenerClientes()` devuelve lista completa      | Automatizado  | Lista no vacía con los clientes del mock     | ✅ PASS (14/05/2026) |
| TC-CLI-02  | `obtenerPorId(id)` con ID existente              | Automatizado  | `Optional<ClienteModel>` con valor presente  | ✅ PASS (14/05/2026) |
| TC-CLI-03  | `obtenerPorId(id)` con ID inexistente            | Automatizado  | `orElseThrow` lanza `RuntimeException`       | ✅ PASS (14/05/2026) |
| TC-CLI-04  | `guardarCliente(cliente)` persiste y devuelve    | Automatizado  | Objeto `ClienteModel` no nulo                | ✅ PASS (14/05/2026) |
| TC-CLI-05  | `eliminarCliente(id)` delega en repositorio      | Automatizado  | Verificación de llamada a `deleteById`       | ✅ PASS (14/05/2026) |

---

## 2. Casos de prueba manuales — End-to-End (E2E)

| ID        | Descripción                                           | Tipo    | Resultado esperado                           | Fecha      | Estado     |
|-----------|-------------------------------------------------------|---------|----------------------------------------------|------------|------------|
| TC-E2E-01 | Arrancar back y front y acceder a `localhost:4200`    | Manual  | Página de login visible, sin errores en consola | 10/05/2026 | ✅ PASS |
| TC-E2E-02 | Login como admin y navegar a sección Clientes         | Manual  | Listado de clientes visible, botones de edición activos | 10/05/2026 | ✅ PASS |
| TC-E2E-03 | Login como usuario normal e intentar crear cliente    | Manual  | Botón de creación deshabilitado o respuesta 403 | 10/05/2026 | ✅ PASS |
| TC-E2E-04 | Cerrar sesión y verificar que la ruta protegida redirige | Manual | Redirección al login, token eliminado del storage | 10/05/2026 | ✅ PASS |
| TC-E2E-05 | Navegar al módulo Ventas y listar ventas registradas  | Manual  | Tabla de ventas cargada con columnas: cliente, producto, importe, estado pago | 14/05/2026 | ✅ PASS |
| TC-E2E-06 | Crear una nueva venta desde el formulario modal       | Manual  | Venta guardada, tabla actualizada, stock del producto decrementado en inventario | 14/05/2026 | ✅ PASS |
| TC-E2E-07 | Eliminar una venta existente como admin               | Manual  | Venta eliminada de la lista, confirmación visual en consola de red (HTTP 204) | 14/05/2026 | ✅ PASS |
| TC-E2E-08 | Navegar al módulo Encargos y listar encargos          | Manual  | Tabla de encargos cargada con columnas: cliente, producto, estado, proveedor | 14/05/2026 | ✅ PASS |
| TC-E2E-09 | Crear un nuevo encargo desde el formulario modal      | Manual  | Encargo guardado con estado "PENDIENTE", aparece en la tabla con el cliente correcto | 14/05/2026 | ✅ PASS |
| TC-E2E-10 | Acceder a la ficha de un cliente y ver su historial de graduaciones | Manual | Pestaña Graduaciones muestra las entradas del historial con los datos ópticos correctos | 14/05/2026 | ✅ PASS |
| TC-E2E-11 | Verificar que ROLE_USER no ve botones de acción en Ventas y Encargos | Manual | Sin botones de creación ni eliminación visibles para el usuario con rol USER | 14/05/2026 | ✅ PASS |
| TC-E2E-12 | Navegar al módulo Estadísticas y verificar métricas del día | Manual | Dashboard muestra ventas del día, encargos activos, citas de hoy y total de clientes | 14/05/2026 | ✅ PASS |

---

## 3. Casos de prueba de backup y restauración

| ID        | Descripción                                    | Tipo    | Resultado esperado                              | Fecha      | Estado     |
|-----------|------------------------------------------------|---------|-------------------------------------------------|------------|------------|
| TC-BKP-01 | Ejecutar `backup.bat` / `backup.sh`            | Manual  | Fichero `.sql` creado en `scripts/backups/` con timestamp | 10/05/2026 | ✅ PASS |
| TC-BKP-02 | Verificar contenido del fichero de backup      | Manual  | El `.sql` contiene DDL + DML de todas las tablas | 10/05/2026 | ✅ PASS |
| TC-BKP-03 | Ejecutar `restore.bat` con el backup generado  | Manual  | BD restaurada correctamente, datos coinciden    | 10/05/2026 | ✅ PASS |

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

---

## 5. Evidencias

Capturas de pantalla obtenidas durante la sesión de pruebas del 10/05/2026.

| Fichero                          | Caso relacionado | Descripción                                                     |
|----------------------------------|------------------|-----------------------------------------------------------------|
| `evidencias/01_login.png`        | TC-E2E-01        | Página de login visible en `localhost:4200`, sin errores en consola |
| `evidencias/02_menu.png`         | TC-E2E-01        | Menú principal tras login correcto como ADMIN                   |
| `evidencias/03_clientes.png`     | TC-E2E-02        | Listado de clientes con botones de edición activos (ROLE_ADMIN) |
| `evidencias/04_agenda.png`       | TC-E2E-02        | Módulo de citas con datos de fecha, hora y cliente visibles     |
| `evidencias/05_inventario.png`   | TC-E2E-02        | Módulo de inventario con productos cargados correctamente       |
| `evidencias/06_tests.png`        | TC-AUTH / TC-CLI | Resultado de `mvn test`: todos los tests pasan (BUILD SUCCESS)  |
| `evidencias/07_backup.png`       | TC-BKP-01        | Ejecución de `backup.bat` y creación del fichero `.sql`         |
| `evidencias/07_backup2.png`      | TC-BKP-02        | Contenido del fichero `.sql` con DDL y DML de las tablas        |
| `evidencias/08_citaeliminada.png`| TC-E2E-02        | Eliminación de una cita desde el módulo de agenda               |
| `evidencias/09_restauracion.png` | TC-BKP-03        | Ejecución de `restore.bat` con mensaje `[OK]` al finalizar      |
| `evidencias/10_ventas.png`       | TC-E2E-05        | Módulo de ventas con tabla completa de ventas registradas        |
| `evidencias/11_nueva_venta.png`  | TC-E2E-06        | Modal de creación de venta relleno y resultado tras guardar      |
| `evidencias/12_encargos.png`     | TC-E2E-08        | Módulo de encargos con tabla y filtros de estado activos         |
| `evidencias/13_nuevo_encargo.png`| TC-E2E-09        | Modal de creación de encargo con cliente, tipo y fechas          |
| `evidencias/14_historial.png`    | TC-E2E-10        | Ficha de cliente con pestaña Graduaciones y datos ópticos        |
| `evidencias/15_estadisticas.png` | TC-E2E-12        | Dashboard de estadísticas con métricas del día y del mes         |
| `evidencias/16_roleuser.png`     | TC-E2E-11        | Vista de Ventas con ROLE_USER: sin botones de creación ni eliminación |
