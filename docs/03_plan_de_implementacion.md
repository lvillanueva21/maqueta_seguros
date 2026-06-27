# Plan incremental de implementación

## Estado actual

- [x] Maqueta visual inicial.
- [x] Login demo por DNI, CE y RUC.
- [x] Contexto de sesión centralizado.
- [x] Dashboard con datos demo controlados por perfil.
- [x] Navegación lateral fija y cierre de sesión siempre accesible.
- [x] Marca oficial BROKER SEGUROS centralizada.
- [x] Matriz inicial de permisos y rutas controladas por servidor.
- [x] Documentación viva y versión de entrega trazable.
- [ ] Pruebas manuales pendientes de la matriz de permisos.

## Siguiente bloque recomendado

### Fase 4: Catálogos demo básicos

Antes de crear expedientes, definir en una sola fuente los datos maestros que usarán los formularios futuros:

- aseguradoras;
- tipos y familias de seguros;
- monedas;
- estados de expediente;
- estados de póliza;
- estados de pago;
- estados de siniestro.

Resultado mínimo esperado:

- página Catálogos accesible solo para gerente y ejecutivo;
- lectura de catálogos demo desde configuración central;
- vista de listas y estados;
- gerente con acciones simuladas de crear/editar/activar;
- ejecutivo con solo consulta;
- rutas y permisos reutilizables para el siguiente módulo.

## Fases posteriores

1. Módulo mínimo de expedientes.
2. Creación y listado de expedientes temporales.
3. Detalle y cambio de estado.
4. Diseño de tablas MySQL según los datos ya validados.
5. Reemplazo progresivo de datos demo por MySQL.

## Regla de avance

No iniciar una fase mientras la anterior tenga errores funcionales o pruebas de humo pendientes.
