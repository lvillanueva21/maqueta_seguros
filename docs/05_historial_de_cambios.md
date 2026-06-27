# Historial de cambios

## 27/06/2026 18:35:03 (America/Lima) - BS-20260627-183503-PET - Pólizas v1 y PDF opcional

### Agregado

- Sección Pólizas dentro de la ficha de Expediente.
- Código interno automático `POL-YYYY-NNNN`.
- Cliente histórico tomado desde el expediente.
- Validación obligatoria de título, tipo, aseguradora e inicio/fin de vigencia.
- PDF principal opcional con barra de carga y nombre visible.
- Endpoints de subir, reemplazar, eliminar y visualizar PDF protegido.
- Almacenamiento físico organizado bajo `almacen/polizas`.
- Desactivación con motivo obligatorio.
- Migración de caché para conservar pólizas dentro de Expedientes.
- Protección contra pérdida de pólizas cuando se guarda luego información general del expediente.

### Corregido

- Los activos de notificaciones/modales se incluyen para que los mensajes dentro de diálogos sigan siendo visibles al cargar o reemplazar PDF.

## 27/06/2026 18:01:06 (America/Lima) - BS-20260627-180106-PET - Estabilización visual

- Notificaciones contextuales dentro de modales y capa visual común.
