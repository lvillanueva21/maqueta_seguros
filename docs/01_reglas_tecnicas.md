# Reglas técnicas

## Versionado

1. Toda entrega registra código, fecha, hora y `America/Lima` en `docs/00_version_actual.md`.
2. Antes de generar cambios se revisa la versión de GitHub `main`.
3. Debe diferenciarse paquete local, GitHub actualizado y Hostinger verificado.

## Clientes y entidades

1. Una empresa requiere razón social o RUC.
2. Cuando se indique RUC, debe tener 11 dígitos, dígito verificador válido y ser único entre empresas y consorcios con RUC propio.
3. La razón social puede repetirse.
4. Una entidad desactivada no se ofrece para nuevas relaciones, pero se conserva en antecedentes.
5. Un consorcio exige nombre, modalidad y dos o más empresas participantes activas.
6. Un consorcio con RUC propio no necesita operador tributario.
7. Un consorcio sin RUC propio exige exactamente un operador tributario; su RUC es el RUC principal calculado.
8. Un contacto requiere nombre completo y celular; puede tener múltiples vínculos y un principal por entidad.
9. No se elimina información de negocio: se desactiva con motivo.
10. Toda fecha demo usa `America/Lima`.

## Expedientes

1. Contacto, nombre y descripción son obligatorios.
2. Cliente sigue siendo opcional al inicio.
3. Si un contacto tiene un único vínculo activo, se sugiere la entidad al crear expediente; se puede cambiar o dejar pendiente.
4. Antes de una futura póliza se exigirá cliente definido.

## Persistencia

La maqueta usa `localStorage`; MySQL será obligatorio para persistencia, concurrencia y autorización real.
