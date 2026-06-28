# Pruebas manuales y humo — Estabilización Pre-Demo V1

**Versión:** `BS-20260627-231256-PREDEMO`  
**Fecha Perú:** 27/06/2026 23:12:56 (America/Lima)

| ID | Acción | Resultado esperado |
|---|---|---|
| DEMO-01 | Ingresar como Gerente a Inicio | Aparece **Restablecer escenario demo**. |
| DEMO-02 | Restablecer escenario demo | Se cargan Constructora Norte y Consorcio Vías del Norte con datos de muestra. |
| DEMO-03 | Ingresar como Cliente Empresa | Mis Seguros muestra POL-2026-0001, pagos y SIN-2026-0001. |
| DEMO-04 | Abrir PDF desde Mis Seguros Empresa | Se abre el PDF demostrativo autorizado. |
| DEMO-05 | Ingresar como Cliente Consorcio | Mis Seguros muestra POL-2026-0002 y no muestra registros de Constructora. |
| DEMO-06 | Abrir el PDF de Constructora con sesión Consorcio | El servidor niega el acceso. |
| DEMO-07 | Crear/editar póliza y subir PDF interno | El nuevo PDF guarda archivo auxiliar de autorización con el documento del cliente. |
| DEMO-08 | Reemplazar PDF | Se elimina también el archivo auxiliar `.meta` del PDF anterior. |
| DEMO-09 | Cliente abre Mis Pagos y Mis Siniestros | Se muestran rutas funcionales, sin pantalla genérica. |
| DEMO-10 | Gerente abre Historial de EXP-2026-0001 | Se ven eventos de póliza, pago y siniestro de demostración. |
