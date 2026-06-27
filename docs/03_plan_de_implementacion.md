# Plan incremental de implementación

## Estado actual

- [x] Maqueta visual inicial.
- [x] Login demo por DNI, CE y RUC.
- [x] Contexto de sesión centralizado.
- [x] Dashboard por perfil.
- [x] Dashboard con datos demo controlados por perfil.
- [x] Protección de páginas privadas y cierre de sesión.
- [x] Documentación viva inicial.

## Siguiente bloque recomendado

### Fase 3: menú y permisos de módulos

Definir una matriz inicial de permisos y hacer que los módulos en construcción respeten el perfil autenticado desde servidor, no solo ocultando opciones visualmente.

Resultado mínimo esperado:

- gerente ve módulos globales;
- ejecutivo ve módulos operativos;
- empresa y consorcio ven únicamente opciones de consulta;
- acceso directo a un módulo no permitido muestra una página controlada;
- las reglas quedan centralizadas para reutilizarlas cuando los módulos sean reales.

## Fases posteriores

1. Catálogos demo básicos.
2. Módulo mínimo de expedientes.
3. Creación y listado de expedientes temporales.
4. Detalle y cambio de estado.
5. Diseño de tablas MySQL según los datos ya validados.
6. Reemplazo progresivo de datos demo por MySQL.

## Regla de avance

No iniciar una fase mientras la anterior tenga errores funcionales o pruebas de humo pendientes.
