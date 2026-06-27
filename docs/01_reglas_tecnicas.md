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

## Mensajes y notificaciones

1. Toda acción que modifique datos demo confirma claramente el resultado.
2. El mensaje indica que, sin MySQL, el cambio se guarda solo en este navegador.
3. Los mensajes usan `window.BrokerNotify`.
4. No usar `window.alert()` ni `window.confirm()` en funcionalidades nuevas.
5. Las acciones reversibles o destructivas piden confirmación previa.

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
10. Tipo de seguro, aseguradora, monto, vigencia, requisitos y formatos no pertenecen todavía al expediente raíz.
11. Cotizaciones y pólizas serán entidades opcionales posteriores.
12. No existe asignación obligatoria de expedientes a ejecutivos.
13. Gerentes y ejecutivos ven y trabajan sobre todos los expedientes en esta maqueta.
14. La migración de caché debe estar centralizada en `assets/js/cache-migrations.js`.
15. Los cambios demo se guardan en `localStorage`; no representan persistencia real ni seguridad de servidor.

## Permisos de maqueta

1. Los permisos actuales controlan interfaz y rutas PHP.
2. La información de `localStorage` no reemplaza autorización real de backend.
3. Cliente empresa y consorcio no deben abrir `expedientes.php` ni `catalogos.php`.
4. Los permisos detallados por acción para ejecutivos se implementarán en etapas posteriores.
5. Cuando exista MySQL, permisos y filtros deben validarse en backend.

## Datos demo y evolución

1. Los usuarios demo están en `config/demo_users.php`.
2. Los contactos y expedientes demo están en `config/demo_expedients.php`.
3. Las contraseñas demo se validan con `password_verify()`.
4. Los datos de sesión no incluyen `password_hash`.
5. Las reglas, decisiones y cambios importantes deben documentarse en `docs/`.
