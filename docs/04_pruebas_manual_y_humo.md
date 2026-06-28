# Pruebas manuales y humo — Mejoras clave V2

**Versión:** `BS-20260627-213052-HUBV2`  
**Fecha Perú:** 27/06/2026 21:30:52 (America/Lima)

| ID | Acción | Resultado esperado |
|---|---|---|
| HUB-01 | Abrir ficha de expediente | Aparecen pestañas Resumen, Cotizaciones, Pólizas, Alertas, Documentos e Historial. |
| HUB-02 | Abrir Cotizaciones | Se muestran solo cotizaciones cuyo expediente padre coincide con la ficha. |
| HUB-03 | Crear cotización desde ficha | Abre Cotizaciones con expediente preseleccionado; la cotización no se vincula a pólizas. |
| HUB-04 | Filtrar pólizas | Se pueden ver activas, desactivadas, próximas o vencidas. |
| HUB-05 | Abrir Alertas | Se muestran alertas de pólizas y se puede ir a Gestionar. |
| HUB-06 | Adjuntar PDF o imagen | El archivo se guarda en `almacen/expedientes/...` y aparece en Documentos. |
| HUB-07 | Abrir documento | Solo Gerente/Ejecutivo puede abrirlo desde la ficha. |
| HUB-08 | Desactivar documento | Se quita de la lista activa y queda el evento en Historial. |
| COT-12 | Duplicar cotización | Crea una copia con código nuevo y estado En preparación. |
| COT-13 | Duplicar plantilla | Crea una plantilla nueva sin alterar la original. |
