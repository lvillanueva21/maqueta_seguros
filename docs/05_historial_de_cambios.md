# Historial de cambios

## 27/06/2026 18:01:06 (America/Lima) - BS-20260627-180106-PET - Estabilización de modales y notificaciones

### Corregido

- Los mensajes ahora se muestran dentro del modal activo para evitar que queden detrás de `<dialog>`.
- El toast global se conserva para acciones realizadas fuera de un modal o después de cerrarlo.
- Se creó `assets/css/modal-ui.css` para unificar los estilos de formularios y elementos dinámicos dentro de modales.
- Se reforzaron estados de foco, checkbox, filas repetibles, ayudas y acciones de Clientes, Catálogos y Expedientes.
- Se añadieron pruebas de humo específicas para capas de modal, toast y diseño responsive.

## 27/06/2026 17:37:44 (America/Lima) - BS-20260627-173744-PET - Clientes v1

- Empresas, Consorcios y Contactos de gestión integrados a Expedientes.
