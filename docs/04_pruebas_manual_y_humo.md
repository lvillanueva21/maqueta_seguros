# Pruebas manuales y de humo

## Ambiente publicado

Ruta esperada cuando se instala en Hostinger:

```text
https://cicsount.pe/maqueta/
```

## Control de versión

| ID | Prueba | Resultado esperado |
|---|---|---|
| VER-01 | Abrir `docs/00_version_actual.md` en GitHub luego del push | Debe aparecer el código de versión de la última entrega aplicada. |
| VER-02 | Comparar el código de versión con el ZIP recibido | Ambos deben coincidir exactamente. |

## Corrección de Expedientes

| ID | Prueba | Resultado esperado |
|---|---|---|
| EXP-COR-01 | Abrir Crear expediente | No debe aparecer Tipo de gestión, Tipo de seguro, Aseguradora ni Moneda. |
| EXP-COR-02 | Crear solo con cliente o entidad y responsable | Debe crearse correctamente, aun sin asunto ni descripción. |
| EXP-COR-03 | Crear expediente sin cotización | El listado debe mostrar 0 cotizaciones y la ficha debe indicar que es válido continuar o cerrar así. |
| EXP-COR-04 | Revisar tabla de expedientes | Debe mostrar Asunto inicial, Situación y Cotizaciones; no Gestión ni Seguro/Aseguradora. |
| EXP-COR-05 | Cambiar situación de Abierto a En espera o Cerrado | Debe permitirlo sin exigir pasos previos, cotización ni seguro. |
| EXP-COR-06 | Crear como gerente y asignar a otro ejecutivo | Debe quedar visible para ese responsable según las reglas actuales. |
| EXP-COR-07 | Ingresar como ejecutivo | Debe seguir viendo solo sus expedientes asignados. |
| EXP-COR-08 | Usar datos anteriores guardados de Expedientes v1 o situaciones antiguas en Catálogos | Deben adaptarse al nuevo modelo sin desaparecer; se reemplazan Borrador, En gestión y Pendiente de documentos por las nuevas situaciones flexibles. |
| EXP-COR-09 | Recargar luego de crear o cambiar situación | El expediente debe conservarse en este navegador mediante `localStorage`. |
| EXP-COR-10 | Limpiar datos del sitio | Se recuperan los datos demo base al volver a entrar. |

## Notificaciones

| ID | Prueba | Resultado esperado |
|---|---|---|
| NOT-01 | Crear expediente | Toast de éxito con código y aviso de guardado temporal. |
| NOT-02 | Cambiar situación | Toast de éxito con código y nueva situación. |
| NOT-03 | Guardar catálogo | Toast de éxito sin duplicarse. |
| NOT-04 | Duplicar código de catálogo | Toast de error amigable, no alerta clásica. |
| NOT-05 | Intentar guardar con campos obligatorios faltantes | Advertencia visible y validación nativa. |

## Evidencia mínima

Por cada bloque implementado, registrar:

- fecha;
- perfil probado;
- URL;
- resultado;
- error encontrado, si aplica;
- captura cuando corresponda.
