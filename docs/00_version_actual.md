# Version actual entregada

- **Codigo de version:** `BS-20260627-133302-PET`
- **Fecha y hora de entrega:** 27/06/2026 13:33:02 (America/Lima)
- **Zona horaria:** Peru - America/Lima
- **Bloque funcional:** Auditoria y estabilizacion de Catalogos, Expedientes, notificaciones, migraciones locales, permisos y fechas Lima.
- **Estado de esta version:** Preparada solo en carpeta local. No confirma push, commit ni publicacion en GitHub/Hostinger.

## Base del repositorio revisada antes de generar esta version

- `docs/00_version_actual.md` - SHA base `0dd0cb36882523fe96f4150ae2750b67223bf2be`
- `assets/js/expedientes.js` - SHA base `478c6fb872797c54927ed604f08b93d246f03155`
- `assets/js/catalogos.js` - SHA base `7fc6122c07aa9db6603448a192af3f74c76ce2ea`
- `config/modules.php` - SHA base `1606cb503a9b7c9b9c4a74307616e132d7632340`

## Problemas corregidos

- Migracion centralizada de situaciones antiguas de Catalogos.
- Migracion local de `broker_seguros_demo_expedients_v1` hacia `broker_seguros_demo_expedients_v2`.
- Expedientes puede abrir primero y aun asi migrar catalogos locales obsoletos.
- Fechas y codigo `EXP-AAAA-NNNN` usan referencia de Lima desde JavaScript compartido.
- Se evita mostrar fechas `YYYY-MM-DD` con desplazamiento por UTC.
- Se redujeron toasts duplicados para una misma accion.
- Restaurar Catalogos usa confirmacion de `window.BrokerNotify`, no `window.confirm()`.
- La descripcion del modulo Expedientes ya no lo define como cotizacion, emision, renovacion, endoso ni regularizacion.

## Limitaciones conocidas

- `localStorage` no es seguridad real entre usuarios que comparten el mismo navegador.
- La concurrencia entre dos pestanas se mitiga recargando datos antes de generar codigo, pero solo MySQL puede garantizar unicidad real.
- Los permisos actuales controlan interfaz y rutas PHP de la maqueta. Cuando exista MySQL, permisos y filtros deben validarse en backend.

## Como verificar GitHub y Hostinger luego del push manual

1. Hacer `git push` manualmente cuando la revision local sea aprobada.
2. Abrir este archivo en GitHub y confirmar que el codigo sea `BS-20260627-133302-PET`.
3. Publicar en Hostinger y abrir la maqueta desplegada.
4. Verificar que `docs/00_version_actual.md` en Hostinger muestre el mismo codigo.
5. Si GitHub o Hostinger muestran otro codigo, esa ubicacion todavia no tiene esta version.
