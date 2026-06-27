# Historial de cambios

## 27/06/2026 13:33:02 (America/Lima) - BS-20260627-133302-PET - Auditoria y estabilizacion tecnica

### Corregido

- Se centralizo la migracion de cache local en `assets/js/cache-migrations.js`.
- Catalogos y Expedientes usan la misma migracion de situaciones antiguas.
- Expedientes migra `broker_seguros_demo_expedients_v1` hacia `broker_seguros_demo_expedients_v2` sin conservar `management_type` como dato visible o funcional.
- Los codigos `EXP-AAAA-NNNN` usan el anio de Lima y consideran datos guardados antes de generar el siguiente correlativo.
- Las fechas `YYYY-MM-DD` se muestran sin conversion UTC para evitar cambios de dia.
- Se elimino `window.confirm()` de Catalogos y se reemplazo por confirmacion con `window.BrokerNotify`.
- Se redujeron mensajes duplicados para una sola accion.
- Se corrigio la descripcion del modulo Expedientes para reflejar necesidades o casos del cliente.

### Limitaciones documentadas

- `localStorage` no reemplaza autorizacion real de servidor.
- La unicidad de codigos entre varias pestanas solo se mitiga en maqueta; MySQL debera garantizarla.
- Los permisos y filtros deben validarse en backend cuando exista persistencia real.

## 27/06/2026 13:11:27 (America/Lima) - BS-20260627-131127-PET - Correccion de Expedientes y modelo de cotizacion

### Corregido

- Se elimino el campo incorrecto Tipo de gestion.
- Se retiraron del expediente raiz los campos Tipo de seguro, Aseguradora y Moneda.
- Se reemplazo el supuesto flujo de gestion por un expediente flexible que puede existir sin cotizacion ni seguro.
- Se cambiaron los estados por situaciones generales: Abierto, En seguimiento, En espera, Cerrado y Cancelado.
- Se elimino cualquier relacion obligatoria entre expediente y cotizacion.
- Se agrego `quotes[]` como base opcional para cotizaciones futuras.
- Se ajusto la tabla, los filtros, resumen y ficha de expediente.

### Pendiente

- Disenar el modulo de plantillas de cotizacion.
- Crear cotizaciones demo opcionales dentro de un expediente.
- Persistencia con MySQL.

## 27/06/2026 12:54:39 (America/Lima) - BS-20260627-125439-PET - Notificaciones globales

### Implementado

- Toasts de exito, error, advertencia e informacion.
- Confirmaciones de acciones temporales.

## 27/06/2026 12:39:37 (America/Lima) - BS-20260627-123937-PET - Expedientes demo v1

### Nota historica

Esta primera version fue reemplazada funcionalmente porque trataba el expediente como un tipo de gestion y exigia campos que deben pertenecer a cotizaciones opcionales.
