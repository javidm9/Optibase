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
Renombrado el fichero `articulo.service.ts` a `producto.service.ts` y actualizada la URL base para usar la variable de entorno:
```typescript
private apiUrl = `${environment.apiUrl}/api/productos`;
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

---

## #012 — Variables de entorno no inyectadas en el Dockerfile del frontend

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-05-12                   |
| Severidad   | Alta                         |
| Estado      | ✅ Resuelto                  |

**Descripción:**
Al construir la imagen Docker del frontend sin pasar el argumento `API_URL`, el comando `sed` del Dockerfile sustituía la cadena `__API_URL__` en `environment.prod.ts` por una cadena vacía. La aplicación desplegada en Railway hacía todas las peticiones HTTP a una URL vacía (`/api/...`), devolviendo 404 en todas las llamadas al backend.

**Causa raíz:**
El `ARG API_URL` en el Dockerfile tiene valor vacío si no se pasa con `--build-arg`. El `RUN sed` se ejecuta igualmente y deja la variable sin valor, sin emitir ningún error visible en el log de build.

**Solución aplicada:**
Añadido un step de validación en el Dockerfile que emite un `WARNING` explícito si `API_URL` está vacía tras la sustitución, para que el fallo sea visible en los logs de Railway y no llegue a producción silenciosamente:
```dockerfile
RUN if [ -z "${API_URL}" ]; then \
      echo "WARNING: API_URL no está definida, las llamadas HTTP fallarán en producción"; \
    fi
```

---

## #013 — `@CrossOrigin` hardcodeado en controladores duplicaba la política CORS

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-05-12                   |
| Severidad   | Media                        |
| Estado      | ✅ Resuelto                  |

**Descripción:**
Algunos controladores (`EncargoController`, `VentaController`) tenían la anotación `@CrossOrigin(origins = "http://localhost:4200")` sobre la clase. En producción (Railway), el origen del frontend es diferente (`https://optibase-front.up.railway.app`), por lo que las peticiones CORS eran bloqueadas aunque `SecurityConfig` estuviera configurada correctamente con la variable de entorno `CORS_ORIGINS`.

**Causa raíz:**
La anotación `@CrossOrigin` a nivel de controlador tiene mayor precedencia que la configuración global de Spring Security para esa ruta concreta. Al incluir únicamente `localhost:4200`, sobreescribía el valor dinámico de `CORS_ORIGINS` inyectado en `SecurityConfig`.

**Solución aplicada:**
Eliminada la anotación `@CrossOrigin` de todos los controladores. La política CORS queda centralizada exclusivamente en `SecurityConfig.java`, que lee el origen permitido desde la variable de entorno `CORS_ORIGINS`.

---

## #014 — Contraseña expuesta en respuestas JSON de la API de usuarios

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-05-13                   |
| Severidad   | Alta                         |
| Estado      | ✅ Resuelto                  |

**Descripción:**
El endpoint `GET /api/usuarios` devolvía el hash BCrypt de la contraseña en el cuerpo de la respuesta JSON. Aunque el hash no es la contraseña en texto plano, su exposición innecesaria representa un riesgo de seguridad: facilita ataques offline de fuerza bruta y viola el principio de mínima exposición de datos.

**Causa raíz:**
`UsuarioModel` serializa todos sus campos por defecto cuando Spring convierte la entidad a JSON. No había ninguna anotación que excluyera el campo `contrasenya` de la serialización.

**Solución aplicada:**
Añadida la anotación `@JsonIgnore` de Jackson sobre el campo `contrasenya` en `UsuarioModel`:
```java
@JsonIgnore
@NotBlank(message = "Introduzca su contraseña")
private String contrasenya;
```
A partir de este cambio, el campo no aparece en ninguna respuesta de la API, independientemente del endpoint que devuelva un `UsuarioModel`.

---

## #015 — `WebConfig.java` duplicaba la configuración CORS con valores hardcodeados

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-05-13                   |
| Severidad   | Media                        |
| Estado      | ✅ Resuelto                  |

**Descripción:**
Existía un fichero `WebConfig.java` que implementaba `WebMvcConfigurer` y registraba un `CorsRegistry` con `allowedOrigins("http://localhost:4200")` hardcodeado. Esto creaba una segunda fuente de verdad para la política CORS, diferente a la configurada en `SecurityConfig.java` mediante `${CORS_ORIGINS}`. En entornos distintos a desarrollo local, las dos configuraciones podían entrar en conflicto.

**Causa raíz:**
El fichero fue creado durante las fases iniciales del proyecto como solución rápida a un problema CORS antes de integrar Spring Security. Nunca fue eliminado al centralizar la configuración en `SecurityConfig`.

**Solución aplicada:**
Eliminado el fichero `WebConfig.java` por completo. La única fuente de verdad para CORS es ahora `SecurityConfig.java`, que lee el origen desde la variable de entorno y aplica la política a todos los endpoints de forma consistente.

---

## #016 — Módulos de Ventas y Encargos no tenían formulario de creación en el frontend

| Campo       | Valor                        |
|-------------|------------------------------|
| Fecha       | 2026-05-14                   |
| Severidad   | Alta                         |
| Estado      | ✅ Resuelto                  |

**Descripción:**
Los módulos de Ventas y Encargos mostraban correctamente el listado de registros, pero no incluían ningún formulario para crear nuevas entradas. Los usuarios con `ROLE_ADMIN` no podían registrar ventas ni encargos desde la interfaz web, obligando a usar directamente la API REST.

**Causa raíz:**
Los componentes `ventas.ts` y `encargos.ts` se implementaron inicialmente en modo solo lectura. El formulario de creación no se añadió en la primera iteración por falta de tiempo.

**Solución aplicada:**
Añadido un modal de creación a cada módulo, siguiendo el mismo patrón visual brutalista usado en Clientes y Citas:
- Botón `+ NUEVA VENTA` / `+ NUEVO ENCARGO` visible solo para `ROLE_ADMIN`.
- Modal con `ngModel` binding para todos los campos del formulario.
- Selectores que cargan en tiempo real la lista de clientes y productos desde la API.
- Validación de campos obligatorios antes de enviar la petición.
- En Ventas: la creación descuenta automáticamente el stock del producto a través de `VentaService.guardarVenta()` en el backend.
- En Encargos: se envían los IDs de cliente y producto como objetos anidados `{id: X}` para que Hibernate resuelva la relación correctamente.
