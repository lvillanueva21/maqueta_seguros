# Historial de cambios

## 27/06/2026 16:41:01 (America/Lima) - BS-20260627-164101-PET - Contactos de gestión y Expedientes v3

### Corregido

- Se reemplazó la asignación errónea `Ejecutivo responsable` por el concepto correcto `Contacto de gestión`.
- Se eliminó el filtro de expedientes por ejecutivo asignado.
- Gerente y ejecutivo ahora consultan y trabajan sobre todos los expedientes de la maqueta.
- Crear expediente exige contacto de gestión, nombre y descripción.
- Cliente o entidad queda opcional al inicio y se muestra como pendiente cuando aún no existe.
- Se incorporó registro rápido de contactos con nombre y celular obligatorios.
- Se habilitó editar datos básicos del expediente desde su ficha.
- Se migró la caché de expedientes desde v1/v2 hacia `broker_seguros_demo_expedients_v3`.
- Los antiguos datos de ejecutivo se conservan solo como referencia técnica de migración y no se convierten en contactos.
- Se actualizó documentación, plan y pruebas al modelo maestro validado.

## 27/06/2026 13:54:48 (America/Lima) - BS-20260627-135448-PET - Trazabilidad y confirmaciones

### Corregido

- Se actualizó la trazabilidad de versión y confirmaciones por toast.
- `window.BrokerNotify.confirm()` resuelve `false` al cerrar con `x`.

## 27/06/2026 13:33:02 (America/Lima) - BS-20260627-133302-PET - Auditoría y estabilización técnica

### Corregido

- Migraciones locales centralizadas, fechas Lima, permisos demo y notificaciones.
