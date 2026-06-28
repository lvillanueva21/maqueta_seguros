# Pruebas manuales — Alertas de pólizas v1

**Versión:** `BS-20260627-211508-ALR`  
**Fecha Perú:** 27/06/2026 21:15:08 (America/Lima)

1. Abrir un expediente con póliza que tenga fecha fin.
2. Usar **Alertas y mensajes** en la tarjeta de póliza.
3. Crear varias alertas de tipo “Faltan X días”.
4. Crear alerta mensual con día 31: en febrero debe considerar el último día del mes.
5. Usar contacto del expediente, modo manual y modo ambos.
6. Insertar variables y abrir la vista previa.
7. Revisar WhatsApp y correo con fecha fin, moneda y monto reales.
8. Marcar una alerta pendiente como gestionada; debe dejar de aparecer pendiente para esa programación.
9. Ir a Inicio: debe mostrar las alertas pendientes.
10. Editar la póliza y guardar: las alertas ya registradas deben mantenerse.

## Límite conocido

La maqueta calcula alertas cuando se abre el sistema. No ejecuta tareas de fondo ni envía mensajes reales.
