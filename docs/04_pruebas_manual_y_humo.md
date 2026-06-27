# Pruebas manuales y de humo

## Versión

- `BS-20260627-173744-PET`
- 27/06/2026 17:37:44 (America/Lima)

## Clientes v1

| ID | Prueba | Resultado esperado |
|---|---|---|
| CLI-01 | Crear empresa solo con razón social | Guarda empresa activa. |
| CLI-02 | Crear empresa con RUC válido | Guarda solo si tiene 11 dígitos y dígito verificador válido. |
| CLI-03 | Repetir RUC en empresa o consorcio | Bloquea y muestra error. |
| CLI-04 | Crear consorcio con RUC propio | Exige denominación, RUC válido y dos empresas. |
| CLI-05 | Crear consorcio con operador tributario | Exige dos empresas y exactamente un operador. |
| CLI-06 | Intentar retirar integrante dejando uno | Bloquea la acción. |
| CLI-07 | Crear contacto sin nombre o celular | Bloquea la acción. |
| CLI-08 | Crear contacto con dos vínculos | Permite etiquetas distintas y principal por entidad. |
| CLI-09 | Desactivar empresa, consorcio o contacto | Abre modal rojo y exige motivo. |
| CLI-10 | Buscar y filtrar por activos/inactivos | Actualiza tabla sin alterar datos. |

## Expedientes integrados

| ID | Prueba | Resultado esperado |
|---|---|---|
| EXP-ENT-01 | Crear expediente con contacto vinculado a una sola entidad | Sugiere cliente; usuario puede cambiar o limpiar. |
| EXP-ENT-02 | Crear expediente con contacto de varios vínculos | No selecciona cliente automáticamente. |
| EXP-ENT-03 | Crear expediente con entidad pendiente | Permite guardar con contacto, nombre y descripción. |
| EXP-ENT-04 | Desactivar entidad usada en expediente | Conserva nombre histórico en expediente; no la ofrece para nuevas selecciones. |
| EXP-ENT-05 | Recargar la página después de cambios | Datos permanecen en el mismo navegador. |

## Límites

Incógnito y otro navegador no comparten `localStorage`. No hay MySQL, SUNAT, usuarios cliente ni pólizas en esta versión.
