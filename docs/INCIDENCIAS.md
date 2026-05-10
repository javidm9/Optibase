# Bitácora de Incidencias — OPTIBASE

**Proyecto:** TFG Optibase — ERP para el sector óptico  
**Versión:** 1.0

---

## #001 — Conflicto de mayúsculas en Git (package path)

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-04-14                   |
| Severidad   | Media                        |
| Estado      | ✅ Resuelto                  |

**Descripción:**  
Git en Windows (case-insensitive) no detectaba el cambio de `com.proyecto.Optibase` a `com.proyecto.optibase` en los nombres de paquetes Java. Los ficheros aparecían como no modificados tras el renombrado, lo que provocaba errores de compilación al clonar el repositorio en sistemas Linux/Mac (case-sensitive).

**Causa raíz:**  
El sistema de ficheros NTFS de Windows es insensible a mayúsculas por defecto. Git no registra el cambio de case si el nombre del fichero o directorio solo cambia en capitalización.

**Solución aplicada:**  
```bash
# Forzar a Git a registrar el cambio de case
git mv --force backDevelop/src/main/java/com/proyecto/Optibase \
               backDevelop/src/main/java/com/proyecto/optibase
git commit -m "fix: normalizar nombre de paquete a minúsculas"
```

---

## #002 — Credenciales expuestas en el repositorio

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-04-20                   |
| Severidad   | Alta                         |
| Estado      | ✅ Resuelto                  |

**Descripción:**  
El fichero `application.properties` contenía las credenciales de base de datos (`root`/`123456`) y el secreto JWT directamente en texto plano. Este fichero estaba incluido en el historial de Git, por lo que cualquier persona con acceso al repositorio podía ver los secretos.

**Causa raíz:**  
Configuración inicial sin separación de entornos. No existía `.gitignore` apropiado ni mecanismo de variables de entorno.

**Solución aplicada:**  
1. `application.properties` reescrito usando la sintaxis `${VAR}` de Spring Boot.  
2. Creados `application-local.properties` (con valores reales, excluido de Git) y `application-local.properties.example` (plantilla sin valores).  
3. Actualizado `.gitignore` para excluir todos los perfiles con secretos.  
4. Si se hubiera subido un secreto real, habría que rotar las credenciales inmediatamente.

---

## #003 — NG0100: ExpressionChangedAfterItHasBeenChecked en Angular

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-04-22                   |
| Severidad   | Media                        |
| Estado      | ✅ Resuelto                  |

**Descripción:**  
Error de Angular en la consola del navegador: `NG0100: ExpressionChangedAfterItHasBeenCheckedError` al cargar el componente de menú principal. El estado del componente cambiaba durante el ciclo de detección de cambios (Change Detection), provocando que la vista quedara desincronizada.

**Causa raíz:**  
Una propiedad ligada en el template (`*ngIf`, interpolación) era modificada en el método `ngAfterViewInit()` o en un callback asíncrono que se ejecutaba dentro del mismo ciclo de CD.

**Solución aplicada:**  
```typescript
import { ChangeDetectorRef } from '@angular/core';

constructor(private cdr: ChangeDetectorRef) {}

ngAfterViewInit() {
    // Actualizar el estado
    this.isLoading = false;
    // Forzar un nuevo ciclo de detección de cambios
    this.cdr.detectChanges();
}
```

---

## #004 — Spring Boot no arrancaba por orden de carga de perfiles

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-04-24                   |
| Severidad   | Alta                         |
| Estado      | ✅ Resuelto                  |

**Descripción:**  
Spring Boot lanzaba `IllegalArgumentException: Could not resolve placeholder '${DB_USER}'` al arrancar, aunque `application-local.properties` existía y contenía la variable. La aplicación no podía iniciarse.

**Causa raíz:**  
El perfil `local` no estaba activo en el momento en que Spring resolvía los placeholders del fichero principal `application.properties`. El fichero `application-local.properties` solo se carga cuando el perfil `local` está activo, pero `spring.profiles.active=local` estaba únicamente en ese fichero, creando una dependencia circular.

**Solución aplicada:**  
Se añadió `spring.profiles.active=${SPRING_PROFILES_ACTIVE:local}` directamente en `application.properties`, garantizando que el perfil `local` se active por defecto sin depender de que `application-local.properties` sea leído primero.

---

## #005 — CORS bloqueado con SSR activo en Angular

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-04-26                   |
| Severidad   | Media                        |
| Estado      | ✅ Resuelto                  |

**Descripción:**  
Con Server-Side Rendering (SSR) habilitado en Angular, las llamadas HTTP al backend fallaban durante el renderizado en servidor con errores de CORS o `window is not defined`. Los servicios Angular intentaban llamar a `http://localhost:8080` desde el servidor Node/Express, donde no existe el contexto de navegador.

**Causa raíz:**  
Angular Universal (SSR) ejecuta código en un entorno Node.js que no tiene `window`, `localStorage` ni las APIs de navegador. El interceptor de autenticación intentaba leer el token de `localStorage`, lo que lanzaba una excepción en SSR.

**Solución aplicada:**  
```typescript
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);
    if (!isPlatformBrowser(platformId)) {
        return next(req); // En SSR, no añadir token
    }
    const token = localStorage.getItem('token');
    // ... resto del interceptor
};
```

---

## #006 — Columna 'rol' NULL en usuarios existentes al añadir el campo

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-05-05                   |
| Severidad   | Media                        |
| Estado      | ✅ Resuelto                  |

**Descripción:**  
Al añadir la columna `rol VARCHAR(20) NOT NULL` a la entidad `UsuarioModel`, Hibernate lanzaba `DataIntegrityViolationException` al arrancar porque los registros existentes en la tabla `usuarios` tenían el campo `rol` a NULL, violando la restricción `NOT NULL`.

**Causa raíz:**  
La estrategia `spring.jpa.hibernate.ddl-auto=update` de Hibernate añade columnas nuevas pero no puede asignar valores por defecto a las filas existentes cuando la columna es `NOT NULL` sin un `DEFAULT`.

**Solución aplicada:**  
Creado el script `scripts/migration_roles.sql` para ejecutar **antes** de arrancar la nueva versión de la aplicación:
```sql
ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS rol VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER';

UPDATE usuarios SET rol = 'ROLE_ADMIN' WHERE nombre = 'admin';
```
Este script asigna `ROLE_USER` a todos los usuarios existentes y `ROLE_ADMIN` al usuario administrador.

---

## #007 — Endpoint `/api/articulos` inexistente en el backend

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-05-10                   |
| Severidad   | Alta                         |
| Estado      | ✅ Resuelto                  |

**Descripción:**  
El servicio Angular `ArticuloService` apuntaba a `/api/articulos`, pero el controlador real en Spring Boot es `ProductoController` y expone `/api/productos`. Todas las peticiones del módulo de inventario devolvían HTTP 404.

**Causa raíz:**  
El fichero de servicio fue creado con un nombre de endpoint asumido que no coincidía con el controlador backend definido en `ProductoController.java`.

**Solución aplicada:**  
Renombrado el fichero `articulo.service.ts` a `producto.service.ts` y actualizada la URL base:
```typescript
private apiUrl = 'http://localhost:8080/api/productos';
```

---

## #008 — Modelo `Articulo` incompatible con `ProductoModel` del backend

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-05-10                   |
| Severidad   | Alta                         |
| Estado      | ✅ Resuelto                  |

**Descripción:**  
La interfaz TypeScript `Articulo` definía campos `nombre`, `referencia`, `categoria` y `descripcion` que no existen en la entidad JPA `ProductoModel`. El backend devuelve `modelo`, `tipo`, `marca`, `precio`, `stock` y `esRecambio`. Los datos no se pintaban en la tabla y el formulario de creación enviaba campos vacíos.

**Causa raíz:**  
La interfaz frontend fue diseñada sin consultar la entidad backend real.

**Solución aplicada:**  
Reescrita la interfaz `Articulo` para reflejar exactamente los campos de `ProductoModel`. Actualizados todos los bindings en `inventario.ts` e `inventario.html` (columna Referencia eliminada, `nombre` → `modelo`, `categoria` → `tipo`).

---

## #009 — `mysqldump` / `mysql` no encontrados en el PATH del sistema

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-05-10                   |
| Severidad   | Media                        |
| Estado      | ✅ Resuelto                  |

**Descripción:**  
Al ejecutar `backup.bat` y `restore.bat`, el sistema no encontraba los ejecutables `mysqldump` y `mysql` y lanzaba el error `'mysqldump' is not recognized as an internal or external command`. El backup no se generaba.

**Causa raíz:**  
La instalación de MariaDB 11.6 en Windows no añade automáticamente su carpeta `bin` al PATH del sistema en todos los perfiles de usuario.

**Solución aplicada:**  
Sustituidas las llamadas genéricas por rutas absolutas en ambos scripts:
```bat
"C:\Program Files\MariaDB 11.6\bin\mysqldump.exe" ...
"C:\Program Files\MariaDB 11.6\bin\mysql.exe" ...
```

---

## #010 — Nombre de fichero de backup con coma causaba error en `restore.bat`

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-05-10                   |
| Severidad   | Baja                         |
| Estado      | ✅ Resuelto                  |

**Descripción:**  
En ciertos ajustes regionales de Windows, el separador decimal del reloj del sistema es una coma en lugar de un punto. El timestamp generado en `backup.bat` incluía comas en el nombre del fichero (p. ej. `optibase_20260510_10,30,05.sql`), lo que hacía que `restore.bat` no reconociera el fichero al pasarlo como argumento.

**Causa raíz:**  
El parsing de `%TIME%` con `FOR /F "tokens=1-6 delims=/:. "` no contemplaba la coma como delimitador adicional en configuraciones regionales con separador decimal `,`.

**Solución aplicada:**  
Añadido `:` y `,` al conjunto de delimitadores del bucle `FOR` y verificado que el timestamp resultante no contiene comas. Backup renombrado manualmente para la sesión de pruebas del 10/05/2026.

---

## #011 — Módulos de citas e inventario no actualizaban la vista al cargar datos

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-05-10                   |
| Severidad   | Media                        |
| Estado      | ✅ Resuelto                  |

**Descripción:**  
Los módulos de Citas e Inventario mostraban la tabla vacía al entrar, aunque la petición HTTP devolvía datos correctamente (verificado en DevTools). Refrescar manualmente la página solucionaba el problema de forma intermitente.

**Causa raíz:**  
Angular SSR ejecuta la detección de cambios (Change Detection) de forma diferente a la renderización en cliente. Los callbacks `next` de los `subscribe()` se ejecutaban fuera del ciclo de CD principal, por lo que Angular no detectaba que las listas habían cambiado y no repintaba la vista.

**Solución aplicada:**  
Inyectado `ChangeDetectorRef` en ambos componentes y llamado a `this.cdr.detectChanges()` inmediatamente después de asignar los datos recibidos, siguiendo el patrón ya establecido en `ClientesComponent`:
```typescript
constructor(private cdr: ChangeDetectorRef) {}

this.service.getAll().subscribe({
  next: (datos) => {
    this.lista = datos;
    this.cdr.detectChanges();
  }
});
```
