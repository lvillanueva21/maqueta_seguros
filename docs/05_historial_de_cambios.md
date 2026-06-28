# Historial de cambios

## 27/06/2026 19:33:19 (America/Lima) — BS-20260627-193319-PET — Recuperación Expedientes y Pólizas

- Se reconstruye `expedientes.php` como archivo incluido en el paquete de recuperación.
- Se cargan explícitamente `polizas.css` y `polizas.js`.
- Se elimina la carga dinámica de Pólizas desde migraciones de caché.
- Se elimina la observación de DOM que podía causar re-render continuo de la sección Pólizas.
- Se crea integración estable por evento `broker:expedient-detail-rendered`.
- Se añade API interna `window.BrokerExpedients` para que Pólizas use el expediente abierto de forma confiable.
- Se añade Cancelar en Actualizar información.
- Se corrige herencia de negrita en controles de formularios.
- Se conservan endpoints y almacenamiento protegido para PDF.
