# Optibase — Backend

API REST del sistema de gestión **Optibase**, desarrollada como parte del Trabajo de Fin de Grado. Optibase es un ERP diseñado para el sector óptico que permite gestionar clientes, citas, historial de graduaciones, encargos, ventas e inventario.

## Tecnologías

- Java 17
- Spring Boot 4.0.3
- Spring Security + JWT
- Spring Data JPA / Hibernate
- MySQL 8
- Lombok
- Maven

## Requisitos previos

- Java 17 o superior
- MySQL corriendo en `localhost:3306`
- Base de datos `optibase_db` creada

## Instalación y arranque

```bash
# Clonar el repositorio y entrar en la carpeta
cd backDevelop

# Arrancar con Maven
./mvnw spring-boot:run
```

O directamente desde IntelliJ ejecutando `OptibaseApplication.java`.

La API estará disponible en `http://localhost:8080`.

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Login y obtención de token JWT |
| GET | `/api/clientes` | Listar todos los clientes |
| POST | `/api/clientes` | Crear cliente |
| PUT | `/api/clientes/{id}` | Actualizar cliente |
| DELETE | `/api/clientes/{id}` | Eliminar cliente |
| GET | `/api/citas` | Listar citas |
| GET | `/api/historiales` | Listar historiales de graduación |
| GET | `/api/productos` | Listar inventario |
| GET | `/api/ventas` | Listar ventas |

## Configuración de base de datos

Las credenciales se inyectan mediante variables de entorno definidas en `application-local.properties` (fichero excluido del repositorio). Copia la plantilla y rellena con tus valores:

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

> Consulta el README raíz para instrucciones completas de configuración.

## Estructura del proyecto

```
src/main/java/com/proyecto/optibase/
├── config/        # Seguridad, JWT, CORS
├── controller/    # Controladores REST
├── dto/           # Objetos de transferencia
├── model/         # Entidades JPA
├── repository/    # Repositorios Spring Data
└── service/       # Lógica de negocio
```
