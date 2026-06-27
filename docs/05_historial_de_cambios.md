# Historial de cambios

## 27/06/2026 12:54:39 (America/Lima) — BS-20260627-125439-PET — Notificaciones globales y mensajes amigables

### Implementado

- Nuevo estilo global `assets/css/notifications.css`.
- Sistema `window.BrokerNotify` inicializado desde `assets/js/app.js`.
- Mensajes de éxito, error, advertencia e información con cierre manual.
- Confirmación de creación de expedientes y actualización de estados.
- Confirmación de alta, edición, activación, desactivación y restauración de catálogos.
- Mensajes amigables cuando faltan campos obligatorios.
- Reemplazo visual de alertas de error de Catálogos por notificaciones.
- Aviso explícito de que los datos aún se guardan solo en el navegador.
- Actualización de documentación, pruebas y versión trazable.

### Decisión técnica

La primera versión se integró desde `app.js` para que los módulos existentes y los próximos puedan reutilizar `window.BrokerNotify` sin duplicar librerías ni depender de servicios externos.

### Pendiente

- Ejecutar pruebas NOT-01 a NOT-10.
- Línea de tiempo, observaciones y próxima acción de Expedientes.
- Persistencia con MySQL y notificaciones basadas en respuesta de servidor.

## 27/06/2026 12:39:37 (America/Lima) — BS-20260627-123937-PET — Expedientes demo v1

### Implementado

- Módulo protegido Expedientes.
- Creación, listado, filtros, ficha y cambio temporal de estado.
- Visibilidad por gerente o ejecutivo responsable.

## 27/06/2026 12:28:26 (America/Lima) — BS-20260627-122826-PET — Catálogos demo básicos

### Implementado

- Catálogos demo para gerente y ejecutivo.
