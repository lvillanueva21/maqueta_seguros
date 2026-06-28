# Versión actual entregada

- **Código de versión:** `BS-20260627-191718-PET`
- **Fecha y hora de entrega:** 27/06/2026 19:17:18 (America/Lima)
- **Zona horaria:** Perú - America/Lima
- **Bloque funcional:** Corrección de notificaciones dentro de modal y apertura de Pólizas v1 dentro de la ficha de Expediente.
- **Estado de esta versión:** Paquete preparado localmente para subir manualmente a Hostinger y luego a GitHub `main`.

## Base revisada

- Versión base: `BS-20260627-183503-PET`.
- La revisión detectó que la primera versión abría la edición de póliza como un segundo `<dialog>` y que los toast podían crearse fuera del diálogo activo.

## Correcciones

1. Las notificaciones ahora se insertan como hijo directo del modal abierto.
2. Un toast dentro de un modal no depende de `z-index` global ni queda detrás de la capa `<dialog>`.
3. Registrar póliza ya no abre un segundo modal.
4. El formulario de póliza reemplaza temporalmente el contenido de la ficha de Expediente.
5. Volver o cancelar reconstruye la ficha del mismo expediente.
6. Ante cualquier expediente no identificado se muestra un error claro, nunca una acción silenciosa.
7. Se conserva la carga y reemplazo de PDF, la validación de vigencia y la desactivación con motivo.
