# Versión actual entregada

- **Código de versión:** `BS-20260627-183503-PET`
- **Fecha y hora de entrega:** 27/06/2026 18:35:03 (America/Lima)
- **Zona horaria:** Perú - America/Lima
- **Bloque funcional:** Pólizas v1 dentro de Expedientes, PDF opcional protegido y almacenamiento organizado.
- **Estado de esta versión:** Paquete preparado localmente. Debe integrarse, probarse y subirse manualmente a GitHub `main`. Hostinger se verifica por separado.

## Base remota revisada antes de generar esta versión

- Repositorio: `lvillanueva21/maqueta_seguros`
- Rama: `main`
- Versión remota encontrada: `BS-20260627-173744-PET`
- SHA de `docs/00_version_actual.md`: `3666973595df90d75c719e0a58d17c1a2d500904`

## Incluye

1. Pólizas dentro de la ficha de cada expediente.
2. Cliente del expediente como referencia histórica bloqueada al registrar póliza.
3. Campos obligatorios: título, tipo de seguro, aseguradora, inicio y fin de vigencia.
4. Código interno automático `POL-YYYY-NNNN`.
5. PDF principal opcional, barra de progreso, nombre visible y mensajes amigables ante fallos de carga.
6. Estructura `almacen/polizas/{tipo}/{año}/{mes}/{día}`.
7. Reemplazo seguro: se sube el nuevo PDF y luego se elimina físicamente el anterior.
8. Vista de PDF protegida solo para gerente y ejecutivo.
9. Desactivación con motivo; queda visible internamente y preparada para excluirse de la futura vista cliente.
10. Migración de caché para conservar `policies` dentro de cada expediente.
