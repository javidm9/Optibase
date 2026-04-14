# Optibase — Backend

API REST del sistema de gestión **Optibase**, desarrollada como parte del Trabajo de Fin de Grado. Optibase es un ERP diseñado para el sector óptico que permite gestionar clientes, citas, historial de graduaciones, encargos, ventas e inventario.

## Tecnologías

- Java 25
- Spring Boot 4.0.3
- Spring Security + JWT
- Spring Data JPA / Hibernate
- MySQL 8
- Lombok
- Maven

## Requisitos previos

- Java 25 o superior
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

En `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/optibase_db
spring.datasource.username=root
spring.datasource.password=123456
```

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
