# Plan incremental de implementación

## Estado actual

- [x] Maqueta visual inicial.
- [x] Login demo por DNI, CE y RUC.
- [x] Contexto de sesión centralizado.
- [x] Dashboard por perfil.
- [x] Protección de páginas privadas y cierre de sesión.
- [x] Documentación viva inicial.

## Siguiente bloque recomendado

### Fase 2: dashboard con datos demo controlados

Crear datos demo centralizados para cada perfil y mostrar indicadores útiles, sin implementar todavía base de datos:

- gerente: resumen global;
- ejecutivo: cartera y tareas;
- empresa/consorcio: seguros y acciones disponibles.

## Fases posteriores

1. Menú dinámico por permisos reales.
2. Módulo mínimo de expedientes.
3. Creación y listado de expedientes temporales.
4. Detalle y cambio de estado.
5. Diseño de tablas MySQL según los datos ya validados.
6. Reemplazo progresivo de datos demo por MySQL.

## Regla de avance

No iniciar una fase mientras la anterior tenga errores funcionales o pruebas de humo pendientes.
