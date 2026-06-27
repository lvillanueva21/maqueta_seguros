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
- [x] Documentación viva y versión de entrega trazable.
- [ ] Pruebas manuales pendientes del módulo Catálogos.

## Siguiente bloque recomendado

### Fase 5: Expedientes demo — primera versión operativa

Construir el primer núcleo de negocio sin MySQL usando almacenamiento local del navegador.

Alcance mínimo:

- crear expediente;
- asociar cliente, tipo de seguro, aseguradora, moneda y ejecutivo;
- generar código demo automático;
- listar expedientes con filtros;
- abrir una ficha simple;
- cambiar estado usando los estados de expediente;
- guardar los cambios temporalmente en el navegador;
- aplicar permisos: gerente y ejecutivo pueden gestionarlos; cliente solo podrá ver sus solicitudes cuando se agregue su vista.

## Fases posteriores

1. Detalle ampliado y línea de tiempo del expediente.
2. Diseño de tablas MySQL según los datos ya validados.
3. Reemplazo progresivo de datos demo por MySQL.
4. Pólizas, pagos, documentos y siniestros vinculados a expedientes.

## Regla de avance

No iniciar una fase mientras la anterior tenga errores funcionales o pruebas de humo pendientes.
