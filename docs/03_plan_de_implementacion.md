# Plan incremental de implementación

## Estado actual

- [x] Maqueta visual inicial.
- [x] Login demo por DNI, CE y RUC.
- [x] Contexto de sesión centralizado.
- [x] Dashboard con datos demo controlados por perfil.
- [x] Matriz inicial de permisos y rutas controladas por servidor.
- [x] Catálogos demo básicos.
- [x] Expedientes demo corregidos como contenedores flexibles.
- [x] Notificaciones globales y mensajes amigables.
- [x] Documentación viva y versión de entrega trazable.
- [ ] Pruebas manuales pendientes de la corrección de Expedientes.

## Siguiente bloque recomendado

### Fase 6: Plantillas configurables de cotización — diseño base

Antes de crear cotizaciones completas, se debe construir la configuración que definirá sus campos.

Alcance mínimo:

- crear una plantilla de cotización;
- definir ítems personalizados por plantilla;
- tipos de ítem iniciales: texto, número, fecha, selección, booleano y texto largo;
- definir ayuda, advertencias, mensajes y notas por plantilla;
- dejar preparada la relación opcional entre expediente y cotización;
- no obligar a que un expediente tenga cotización;
- no incluir todavía emisión, póliza, pagos ni vouchers.

## Fases posteriores

1. Cotización demo basada en una plantilla.
2. Alternativas de aseguradora y seguros dentro de una cotización.
3. Requisitos, documentos, observaciones y línea de tiempo del expediente.
4. Diseño de tablas MySQL según los datos ya validados.
5. Pólizas, pagos y vouchers vinculados cuando corresponda.

## Regla de avance

No iniciar una fase mientras la anterior tenga errores funcionales o pruebas de humo pendientes.
