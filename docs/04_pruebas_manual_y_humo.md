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

## Casos de notificaciones y mensajes

| ID | Prueba | Resultado esperado |
|---|---|---|
| NOT-01 | Crear un expediente demo válido | Toast de éxito indicando el código generado y que se guardó temporalmente en este navegador. |
| NOT-02 | Cambiar el estado de un expediente | Toast de éxito indicando el código, nuevo estado y naturaleza temporal del cambio. |
| NOT-03 | Guardar un catálogo nuevo o editado | Toast de éxito indicando el elemento modificado y el almacenamiento temporal. |
| NOT-04 | Activar o desactivar un catálogo | Toast de éxito indicando la acción realizada. |
| NOT-05 | Restaurar los catálogos demo y confirmar | Toast de éxito indicando que se eliminaron solo cambios locales. |
| NOT-06 | Intentar guardar formulario con campos obligatorios vacíos | Advertencia amigable y validación nativa en los campos faltantes. |
| NOT-07 | Duplicar un código de catálogo | Mensaje de error amigable, sin alerta emergente clásica del navegador. |
| NOT-08 | Cerrar manualmente un toast | El mensaje desaparece. |
| NOT-09 | Esperar un toast de éxito | Desaparece automáticamente. |
| NOT-10 | Probar desde móvil | Los mensajes no deben tapar toda la pantalla y deben poder cerrarse. |

## Casos de Expedientes demo

| ID | Prueba | Resultado esperado |
|---|---|---|
| EXP-01 | Ingresar como gerente y abrir Expedientes | Ve todos los expedientes demo y el filtro de responsable. |
| EXP-02 | Ingresar como ejecutivo y abrir Expedientes | Ve únicamente expedientes asignados a María Torres. |
| EXP-03 | Como gerente, crear expediente y elegir responsable | Se genera un código `EXP-AAAA-NNNN`, aparece en el listado y respeta el responsable elegido. |
| EXP-04 | Como ejecutivo, crear expediente | El responsable se asigna automáticamente al ejecutivo autenticado. |
| EXP-05 | Filtrar por estado, tipo de seguro, aseguradora y texto | El listado debe mostrar solo expedientes coincidentes. |
| EXP-06 | Abrir ficha y cambiar estado | El estado y fecha de actualización cambian y persisten al recargar. |
| EXP-07 | Como empresa o consorcio, abrir `expedientes.php` | Debe mostrarse Acceso no autorizado. |

## Evidencia mínima

Por cada bloque implementado, registrar:

- fecha;
- perfil probado;
- URL;
- resultado;
- error encontrado, si aplica;
- captura cuando corresponda.
