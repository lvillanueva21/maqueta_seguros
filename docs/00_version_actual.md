# Versión actual entregada

- **Código de versión:** `BS-20260627-193319-PET`
- **Fecha y hora de entrega:** 27/06/2026 19:33:19 (America/Lima)
- **Zona horaria:** Perú - America/Lima
- **Bloque:** Recuperación estable de Expedientes y Pólizas v1 para despliegue manual.
- **Estado:** Paquete preparado localmente para reemplazar manualmente los archivos indicados en `public_html/maqueta/`.

## Base revisada

- Versión base en GitHub: `BS-20260627-191718-PET`.
- Se sustituyen cargadores dinámicos frágiles por enlaces directos desde `expedientes.php`.
- Se reemplaza el observador de cambios que podía re-renderizar la ficha repetidamente.

## Correcciones principales

1. `expedientes.php` se incluye de nuevo en el paquete para evitar su ausencia en Hostinger.
2. CSS y JavaScript de Pólizas se enlazan de forma directa y versionada.
3. Registrar póliza usa una vista interna de la ficha, no un segundo modal.
4. La ficha emite un evento explícito al renderizarse; Pólizas no usa bucles de observación del DOM.
5. Toast dentro de modal se inserta en el modal abierto.
6. Valores de inputs, selects y textarea vuelven a peso normal.
7. Se agrega Cancelar en Actualizar información.
8. Se incluyen nuevamente `api/` y `almacen/` para no depender de paquetes anteriores.
