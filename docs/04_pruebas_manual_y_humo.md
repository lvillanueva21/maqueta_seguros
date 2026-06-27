# Pruebas manuales y de humo

## Versión

| ID | Prueba | Resultado esperado |
|---|---|---|
| VER-POL-01 | Abrir `docs/00_version_actual.md` tras integrar | Debe mostrar `BS-20260627-183503-PET` y 27/06/2026 18:35:03 (America/Lima). |

## Pólizas

| ID | Prueba | Resultado esperado |
|---|---|---|
| POL-01 | Abrir expediente sin cliente e intentar Registrar póliza | Botón deshabilitado y aviso de Cliente pendiente. |
| POL-02 | Definir cliente en expediente y guardar | Al reabrir ficha, Registrar póliza queda habilitado. |
| POL-03 | Intentar guardar sin título | Mensaje amigable y no guarda. |
| POL-04 | Intentar guardar sin tipo de seguro o aseguradora | Mensaje amigable y no guarda. |
| POL-05 | Intentar guardar sin inicio o fin | Mensaje amigable y no guarda. |
| POL-06 | Colocar fin igual o anterior al inicio | Bloquea el guardado con Vigencia no válida. |
| POL-07 | Crear póliza válida sin PDF | Guarda, crea código `POL-YYYY-NNNN` y muestra Falta PDF de póliza. |
| POL-08 | Crear póliza con PDF pequeño válido | Muestra nombre, barra de progreso, éxito y enlace protegido Abrir PDF. |
| POL-09 | Seleccionar archivo no PDF | Rechaza con mensaje claro. |
| POL-10 | Subir un archivo que el servidor rechace por tamaño/tiempo | Debe mostrar mensaje amigable y no crear/actualizar el PDF. |
| POL-11 | Editar póliza y reemplazar PDF | Sube nuevo; enlace abre el nuevo; el anterior se elimina físicamente. |
| POL-12 | Desactivar póliza con motivo | Permanece visible para gerente/ejecutivo con estado Desactivada y motivo. |
| POL-13 | Intentar desactivar sin motivo | Bloquea y explica que el motivo es obligatorio. |
| POL-14 | Abrir enlace PDF sin sesión o como cliente | Debe negar acceso. |
| POL-15 | Recargar F5 | Metadatos de póliza se conservan en el mismo navegador. |

## Verificaciones de almacenamiento

| ID | Prueba | Resultado esperado |
|---|---|---|
| FILE-01 | Revisar `almacen/polizas` por SFTP/administrador de archivos | Archivo organizado por tipo/año/mes/día. |
| FILE-02 | Intentar abrir una ruta directa de `almacen` | Debe negar acceso o no listar directorios. |
| FILE-03 | Revisar nombre físico | Debe ser código interno + texto aleatorio; no el nombre original. |

## Limitaciones conocidas

- El PDF físico vive en servidor, pero su relación con la póliza vive en `localStorage`.
- Si se borra almacenamiento del navegador, el PDF puede quedar físicamente sin referencia. No borres datos del sitio durante pruebas con archivos reales.
- Antes de producción se requiere MySQL para trazabilidad de archivos.
