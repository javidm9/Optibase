# OPTIBASE // FrontDevelop

Sistema integral de gestión (ERP) diseñado para el sector óptico. Este directorio contiene el módulo **Frontend** de la aplicación, desarrollado con Angular 21 y Tailwind CSS con un diseño UI industrial/brutalista.

---

## Stack Tecnológico

* **Framework:** Angular 21.2.0 (con SSR — Server Side Rendering)
* **Estilos:** Tailwind CSS 4.x
* **Lenguaje:** TypeScript / HTML5
* **Arquitectura:** Standalone Components + SSR con Express

---

## Módulos de la aplicación

| Ruta           | Componente          | Descripción                                              |
|----------------|---------------------|----------------------------------------------------------|
| `/login`       | Login               | Acceso al sistema con usuario y contraseña               |
| `/menu`        | Menu                | Panel de control central con acceso a todos los módulos  |
| `/clientes`    | ClientesList        | CRUD de clientes con ficha, graduaciones, citas y ventas |
| `/citas`       | CitasPage           | Agenda clínica con vista lista, semana y mes             |
| `/inventario`  | InventarioPage      | Gestión de productos con categorías, stock y precios     |
| `/ventas`      | VentasPage          | Registro de ventas, filtros y control de pagos           |
| `/encargos`    | EncargosPage        | Pedidos a fábrica con seguimiento de estado              |
| `/estadisticas`| EstadisticasPage    | Dashboard con métricas del día, mes y actividad reciente |

Todas las rutas excepto `/login` están protegidas por `authGuard`, que verifica el token JWT y su expiración.

---

## Sistema de Diseño (UI/UX)

La interfaz sigue un paradigma de diseño **Industrial / Brutalista**:

* **Contraste alto:** Paleta estricta de blancos, negros (`gray-950`) y azules de acción.
* **Estructura mecánica:** Bordes sólidos (2–4px), sombras duras y componentes tipo "bloque".
* **Tipografía mixta:** Sans-serif para encabezados y `mono` para datos técnicos y registros.
* **Roles en UI:** Los botones de creación, edición y eliminación solo se muestran a `ROLE_ADMIN`.

---

## Configuración y Despliegue Local

### 1. Requisitos previos

- Node.js 20+
- npm

### 2. Instalar dependencias

```bash
npm install
```

### 3. Arrancar el servidor de desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`.

> El backend debe estar corriendo en `http://localhost:8080` antes de arrancar el frontend.

### 4. Credenciales de acceso (desarrollo)

| Usuario | Contraseña |
|---------|------------|
| admin   | admin123   |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── guards/
│   │   └── auth.guard.ts       # Protección de rutas: verifica JWT y expiración
│   ├── interceptors/
│   │   └── auth.interceptor.ts # Añade el token Bearer a todas las peticiones HTTP
│   ├── models/                 # Interfaces TypeScript que espejean las entidades del backend
│   │   ├── articulo.ts
│   │   ├── cita.ts
│   │   ├── cliente.ts
│   │   ├── encargo.ts
│   │   ├── graduacion.ts
│   │   └── venta.ts
│   ├── pages/
│   │   ├── login/              # Pantalla de acceso al sistema
│   │   ├── menu/               # Hub central de navegación
│   │   ├── clientes/           # Gestión completa de clientes con ficha clínica
│   │   ├── citas/              # Agenda con calendario semanal y mensual
│   │   ├── inventario/         # Stock y catálogo de productos
│   │   ├── ventas/             # Registro y consulta de ventas
│   │   ├── encargos/           # Pedidos a proveedores y estado de entrega
│   │   └── estadisticas/       # Dashboard con resumen operativo
│   ├── services/               # Servicios HTTP que conectan con la API REST
│   │   ├── auth.service.ts
│   │   ├── cita.service.ts
│   │   ├── cliente.service.ts
│   │   ├── encargo.service.ts
│   │   ├── graduacion.service.ts
│   │   ├── producto.service.ts
│   │   └── venta.service.ts
│   ├── app.config.ts           # Configuración de la app (router, HTTP, interceptores)
│   ├── app.config.server.ts    # Configuración adicional para SSR
│   └── app.routes.ts           # Definición de rutas con authGuard
├── environments/
│   ├── environment.ts          # Desarrollo: apiUrl apunta a localhost:8080
│   └── environment.prod.ts     # Producción: apiUrl se inyecta en build Docker
├── main.ts                     # Bootstrap del cliente
├── main.server.ts              # Bootstrap del servidor SSR
└── server.ts                   # Servidor Express para SSR
```

---

## Variables de entorno (producción)

La URL del backend se inyecta en tiempo de compilación mediante un build argument Docker:

```bash
docker build --build-arg API_URL=https://tu-backend.railway.app -t optibase-front .
```

En desarrollo, la URL se define en `src/environments/environment.ts`.
