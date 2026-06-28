# Pruebas manuales y humo — Portal Cliente V1

**Versión:** `BS-20260627-215413-CLIENTV1`  
**Fecha Perú:** 27/06/2026 21:54:13 (America/Lima)

| ID | Acción | Resultado esperado |
|---|---|---|
| CLI-01 | Iniciar sesión como empresa cliente | El menú abre `Mis Seguros` sin acceso a Expedientes internos. |
| CLI-02 | Abrir Mis Seguros | Muestra métricas de pólizas, vencimientos y gestiones asociadas. |
| CLI-03 | Ver Mis pólizas | Solo muestra pólizas activas asociadas por entidad, nombre o documento del cliente. |
| CLI-04 | Filtrar Vigentes / Próximas / Vencidas | Las tarjetas cambian según la vigencia real de cada póliza. |
| CLI-05 | Ver detalle de póliza | Muestra datos públicos: código, aseguradora, vigencia, suma asegurada y gestión relacionada. |
| CLI-06 | Ver Mis gestiones | Muestra código, título, estado público y fechas, sin exponer notas ni cotizaciones internas. |
| CLI-07 | Ver detalle de gestión | No se muestran alertas, documentos, historial, contactos ni observaciones internas. |
| CLI-08 | Intentar abrir Expedientes por URL | El servidor debe negar acceso al perfil Cliente. |
