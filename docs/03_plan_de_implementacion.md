# Plan incremental de implementación

## Estado actual

- [x] Maqueta visual inicial.
- [x] Login demo por DNI, CE y RUC.
- [x] Contexto de sesión centralizado.
- [x] Dashboard por perfil.
- [x] Dashboard con datos demo controlados por perfil.
- [x] Navegación lateral fija y cierre de sesión siempre accesible.
- [x] Marca oficial BROKER SEGUROS centralizada.
- [x] Protección de páginas privadas y cierre de sesión.
- [x] Documentación viva inicial.

## Siguiente bloque recomendado

### Fase 3: matriz de permisos y acceso controlado a módulos

Antes de construir expedientes, clientes o pólizas, se debe separar la navegación visual de los permisos reales.

Resultado mínimo esperado:

- catálogo único de módulos del sistema;
- definición de qué roles pueden acceder a cada módulo;
- menú generado desde esa definición;
- una página controlada de acceso no autorizado;
- validación en servidor al abrir cada módulo, no solo ocultamiento visual;
- documentación de la matriz de permisos y sus pruebas.

## Fases posteriores

1. Catálogos demo básicos.
2. Módulo mínimo de expedientes.
3. Creación y listado de expedientes temporales.
4. Detalle y cambio de estado.
5. Diseño de tablas MySQL según los datos ya validados.
6. Reemplazo progresivo de datos demo por MySQL.

## Regla de avance

No iniciar una fase mientras la anterior tenga errores funcionales o pruebas de humo pendientes.
