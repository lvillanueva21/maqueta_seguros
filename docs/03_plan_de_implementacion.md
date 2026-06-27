# Plan incremental de implementación

## Estado actual

- [x] Maqueta visual inicial.
- [x] Login demo por DNI, CE y RUC.
- [x] Contexto de sesión centralizado.
- [x] Dashboard con datos demo controlados por perfil.
- [x] Navegación lateral fija y cierre de sesión siempre accesible.
- [x] Marca oficial BROKER SEGUROS centralizada.
- [x] Matriz inicial de permisos y rutas controladas por servidor.
- [x] Catálogos demo básicos.
- [x] Expedientes demo v1: crear, listar, filtrar, ver ficha y cambiar estado.
- [x] Documentación viva y versión de entrega trazable.
- [ ] Pruebas manuales pendientes del módulo Expedientes.

## Siguiente bloque recomendado

### Fase 6: Detalle ampliado y línea de tiempo del expediente

Sin crear todavía base de datos, validar qué eventos deben quedar registrados durante una gestión.

Alcance mínimo:

- línea de tiempo automática de creación y cambio de estado;
- registro de observaciones manuales;
- próxima acción y fecha objetivo;
- responsable de la acción;
- sección de requisitos y documentos pendientes simulados;
- historial visible dentro de la ficha;
- seguimiento separado por expediente.

## Fases posteriores

1. Clientes demo vinculables y ficha de cliente.
2. Diseño de tablas MySQL según los datos ya validados.
3. Reemplazo progresivo de datos demo por MySQL.
4. Pólizas, pagos, documentos y siniestros vinculados a expedientes.

## Regla de avance

No iniciar una fase mientras la anterior tenga errores funcionales o pruebas de humo pendientes.
