# Versión actual entregada

- **Código de versión:** `BS-20260627-164101-PET`
- **Fecha y hora de entrega:** 27/06/2026 16:41:01 (America/Lima)
- **Zona horaria:** Perú - America/Lima
- **Bloque funcional:** Corrección del núcleo de Expedientes: Contactos de gestión, cliente opcional y eliminación de asignación interna de ejecutivo.
- **Estado de esta versión:** Paquete preparado localmente. Debe integrarse, probarse y subirse manualmente a GitHub `main`. Hostinger se verifica por separado.

## Base remota revisada antes de generar esta versión

- Repositorio: `lvillanueva21/maqueta_seguros`
- Rama: `main`
- Commit base: `9b8533ac209cfd15cf96a68a11d3a32e1a782476`
- Versión remota encontrada: `BS-20260627-135448-PET`
- `expedientes.php` base: `c470777be0fc25542d09b4e5c8f45db063bef840`
- `assets/js/expedientes.js` base: `5457ad097798b5f563b1a6aa50722d924cb3cb4f`
- `assets/js/cache-migrations.js` base: `61061c35f21efdb2896823952b61cd8a028e5f28`
- `config/demo_expedients.php` base: `0518450949853f85120dc442b9c65ca22f490041`

## Correcciones incluidas

1. Se elimina el concepto incorrecto de `Ejecutivo responsable`.
2. Se incorpora `Contacto de gestión` como persona natural separada de cliente y usuario interno.
3. Crear expediente exige contacto de gestión, nombre y descripción.
4. Cliente o entidad queda opcional al inicio y se muestra como pendiente cuando aún no existe.
5. Gerente y ejecutivo consultan y trabajan sobre todos los expedientes de la maqueta.
6. Se agrega registro rápido de contacto con nombre y celular obligatorios.
7. El contacto puede vincularse opcionalmente a una empresa o consorcio demo.
8. Se habilita actualizar contacto, cliente, situación, nombre y detalle desde la ficha.
9. La caché de expedientes migra de v1/v2 a `broker_seguros_demo_expedients_v3`.
10. Los antiguos campos de ejecutivo se preservan solo como referencia técnica de migración y no se convierten en contactos.

## Limitaciones conocidas

- Los contactos y expedientes se guardan solo en el navegador actual mediante `localStorage`.
- La relación de un contacto con varias entidades está preparada en datos, pero la interfaz rápida permite registrar solo un vínculo inicial.
- Aún no existe el módulo completo de Empresas, Consorcios, Contactos ni Pólizas.
- Antes de registrar una póliza futura, el sistema deberá exigir cliente definido.
- La autorización real y las reglas por usuario deberán validarse en backend cuando exista MySQL.

## Comprobación posterior al push

1. Subir los archivos del paquete al repositorio local.
2. Confirmar que `docs/00_version_actual.md` muestre `BS-20260627-164101-PET`.
3. Hacer commit y push a GitHub `main`.
4. Confirmar en GitHub que el archivo muestre el mismo código.
5. Verificar en Hostinger que el archivo desplegado también muestre `BS-20260627-164101-PET`.
