# Optibase — Backend

API REST del sistema de gestión **Optibase**, desarrollada como parte del Trabajo de Fin de Grado. Optibase es un ERP diseñado para el sector óptico que permite gestionar clientes, citas, historial de graduaciones, encargos, ventas e inventario.

## Tecnologías

- Java 17
- Spring Boot 4.0.3
- Spring Security + JWT (JJWT 0.12.6)
- Spring Data JPA / Hibernate
- MySQL / MariaDB
- Lombok
- Maven

## Requisitos previos

- Java 17 o superior
- MySQL o MariaDB corriendo en `localhost:3306`
- Base de datos `optibase_db` creada

## Instalación y arranque

```bash
cd backDevelop

# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

La API estará disponible en `http://localhost:8080`.

## Endpoints de la API

### Autenticación (público)

| Método | Ruta               | Descripción                         |
|--------|--------------------|-------------------------------------|
| POST   | `/api/auth/login`  | Login y obtención de token JWT      |

### Clientes (requiere token)

| Método | Ruta                      | Descripción                         | Rol mínimo   |
|--------|---------------------------|-------------------------------------|--------------|
| GET    | `/api/clientes`           | Listar todos los clientes           | ROLE_USER    |
| GET    | `/api/clientes/{id}`      | Obtener cliente por ID              | ROLE_USER    |
| GET    | `/api/clientes/dni/{dni}` | Buscar cliente por DNI              | ROLE_USER    |
| POST   | `/api/clientes`           | Crear cliente                       | ROLE_ADMIN   |
| PUT    | `/api/clientes/{id}`      | Actualizar cliente                  | ROLE_ADMIN   |
| DELETE | `/api/clientes/{id}`      | Eliminar cliente                    | ROLE_ADMIN   |

### Citas (requiere token)

| Método | Ruta                          | Descripción                         | Rol mínimo   |
|--------|-------------------------------|-------------------------------------|--------------|
| GET    | `/api/citas`                  | Listar todas las citas              | ROLE_USER    |
| GET    | `/api/citas/cliente/{id}`     | Citas de un cliente                 | ROLE_USER    |
| POST   | `/api/citas`                  | Crear cita (valida conflicto)       | ROLE_ADMIN   |
| PUT    | `/api/citas/{id}`             | Actualizar cita                     | ROLE_ADMIN   |
| DELETE | `/api/citas/{id}`             | Eliminar cita                       | ROLE_ADMIN   |

### Historial de Graduaciones (requiere token)

| Método | Ruta                              | Descripción                         | Rol mínimo   |
|--------|-----------------------------------|-------------------------------------|--------------|
| GET    | `/api/historiales/cliente/{id}`   | Historial de un cliente             | ROLE_USER    |
| POST   | `/api/historiales`                | Registrar nueva graduación          | ROLE_ADMIN   |
| PUT    | `/api/historiales/{id}`           | Actualizar graduación               | ROLE_ADMIN   |
| DELETE | `/api/historiales/{id}`           | Eliminar graduación                 | ROLE_ADMIN   |

### Inventario / Productos (requiere token)

| Método | Ruta                          | Descripción                         | Rol mínimo   |
|--------|-------------------------------|-------------------------------------|--------------|
| GET    | `/api/productos`              | Listar productos principales        | ROLE_USER    |
| GET    | `/api/productos/{id}/recambios`| Recambios de un producto            | ROLE_USER    |
| POST   | `/api/productos`              | Crear producto                      | ROLE_ADMIN   |
| PUT    | `/api/productos/{id}`         | Actualizar producto                 | ROLE_ADMIN   |
| DELETE | `/api/productos/{id}`         | Eliminar producto                   | ROLE_ADMIN   |

### Ventas (requiere token)

| Método | Ruta                          | Descripción                              | Rol mínimo   |
|--------|-------------------------------|------------------------------------------|--------------|
| GET    | `/api/ventas`                 | Listar todas las ventas                  | ROLE_USER    |
| GET    | `/api/ventas/cliente/{id}`    | Ventas de un cliente                     | ROLE_USER    |
| GET    | `/api/ventas/pendientes`      | Ventas pendientes de pago                | ROLE_USER    |
| POST   | `/api/ventas`                 | Registrar venta (descuenta stock)        | ROLE_ADMIN   |
| PUT    | `/api/ventas/{id}`            | Actualizar venta                         | ROLE_ADMIN   |
| DELETE | `/api/ventas/{id}`            | Eliminar venta                           | ROLE_ADMIN   |

### Encargos (requiere token)

| Método | Ruta                              | Descripción                         | Rol mínimo   |
|--------|-----------------------------------|-------------------------------------|--------------|
| GET    | `/api/encargos`                   | Listar todos los encargos           | ROLE_USER    |
| GET    | `/api/encargos/cliente/{id}`      | Encargos de un cliente              | ROLE_USER    |
| GET    | `/api/encargos/tipo/{tipo}`       | Encargos por tipo                   | ROLE_USER    |
| POST   | `/api/encargos`                   | Crear encargo                       | ROLE_ADMIN   |
| PUT    | `/api/encargos/{id}`              | Actualizar encargo                  | ROLE_ADMIN   |
| DELETE | `/api/encargos/{id}`              | Eliminar encargo                    | ROLE_ADMIN   |

### Usuarios (requiere ROLE_ADMIN)

| Método | Ruta                    | Descripción                         |
|--------|-------------------------|-------------------------------------|
| GET    | `/api/usuarios`         | Listar usuarios                     |
| GET    | `/api/usuarios/{id}`    | Obtener usuario por ID              |
| POST   | `/api/usuarios`         | Crear usuario (hashea contraseña)   |
| PUT    | `/api/usuarios/{id}`    | Actualizar usuario                  |
| DELETE | `/api/usuarios/{id}`    | Eliminar usuario                    |

## Configuración de base de datos

Las credenciales se inyectan mediante variables de entorno definidas en `application-local.properties`, fichero excluido del repositorio por seguridad. La plantilla incluida en el repositorio sirve de base:

```bash
# Linux/Mac
cp src/main/resources/application-local.properties.example \
   src/main/resources/application-local.properties

# Windows
copy src\main\resources\application-local.properties.example ^
     src\main\resources\application-local.properties
```

```properties
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_URL=jdbc:mysql://localhost:3306/optibase_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
JWT_SECRET=<clave_base64_minimo_32_bytes>
JWT_EXPIRATION=86400000
CORS_ORIGINS=http://localhost:4200
```

El README raíz incluye instrucciones detalladas sobre cómo generar el `JWT_SECRET` y la migración inicial de datos.

## Estructura del proyecto

```
src/main/java/com/proyecto/optibase/
├── config/        # Seguridad, JWT, CORS, filtro de autenticación
├── controller/    # Controladores REST (8 controladores)
├── dto/           # Objetos de transferencia para login
├── exception/     # Manejador global de excepciones
├── model/         # Entidades JPA (8 modelos)
├── repository/    # Repositorios Spring Data (7 repositorios)
└── service/       # Lógica de negocio (7 servicios)
```
