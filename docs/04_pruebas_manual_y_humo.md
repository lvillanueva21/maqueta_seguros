# Pruebas manuales y de humo

## Versión

| ID | Prueba | Resultado esperado |
|---|---|---|
| FIX-VER-01 | Abrir `docs/00_version_actual.md` después de copiar archivos | Debe mostrar `BS-20260627-191718-PET` y 27/06/2026 19:17:18 (America/Lima). |

## Toast dentro de modal

| ID | Prueba | Resultado esperado |
|---|---|---|
| FIX-TOAST-01 | En Crear Expediente, guardar sin campos obligatorios | El mensaje se ve dentro del modal, debajo del encabezado. |
| FIX-TOAST-02 | En Clientes, intentar RUC duplicado | El mensaje se ve dentro del modal de Clientes. |
| FIX-TOAST-03 | En Pólizas, dejar título vacío | El mensaje se ve dentro de la ficha/modal de Expediente. |
| FIX-TOAST-04 | Guardar póliza correctamente | La ficha se reconstruye y el éxito se ve dentro de la ficha abierta. |

## Pólizas

| ID | Prueba | Resultado esperado |
|---|---|---|
| FIX-POL-01 | Abrir Expediente con Cliente y pulsar Registrar póliza | La ficha cambia a formulario de póliza, no queda en silencio y no abre un modal encima de otro. |
| FIX-POL-02 | Pulsar Volver a ficha o Cancelar | Regresa al mismo Expediente. |
| FIX-POL-03 | Guardar con fin anterior o igual al inicio | Bloquea e informa Vigencia no válida. |
| FIX-POL-04 | Guardar sin PDF | Crea la póliza y muestra Falta PDF de póliza. |
| FIX-POL-05 | Guardar con PDF | Muestra nombre previo, progreso y enlace luego de guardar. |
| FIX-POL-06 | Desactivar una póliza | La ficha cambia a confirmación roja dentro del mismo modal; exige motivo. |
