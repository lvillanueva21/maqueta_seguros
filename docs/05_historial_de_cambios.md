# Historial de cambios

## 27/06/2026 13:11:27 (America/Lima) — BS-20260627-131127-PET — Corrección de Expedientes y modelo de cotización

### Corregido

- Se eliminó el campo incorrecto **Tipo de gestión**.
- Se retiraron del expediente raíz los campos Tipo de seguro, Aseguradora y Moneda.
- Se reemplazó el supuesto flujo de gestión por un expediente flexible que puede existir sin cotización ni seguro.
- Se cambiaron los estados por situaciones generales: Abierto, En seguimiento, En espera, Cerrado y Cancelado.
- Se eliminó cualquier relación obligatoria entre expediente y cotización.
- Se agregó `quotes[]` como base opcional para cotizaciones futuras.
- Se ajustó la tabla, los filtros, resumen y ficha de expediente.
- Se incorporó migración local desde los datos guardados de Expedientes v1 y de las situaciones antiguas de Catálogos.
- Se corregió la integración de notificaciones para que Catálogos y Expedientes comuniquen directamente sus propios éxitos y fallos.

### Decisión de arquitectura

Las cotizaciones serán entidades hijas opcionales de un expediente y se construirán desde plantillas configurables. Una plantilla podrá definir ítems personalizados, alternativas de aseguradoras, tipos de seguro, advertencias, mensajes, notas, coberturas, deducibles y condiciones sin forzar esos datos en todos los expedientes.

### Pendiente

- Ejecutar pruebas EXP-COR-01 a EXP-COR-10.
- Diseñar el módulo de plantillas de cotización.
- Crear cotizaciones demo opcionales dentro de un expediente.
- Persistencia con MySQL.

## 27/06/2026 12:54:39 (America/Lima) — BS-20260627-125439-PET — Notificaciones globales

### Implementado

- Toasts de éxito, error, advertencia e información.
- Confirmaciones de acciones temporales.

## 27/06/2026 12:39:37 (America/Lima) — BS-20260627-123937-PET — Expedientes demo v1

### Nota histórica

Esta primera versión fue reemplazada funcionalmente por la corrección actual porque trataba el expediente como un tipo de gestión y exigía campos que deben pertenecer a cotizaciones opcionales.
