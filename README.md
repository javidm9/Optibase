# OPTIBASE

Sistema integral de gestión (ERP) diseñado específicamente para el sector óptico y clínico. Permite gestionar clientes, citas, historial de graduaciones, encargos, ventas e inventario desde una interfaz web moderna.

---

## Arquitectura del Sistema

Optibase sigue una arquitectura cliente-servidor desacoplada:

    Frontend Angular (localhost:4200)
            |
            | HTTP/REST + JWT
            |
    Backend Spring Boot (localhost:8080)
            |
            | JDBC
            |
    MySQL 8.0 (localhost:3306)

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | Angular | 21.2.0 |
| Backend | Spring Boot | 4.0.3 |
| Base de datos | MySQL | 8.0 |
| Lenguaje backend | Java | 25 |
| Autenticación | JWT (jjwt) | 0.12.6 |

---

## Estructura del Repositorio

    Optibase/
    ├── backDevelop/     # API REST Spring Boot
    └── frontDevelop/    # SPA Angular

---

## Medidas de Seguridad Implementadas

### Autenticación JWT

El sistema utiliza JSON Web Tokens para la autenticación. El flujo es el siguiente:

1. El usuario envía sus credenciales a `POST /api/auth/login`
2. El backend valida las credenciales contra la base de datos
3. Si son correctas, genera un token JWT firmado con clave secreta
4. El frontend almacena el token y lo incluye en cada petición en el header `Authorization: Bearer <token>`
5. El backend valida el token en cada petición mediante un filtro (`JwtFilter`)

### Protección de Rutas (Frontend)

Las rutas de Angular están protegidas mediante `AuthGuard`. Si el usuario no está autenticado, es redirigido automáticamente al login.

### Interceptor HTTP

Un interceptor Angular añade automáticamente el token JWT a todas las peticiones HTTP salientes.

### CORS

El backend tiene configurado CORS para aceptar únicamente peticiones desde `http://localhost:4200`, rechazando cualquier otro origen.

### Spring Security

Todas las rutas del backend requieren autenticación excepto `/api/auth/login`. La configuración deshabilita CSRF al tratarse de una API REST stateless.

---

## Manual de Instalación

### Requisitos previos

- Java 25 o superior
- Node.js 18 o superior
- MySQL 8.0
- Angular CLI: `npm install -g @angular/cli`

### 1. Base de datos

Crear la base de datos en MySQL:

    CREATE DATABASE optibase_db;

### 2. Backend

Configurar credenciales en `backDevelop/src/main/resources/application.properties`:

    spring.datasource.username=root
    spring.datasource.password=tu_password

Arrancar el backend:

    cd backDevelop
    ./mvnw spring-boot:run

El backend arrancará en `http://localhost:8080`. Hibernate creará las tablas automáticamente.

### 3. Frontend

    cd frontDevelop
    npm install
    ng serve

La aplicación estará disponible en `http://localhost:4200`.

### 4. Credenciales de acceso por defecto

| Usuario | Contraseña |
|---------|------------|
| admin   | admin      |

---

## Módulos del Sistema

| Módulo | Ruta | Descripción |
|--------|------|-------------|
| Login | `/login` | Autenticación de usuarios |
| Menú | `/menu` | Dashboard principal de navegación |
| Clientes | `/clientes` | Gestión completa de clientes con historial de graduaciones |
| Citas | `/citas` | Gestión de citas y agenda |
| Inventario | `/inventario` | Control de productos y stock |

---

## Documentación Técnica

- [README Frontend](./frontDevelop/README.md)
- [README Backend](./backDevelop/README.md)
