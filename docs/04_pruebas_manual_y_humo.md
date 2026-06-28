# Pruebas manuales y humo — Siniestros Cliente V1

**Versión:** `BS-20260627-223842-CLAIMCLIENTV1`  
**Fecha Perú:** 27/06/2026 22:38:42 (America/Lima)

| ID | Acción | Resultado esperado |
|---|---|---|
| SIN-01 | Iniciar sesión como Cliente | El menú **Mis Siniestros** abre una pantalla funcional. |
| SIN-02 | Seleccionar póliza | Solo aparecen pólizas disponibles para la entidad autenticada. |
| SIN-03 | Registrar reporte con datos obligatorios | Se crea un código `SIN-YYYY-NNNN` y se muestra como **Reportado**. |
| SIN-04 | Intentar fecha futura | El sistema bloquea el registro. |
| SIN-05 | Abrir detalle del reporte | El Cliente ve únicamente sus datos de reporte inicial. |
| SIN-06 | Iniciar sesión como Gerente/Ejecutivo en el mismo navegador | La Línea de tiempo del expediente muestra **Siniestro reportado por cliente**. |
| SIN-07 | Revisar detalle interno | El timeline incluye código, póliza y tipo de reporte, sin exponerlo a otros clientes. |
| SIN-08 | Intentar abrir `mis_siniestros.php` como no Cliente | El acceso queda denegado por el servidor. |
