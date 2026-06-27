# Versión actual entregada

- **Código de versión:** `BS-20260627-180106-PET`
- **Fecha y hora de entrega:** 27/06/2026 18:01:06 (America/Lima)
- **Zona horaria:** Perú - America/Lima
- **Bloque funcional:** Estabilización visual de modales y notificaciones contextuales.
- **Estado de esta versión:** Paquete preparado localmente. Debe integrarse, probarse y subirse manualmente a GitHub `main`. Hostinger se verifica por separado.

## Base remota revisada antes de generar esta versión

- Repositorio: `lvillanueva21/maqueta_seguros`
- Rama: `main`
- Versión remota encontrada: `BS-20260627-173744-PET`
- SHA de `docs/00_version_actual.md`: `3666973595df90d75c719e0a58d17c1a2d500904`

## Correcciones incluidas

1. Cuando existe un modal abierto, los mensajes de éxito, error, advertencia e información aparecen dentro del modal activo.
2. Cuando no existe modal, las notificaciones continúan en la esquina superior derecha.
3. Las acciones que cierran el modal antes de notificar conservan el toast global.
4. Las confirmaciones por notificación resuelven correctamente al confirmar, cancelar o cerrar con `×`.
5. Se crea una capa común de estilos para inputs, selects, textarea, checkbox, bloques repetibles, ayudas y acciones dentro de modales.
6. Se refuerzan los estilos de formularios generados dinámicamente en Clientes, Catálogos y Expedientes.
7. Las hojas de notificaciones y modales se cargan con versión visible `BS-20260627-180106-PET` para reducir el riesgo de CSS antiguo en caché.

## Prueba visual pendiente

La sintaxis puede verificarse localmente, pero el comportamiento de capas `<dialog>` y el caché del navegador deben probarse en navegador real después de integrar.
