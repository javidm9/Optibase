# OPTIBASE — ERP para el sector óptico

TFG desarrollado con Spring Boot + Angular. Sistema de gestión integral para ópticas: clientes, citas, ventas, encargos, inventario, graduaciones y estadísticas.

---

## Tecnologías

| Capa         | Tecnología                   | Versión  |
|--------------|------------------------------|----------|
| Backend      | Spring Boot                  | 4.0.3    |
| Lenguaje     | Java                         | 17       |
| Persistencia | Spring Data JPA / Hibernate  | —        |
| Base de datos| MySQL / MariaDB              | 8.x      |
| Seguridad    | Spring Security + JWT (JJWT) | 0.12.6   |
| Frontend     | Angular                      | 21.2.0   |
| Estilos      | Tailwind CSS                 | 4.x      |
| SSR          | Angular Universal + Express  | —        |
| Build back   | Maven                        | 3.x      |
| Build front  | Angular CLI / npm            | —        |
| Despliegue   | Docker + Railway             | —        |

---

## Requisitos previos

- Java 17+
- Maven 3.6+ (o usar el wrapper `mvnw` incluido)
- Node.js 20+ y npm
- MySQL/MariaDB en ejecución local
- (Opcional) Git Bash o WSL para ejecutar los scripts `.sh`

---

## Configuración inicial

### 1. Clonar el repositorio

```bash
git clone https://github.com/javidm9/Optibase.git
cd Optibase
```

### 2. Crear la base de datos

```sql
CREATE DATABASE IF NOT EXISTS optibase_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

### 3. Configurar las credenciales del backend

Copia la plantilla y rellena con tus valores:

```bash
# Linux/Mac
cp backDevelop/src/main/resources/application-local.properties.example \
   backDevelop/src/main/resources/application-local.properties

# Windows
copy backDevelop\src\main\resources\application-local.properties.example ^
     backDevelop\src\main\resources\application-local.properties
```

Edita `application-local.properties` con tus valores reales:

```properties
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_URL=jdbc:mysql://localhost:3306/optibase_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
JWT_SECRET=<clave_base64_minimo_32_bytes>
JWT_EXPIRATION=86400000
CORS_ORIGINS=http://localhost:4200
```

> **Importante:** `application-local.properties` está en `.gitignore` y nunca debe subirse al repositorio.

> **Generar JWT_SECRET:** En PowerShell: `[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Max 256 }))`

### 4. Ejecutar la migración de roles (solo si hay usuarios existentes)

Si la base de datos ya tiene usuarios creados antes de la versión con roles:

```bash
mysql -u root -p optibase_db < scripts/migration_roles.sql
```

---

## Arrancar la aplicación

### Backend (Spring Boot)

```bash
cd backDevelop

# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

El servidor arranca en `http://localhost:8080`.

### Frontend (Angular)

```bash
cd frontDevelop
npm install
npm start
```

La aplicación se sirve en `http://localhost:4200`.

### Credenciales de acceso (entorno de desarrollo)

| Campo      | Valor      |
|------------|------------|
| Usuario    | admin      |
| Contraseña | admin123   |
| Rol        | ROLE_ADMIN |

---

## Sistema de roles y permisos

| Rol          | GET `/api/**` | POST `/api/**` | PUT `/api/**` | DELETE `/api/**` | `/api/usuarios/**` |
|--------------|:-------------:|:--------------:|:-------------:|:----------------:|:------------------:|
| ROLE_ADMIN   | ✅            | ✅             | ✅            | ✅               | ✅                 |
| ROLE_USER    | ✅            | ❌ (403)       | ❌ (403)      | ❌ (403)         | ❌ (403)           |
| Sin token    | ❌ (401)      | ❌ (401)       | ❌ (401)      | ❌ (401)         | ❌ (401)           |

El endpoint `/api/auth/login` es público (no requiere token).

---

## Módulos del sistema

| Módulo        | Backend | Frontend | Estado       | Descripción breve |
|---------------|:-------:|:--------:|--------------|-------------------|
| Autenticación | ✅      | ✅       | Completo     | Login JWT, gestión de roles |
| Roles         | ✅      | ✅       | Completo     | ROLE_ADMIN y ROLE_USER con permisos diferenciados |
| Clientes      | ✅      | ✅       | Completo     | CRUD completo, búsqueda, ficha con pestañas |
| Citas         | ✅      | ✅       | Completo     | Agenda con vista lista, semana y mes |
| Inventario    | ✅      | ✅       | Completo     | Gestión de productos por categoría, stock |
| Ventas        | ✅      | ✅       | Completo     | Registro de ventas, control de pagos, descuento de stock |
| Encargos      | ✅      | ✅       | Completo     | Pedidos a fábrica, seguimiento de estado |
| Historial     | ✅      | ✅       | Completo     | Historial de graduaciones por cliente |
| Estadísticas  | ✅      | ✅       | Completo     | Dashboard con métricas del día y del mes |
| Usuarios      | ✅      | ❌       | Back listo   | CRUD de usuarios solo accesible desde la API |

---

## Backup de la base de datos

### Crear backup

```bat
# Windows
scripts\backup.bat

# Linux/Mac
chmod +x scripts/backup.sh
./scripts/backup.sh
```

Los backups se guardan en `scripts/backups/` con formato `optibase_YYYYMMDD_HHMMSS.sql`.

### Restaurar un backup

```bat
# Windows
scripts\restore.bat scripts\backups\optibase_YYYYMMDD_HHMMSS.sql
```

> **Nota de portabilidad:** Los scripts intentan usar `mysqldump`/`mysql` del PATH del sistema. Si no están en el PATH, edita la variable `MYSQL_BIN` al inicio de cada script con la ruta a tu instalación. Ejemplo: `SET MYSQL_BIN=C:\Program Files\MariaDB 11.6\bin`

---

## Ejecutar los tests

```bash
cd backDevelop

# Todos los tests (usa H2 en memoria, no necesita MySQL arrancado)
.\mvnw.cmd test

# Solo tests de autenticación
.\mvnw.cmd test -Dtest=AuthControllerTest

# Solo tests de servicio de clientes
.\mvnw.cmd test -Dtest=ClienteServiceTest
```

Resultado esperado: `Tests run: 13, Failures: 0, Errors: 0, Skipped: 0`

---

## Despliegue en Railway (Docker)

El proyecto incluye Dockerfiles de dos etapas para backend y frontend.

### Backend

```bash
cd backDevelop
docker build -t optibase-back .
```

Variables de entorno requeridas en Railway: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `CORS_ORIGINS`.

### Frontend

```bash
cd frontDevelop
docker build --build-arg API_URL=https://tu-backend.railway.app -t optibase-front .
```

Variable de build requerida: `API_URL` (URL pública del backend).

---

## Documentación adicional

- [`docs/PLAN_PRUEBAS.md`](docs/PLAN_PRUEBAS.md) — Tabla de casos de test y resultados
- [`docs/INCIDENCIAS.md`](docs/INCIDENCIAS.md) — Bitácora de incidencias resueltas durante el desarrollo
- [`scripts/migration_roles.sql`](scripts/migration_roles.sql) — Migración para añadir columna de rol a usuarios existentes
