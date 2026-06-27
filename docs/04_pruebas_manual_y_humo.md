# Pruebas manuales y de humo

## Versión

| ID | Prueba | Resultado esperado |
|---|---|---|
| VER-01 | Abrir `docs/00_version_actual.md` luego del push | Debe aparecer `BS-20260627-180106-PET`. |
| VER-02 | Revisar fecha y hora | Debe indicar 27/06/2026 18:01:06 (America/Lima). |

## Modales y notificaciones

| ID | Prueba | Resultado esperado |
|---|---|---|
| MOD-01 | Abrir Crear expediente y dejar un campo obligatorio vacío | La advertencia aparece dentro del modal, debajo del encabezado; no detrás. |
| MOD-02 | Registrar contacto rápido dentro de Crear expediente | El éxito aparece dentro del mismo modal y no se oculta. |
| MOD-03 | Guardar un expediente que cierra el modal | El modal se cierra y el éxito aparece en la esquina superior derecha. |
| MOD-04 | Abrir Crear empresa, dejar razón social y RUC vacíos | La advertencia aparece dentro del modal de Clientes. |
| MOD-05 | Intentar RUC duplicado en Clientes | El error aparece dentro del modal de Clientes. |
| MOD-06 | Desactivar Empresa, Contacto o Consorcio | El aviso o confirmación se mantiene visible y accionable dentro del modal activo. |
| MOD-07 | Abrir Agregar elemento en Catálogos y dejar Código vacío | La advertencia aparece dentro del modal de Catálogos. |
| MOD-08 | Cerrar un aviso de confirmación con `×` | Se cierra el aviso y no se ejecuta la acción. |
| MOD-09 | Revisar modal de Clientes con vínculos o participantes | Inputs, selects, checkbox, botones y filas repetibles mantienen bordes, espaciado y foco consistentes. |
| MOD-10 | Reducir navegador a 680px o menos | Los formularios y acciones se apilan sin cortes ni desbordes. |
| MOD-11 | Recargar tras el despliegue | Los nuevos estilos de notificación y modal deben aparecer; si no, usar recarga forzada una sola vez. |

## Limitaciones deliberadas

- Los cambios demo viven en `localStorage`.
- No se puede certificar caché de Hostinger desde GitHub; la verificación final requiere navegador real.
