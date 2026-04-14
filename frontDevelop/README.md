# OPTIBASE // FrontDevelop

Sistema integral de gestión (ERP) diseñado específicamente para el sector óptico y clínico. Este directorio contiene el módulo **Frontend** de la aplicación, desarrollado con enfoque en el rendimiento, la densidad de datos y un diseño UI industrial.

---

## Stack Tecnológico

* **Framework:** Angular 21.2.0
* **Estilos:** Tailwind CSS (Sistema de utilidades)
* **Lenguaje:** TypeScript / HTML5
* **Arquitectura:** SPA (Single Page Application) dentro de un entorno Monorepo.

## Sistema de Diseño (UI/UX)

La interfaz de Optibase sigue un paradigma de diseño **Industrial / Brutalista**:
* **Contraste Alto:** Paleta estricta de blancos, negros (`gray-950`) y grises. Eliminación de colores de estado genéricos.
* **Estructura Mecánica:** Bordes sólidos (2px - 4px), sombras duras (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`) y componentes tipo "bloque".
* **Tipografía:** Fuentes Sans-serif para encabezados masivos y fuentes `mono` para datos técnicos y registros de base de datos. Respeto absoluto al formato original de los datos (minúsculas y tildes reales).

## Módulos Actuales

1. **Autenticación (`/login`):** Acceso seguro al sistema. Rutas protegidas mediante redirecciones comodín.
2. **Dashboard / Menú (`/menu`):** Hub central de navegación estructurado en grandes bloques modulares interactivos.
3. **Gestor de Clientes (`/clientes`):** Tabla de alta densidad para registros clínicos con motor de búsqueda interactivo (Nombre, Apellidos, DNI) y paginación mecánica integrada.

---

## Configuración y Despliegue Local

### 1. Requisitos previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) y Angular CLI de forma global:

```bash
npm install -g @angular/cli
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Arrancar el servidor de desarrollo

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`.

> ⚠️ El backend debe estar corriendo en `http://localhost:8080` antes de arrancar el frontend.

### 4. Credenciales de acceso

| Usuario | Contraseña |
|---------|------------|
| admin   | admin      |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── guards/          # Protección de rutas (AuthGuard)
│   ├── interceptors/    # Interceptor JWT
│   ├── models/          # Interfaces de datos
│   ├── pages/
│   │   ├── login/       # Pantalla de acceso
│   │   ├── menu/        # Dashboard principal
│   │   ├── clientes/    # Gestión de clientes
│   │   ├── citas/       # Gestión de citas
│   │   └── inventario/  # Gestión de inventario
│   └── services/        # Servicios HTTP
└── index.html
```