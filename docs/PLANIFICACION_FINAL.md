# Planificación Final — OPTIBASE

**Alumno:** Francisco Javier Díaz Martínez  
**Proyecto:** OPTIBASE   
**Curso:** 2025-2026

---

## 1. Resumen ejecutivo

OPTIBASE es una aplicación web de gestión integral pensada para ópticas pequeñas y medianas. La idea surgió porque este tipo de negocios suele trabajar con hojas de cálculo o software genérico que no cubre sus necesidades específicas: llevar el historial de graduaciones de cada cliente, gestionar las citas del óptico, controlar el stock de monturas y lentes, y hacer seguimiento de los encargos pendientes con los proveedores. Con OPTIBASE quería resolver todo eso en una sola aplicación.

El sistema está formado por un backend REST desarrollado con Spring Boot y una base de datos MySQL, y un frontend en Angular desplegados ambos en Railway. Incluye seguridad mediante JWT con dos roles diferenciados (administrador y empleado), de forma que no todo el mundo puede hacer lo mismo dentro de la aplicación. El resultado final es una aplicación funcional, desplegada y accesible desde cualquier navegador.

Empecé el proyecto con una idea clara de lo que quería hacer, aunque al final el alcance creció bastante respecto a lo que tenía planificado inicialmente. Lo que iba a ser un MVP con cuatro módulos acabó siendo seis módulos completos con funcionalidades que no estaban en el plan original, como el módulo de estadísticas o el sistema de encargos a proveedor.

---

## 2. Planificación inicial vs. planificación real

| Hito | Planificación inicial | Fecha prevista | Planificación real | Fecha real (aprox.) |
|------|-----------------------|----------------|--------------------|----------------------|
| H1 | Análisis de requisitos, diseño E-R, script DDL | Semanas 1-2 | Análisis + diseño E-R + DDL. Añadidas entidades no previstas (Encargo, Venta) | Semanas 1-3 |
| H2 | Backend Spring Boot: entidades, JPA, repositorios | Semanas 3-4 | Backend con 8 controladores REST, validaciones, manejo de errores | Semanas 3-5 |
| H3 | Seguridad JWT y roles RBAC | Semana 4 | JWT + RBAC + interceptor Angular + AuthGuard + refresh token | Semanas 4-5 |
| H4 | Frontend Angular: vistas principales y consumo API | Semanas 6-8 | 6 módulos completos con paginación, filtros, ordenación y modales | Semanas 6-9 |
| H5 | Pruebas E2E y corrección de bugs | Semanas 9-10 | Tests JUnit (13 tests), pruebas manuales, corrección de bugs de SSR en producción | Semanas 9-11 |
| H6 | Docker y despliegue | Semana 10 | Despliegue en Railway (3 servicios), scripts de backup, resolución de problemas de CORS y SSR | Semanas 11-12 |

---

## 3. Análisis de desviaciones

**El alcance creció más de lo previsto.**
El MVP inicial contemplaba cuatro módulos: citas, clientes, inventario y seguridad. Durante el desarrollo, al tener ya la estructura montada, añadir los módulos de ventas, encargos y estadísticas no parecía un esfuerzo desproporcionado. Pero cada módulo nuevo implicaba entidad en el backend, controlador REST, servicio Angular, vistas y pruebas, así que el tiempo acumulado fue mayor del esperado. No fue una mala decisión añadirlos, pero sí debería haberlo contemplado desde el principio en la planificación.

**El despliegue fue más complejo de lo previsto.**
Tenía pensado una semana para Docker y despliegue. La realidad fue que Railway tiene sus propias peculiaridades, el frontend en Angular con SSR (Server-Side Rendering) generó errores que no aparecían en local, hubo que configurar variables de entorno distintas para producción, y los problemas de CORS entre el frontend y el backend en dominios diferentes consumieron más tiempo del esperado. Al final opté por deshabilitar SSR para evitar los problemas en producción, algo que no tenía previsto tener que decidir.

**La integración front-back fue el cuello de botella real.**
En local todo funcionaba bien por separado. Los problemas aparecieron al conectar ambas partes: modelos que no coincidían exactamente, endpoints que devolvían datos en un formato que el frontend no esperaba, y el Angular `ChangeDetectorRef` que en producción con SSR no actualizaba la vista después de operaciones de escritura. Resolver esto me llevó varios días que no estaban en el plan.

---

## 4. Grado de coherencia entre lo planificado y lo entregado

El proyecto entregado supera al MVP planificado en número de módulos y funcionalidades. Los cuatro pilares del MVP inicial (citas, clientes, inventario y seguridad JWT) están implementados y funcionando. Además se entregaron dos módulos adicionales completos (ventas y encargos), un dashboard de estadísticas, un sistema de backup con scripts multiplataforma y un despliegue real en producción accesible públicamente.

Las desviaciones en tiempo se compensaron con el alcance ampliado. La planificación por semanas fue orientativa: en la práctica algunas fases se solaparon y hubo semanas de trabajo intensivo seguidas de fases más lentas. Si tuviera que valorar la coherencia global, diría que el proyecto entregado es más completo de lo planificado, pero tardó algo más de lo previsto en llegar a ese punto.
