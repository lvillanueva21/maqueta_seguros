# Reglas técnicas

## Marca y textos visibles

1. El nombre oficial visible del sistema es **BROKER SEGUROS**.
2. El nombre del repositorio no define el nombre de la aplicación.
3. Los textos de marca deben obtenerse de `APP_NAME` y `APP_SHORT_NAME` en `config/bootstrap.php`.

## Versionado y trazabilidad

1. Toda entrega actualiza `docs/00_version_actual.md` y `docs/05_historial_de_cambios.md`.
2. La versión usa el formato `BS-YYYYMMDD-HHMMSS-PET`.
3. La fecha y hora obligatorias usan `America/Lima`.
4. Antes de generar cambios se revisa la versión vigente en GitHub.
5. El estado documental debe distinguir: paquete local, GitHub actualizado y Hostinger verificado.

## Mensajes, modales y formularios

1. Toda acción que modifique datos demo confirma claramente el resultado.
2. Sin MySQL, el mensaje debe indicar que el cambio se guarda solo en el navegador.
3. Los mensajes usan `window.BrokerNotify`.
4. Con un `<dialog>` abierto, la notificación se inserta dentro del modal activo, nunca detrás de este.
5. Sin modal activo, la notificación se muestra de forma global.
6. Las acciones que cierran el modal antes de comunicar el resultado muestran el mensaje global después del cierre.
7. No usar `window.alert()` ni `window.confirm()` para funcionalidades nuevas.
8. Los formularios y bloques insertados dinámicamente deben usar la capa común `assets/css/modal-ui.css`.
9. Inputs, selects, textarea, checkbox, ayudas, tablas repetibles y acciones de modal deben conservar el mismo aspecto visual.

## Contactos, clientes y expedientes

1. Un contacto de gestión es una persona natural; no es cliente ni usuario interno.
2. Crear expediente exige contacto de gestión, nombre y descripción.
3. El contacto mínimo requiere nombre completo y celular.
4. Un contacto puede estar sin entidad o relacionarse con una o varias empresas o consorcios.
5. El cliente solo puede ser empresa o consorcio.
6. Cliente o entidad es opcional al crear expediente y se muestra como pendiente cuando falta.
7. Antes de registrar una póliza futura, el expediente deberá tener cliente definido.
8. Un expediente representa un solo proceso asegurador y no mezcla seguros independientes.
9. Un expediente puede existir, mantenerse en espera, cerrarse o cancelarse sin cotización, seguro, póliza, pago o documento.
10. No existe asignación obligatoria de expedientes a ejecutivos.
11. Gerentes y ejecutivos ven y trabajan sobre todos los expedientes en esta maqueta.
12. Los cambios demo se guardan en `localStorage`; no representan persistencia real ni seguridad de servidor.
