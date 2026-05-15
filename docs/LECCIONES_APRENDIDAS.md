# Lecciones Aprendidas — OPTIBASE

**Alumno:** Francisco Javier Díaz Martínez  
**Proyecto:** OPTIBASE — ERP para el sector óptico  
**Curso:** 2025-2026

---

## 1. Qué he hecho bien y repetiría

**Separar completamente el frontend del backend desde el principio.**
Tener dos proyectos independientes en el repositorio, con sus propios package.json, pom.xml y ciclos de vida, facilitó mucho el trabajo. Podía arrancar solo el backend para probar los endpoints con Postman sin necesitar el frontend, y viceversa. Esta separación clara me ahorró problemas de dependencias cruzadas.

**Usar JWT con roles desde el día uno.**
Integrar la seguridad al principio, no como un añadido al final, hizo que todo el diseño de la API tuviera en cuenta los permisos desde el inicio. Los controladores del backend ya nacieron con las anotaciones de seguridad correctas, y el interceptor del frontend gestionaba el token automáticamente en todas las peticiones. Si lo hubiera dejado para el final habría tenido que refactorizar medio proyecto.

**El diseño visual.**
Decidí apostar por un estilo industrial y brutalista en lugar de usar un framework de componentes genérico como Bootstrap o Material. Fue más trabajo, pero el resultado es una aplicación que tiene una identidad visual propia y que se distingue claramente de cualquier proyecto típico de DAW. Estoy satisfecho con cómo quedó la interfaz.

**Documentar las incidencias a medida que ocurrían.**
Cada vez que encontraba un bug significativo o un problema de configuración, lo anotaba. Al final esa bitácora resultó útil para escribir la memoria y para no repetir dos veces el mismo error. Es algo que en proyectos anteriores nunca hacía y que voy a seguir haciendo.

---

## 2. Errores que no volvería a cometer

**Subir credenciales al repositorio.**
En algún momento del desarrollo, un archivo de configuración con credenciales de la base de datos llegó a un commit. Aunque lo resolví eliminándolo y rotando las credenciales, el daño ya estaba hecho: ese commit existe en el historial. Desde entonces uso variables de entorno para todo lo sensible y tengo un `.gitignore` revisado antes del primer commit.

**No separar los entornos de desarrollo y producción desde el principio.**
Durante semanas trabajé con una sola configuración que mezclaba URLs locales con ajustes que luego necesitaba cambiar para producción. Cuando llegó el momento del despliegue tuve que hacer ajustes en varios sitios a la vez, lo que generó confusión y algún bug difícil de rastrear. Lo correcto habría sido tener `environment.ts` y `environment.prod.ts` bien diferenciados desde el día uno, y lo mismo en el backend con perfiles de Spring.

**No probar SSR en producción antes de la última semana.**
Angular con SSR funciona diferente en servidor que en el navegador. Hay APIs del DOM que no existen en Node.js, y el `ChangeDetectorRef` se comporta de forma distinta. Descubrí todo esto cuando ya estaba intentando desplegar, con el proyecto prácticamente terminado. Me costó días entender qué fallaba y por qué funcionaba en local pero no en Railway. Tendría que haber probado el build de producción desde mucho antes.

**Dejar que los modelos del frontend y el backend se desincronizaran.**
Hubo un momento en el que añadí un campo nuevo a una entidad del backend y no actualicé el modelo TypeScript del frontend, ni al revés. El resultado fue que los datos llegaban pero el componente no los pintaba, o viceversa. Sin un contrato API formal, estas desincronizaciones son difíciles de detectar a simple vista. Tener un documento de definición de endpoints o usar algo como OpenAPI desde el principio habría evitado estos problemas.

---

## 3. Tres mejoras para una versión 2

### Mejora 1: Tests desde el principio, no al final

En OPTIBASE los tests JUnit llegaron casi al final del desarrollo. Funcionan, cubren los casos principales y pasan los 13 sin fallos, pero los escribí cuando el código ya estaba terminado. En una segunda versión empezaría con tests unitarios básicos desde el primer controlador, no como requisito de entrega sino como herramienta de trabajo. Detectar un bug en el momento en que lo introduces es mucho más barato que encontrarlo tres semanas después.

### Mejora 2: Diseñar el contrato API antes de codificar front y back por separado

Lo que ocurrió en este proyecto es que el backend y el frontend avanzaron en paralelo pero sin un acuerdo formal sobre los endpoints, los DTOs y los formatos de respuesta. Cada vez que el backend cambiaba algo, el frontend podía romperse sin que nadie lo notara hasta el momento de integrarlo. En la versión 2 definiría primero un documento OpenAPI o similar con todos los endpoints, campos y tipos de dato, y solo después empezaría a codificar ambas partes. Así los cambios son conscientes y coordinados.

### Mejora 3: Configurar el entorno de producción desde el inicio

El despliegue no debería ser la última fase del proyecto, sino algo que se configura en la primera semana y se mantiene actualizado. Si desde el principio hubiera tenido un pipeline básico que desplegara automáticamente en Railway con cada push a `main`, habría detectado los problemas de CORS y SSR mucho antes. El despliegue continuo no es un lujo, es una red de seguridad.

---

## 4. Valoración personal

Este proyecto me ha enseñado más que cualquier asignatura suelta del ciclo. No porque el temario fuera mejor, sino porque tuve que tomar decisiones reales: qué tecnología usar, cómo estructurar el código, qué hacer cuando algo no funcionaba y no había nadie que me diera la solución. Hubo momentos de frustración, especialmente con el despliegue y los problemas de SSR, pero también la satisfacción de ver la aplicación funcionando en producción con un dominio real compensa todo eso.

Si soy honesto, el proyecto podría estar mejor organizado desde el principio. Hay decisiones que tomé deprisa porque quería avanzar y que luego tuve que rehacer. Pero también es verdad que algunas de esas decisiones las tomé mejor precisamente porque ya había cometido el error antes. OPTIBASE no es perfecto, pero es funcional, está desplegado y lo entiendo de principio a fin. Para un primer proyecto de esta escala, eso me parece suficiente.
