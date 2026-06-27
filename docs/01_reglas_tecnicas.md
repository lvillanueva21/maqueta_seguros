# Reglas técnicas

## Marca y textos visibles

1. El nombre oficial visible del sistema es **BROKER SEGUROS**.
2. El nombre del repositorio no define el nombre de la aplicación.
3. Los textos de marca deben obtenerse de las constantes `APP_NAME` y `APP_SHORT_NAME` declaradas en `config/bootstrap.php`.
4. No volver a escribir nombres de marca distintos directamente en pantallas nuevas.

## Versionado y trazabilidad

1. Toda entrega debe actualizar `docs/00_version_actual.md`.
2. El archivo debe registrar código de versión, fecha, hora y zona `America/Lima`.
3. Antes de generar una nueva entrega, se debe revisar el código de versión existente en GitHub para confirmar si el repositorio remoto está sincronizado.
4. El historial de cambios debe incluir la misma fecha y hora de entrega.

## Mensajes y notificaciones

1. Toda acción que modifique datos demo debe confirmar claramente el resultado.
2. El mensaje debe indicar qué se modificó y que, mientras no exista MySQL, queda guardado solo en el navegador.
3. Los mensajes se centralizan en `window.BrokerNotify`, disponible desde `assets/js/app.js`.
4. Tipos permitidos: éxito, error, advertencia e información.
5. Los errores y advertencias deben poder cerrarse manualmente y permanecer más tiempo que los mensajes de éxito.
6. Las validaciones de campos obligatorios deben mostrar un mensaje amigable además de la marca del navegador.
7. No usar `window.alert()` para nuevas funcionalidades; usar `window.BrokerNotify`.
8. Las acciones destructivas o que reviertan información deben pedir confirmación antes de ejecutarse.
9. Los modulos nuevos no deben usar `window.alert()` ni `window.confirm()` directamente; deben usar `window.BrokerNotify`.

## Expedientes y cotizaciones

1. Un expediente es un contenedor de trabajo; no es un tipo de gestión, cotización, seguro, póliza ni pago.
2. Crear un expediente solo exige la entidad o cliente y el responsable; asunto y descripción son opcionales.
3. Un expediente puede existir, quedar en espera, cerrarse o cancelarse sin cotizaciones ni seguros.
4. Las situaciones de expediente son referencias flexibles; no representan una secuencia obligatoria.
5. Tipos de seguro, aseguradoras, primas, monedas, cuotas, coberturas y mensajes no pertenecen al expediente raíz.
6. Una cotización será opcional y pertenecerá a un expediente.
7. Una cotización podrá contener una o varias alternativas y cada alternativa podrá asociar tipos de seguro, aseguradoras y datos propios.
8. Los formularios de cotización deben derivar de plantillas configurables con ítems personalizados; no se deben codificar campos específicos para un solo seguro.
9. Las advertencias, mensajes, notas, deducibles y condiciones deberán poder asociarse a la plantilla, la cotización o una alternativa, según corresponda.
10. Los cambios demo se guardan con `localStorage`; no representan persistencia real ni se comparten entre dispositivos.
11. La migracion de cache local debe estar centralizada en `assets/js/cache-migrations.js` para que no dependa del orden en que el usuario abra pantallas.

## Permisos de maqueta

1. Los permisos actuales controlan interfaz y rutas PHP de la maqueta.
2. La informacion guardada en `localStorage` no reemplaza autorizacion real de servidor.
3. Cuando exista MySQL, todos los permisos y filtros deberan validarse en backend.
4. Gerente puede ver todos los expedientes y asignar responsable.
5. Ejecutivo solo debe ver expedientes con su `responsible_user_id`.
6. Cliente empresa y consorcio no deben abrir directamente `expedientes.php` ni `catalogos.php`.

## Datos demo y evolución

1. Los usuarios demo se mantienen centralizados en `config/demo_users.php`.
2. Las contraseñas demo se validan con `password_verify()`.
3. Los datos de sesión no deben incluir `password_hash`.
4. Cuando se incorpore MySQL, se debe conservar el mismo contrato de contexto de usuario para no rehacer vistas ni controladores.
5. Las reglas importantes, decisiones y cambios deben documentarse en `docs/`.
