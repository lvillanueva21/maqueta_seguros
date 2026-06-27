# Pruebas manuales y de humo

## Version

| ID | Prueba | Resultado esperado |
|---|---|---|
| VER-01 | Abrir `docs/00_version_actual.md` en local, GitHub y Hostinger luego del push/publicacion manual | Debe aparecer `BS-20260627-133302-PET`. |
| VER-02 | Comparar fecha y hora | Debe indicar 27/06/2026 13:33:02 (America/Lima). |

## Expedientes estabilizados

| ID | Prueba | Resultado esperado |
|---|---|---|
| EXP-AUD-01 | Abrir Expedientes con cache antigua sin abrir Catalogos primero | Se migran situaciones antiguas y no aparecen Borrador, En gestion ni Pendiente de documentos como situaciones de expediente. |
| EXP-AUD-02 | Crear expediente solo con cliente y responsable | Se crea y persiste sin cotizacion, seguro, aseguradora ni moneda. |
| EXP-AUD-03 | Cerrar un expediente sin cotizacion ni seguro | La situacion cambia a Cerrado y queda guardada en el navegador. |
| EXP-AUD-04 | Como gerente, crear expediente y asignarlo a Maria Torres | El expediente queda visible en vista global y asignado a `responsible_user_id = 2`. |
| EXP-AUD-05 | Como ejecutivo Maria Torres, abrir Expedientes | Solo ve expedientes asignados a su usuario. |
| EXP-AUD-06 | Usar filtros de situacion y responsable | El listado se actualiza sin alterar datos. |
| EXP-AUD-07 | Recargar con F5 despues de crear expediente | El expediente sigue visible en el mismo navegador. |
| EXP-AUD-08 | Revisar fechas `YYYY-MM-DD` | No cambian de dia al mostrarse. |
| EXP-AUD-09 | Revisar ficha y formulario | No muestran campos de cotizacion dentro del expediente raiz. |
| EXP-AUD-10 | Crear o cambiar situacion | Aparece un solo toast claro por accion. |

## Catalogos estabilizados

| ID | Prueba | Resultado esperado |
|---|---|---|
| CAT-AUD-01 | Guardar un elemento | Toast de exito indica guardado temporal solo en navegador. |
| CAT-AUD-02 | Intentar codigo duplicado | Muestra error amigable y no guarda duplicado. |
| CAT-AUD-03 | Restaurar demo | Pide confirmacion previa con BrokerNotify y luego muestra mensaje final. |
| CAT-AUD-04 | Simular error de localStorage | Muestra error persistente y comprensible. |

## Permisos y cache privado

| ID | Prueba | Resultado esperado |
|---|---|---|
| PERM-AUD-01 | Cliente abre `expedientes.php` | Redirige a acceso no autorizado. |
| PERM-AUD-02 | Cliente abre `catalogos.php` | Redirige a acceso no autorizado. |
| PERM-AUD-03 | Ejecutivo abre Reportes o Usuarios por URL | Redirige a acceso no autorizado. |
| PERM-AUD-04 | Cerrar sesion y usar Atras/recargar | No debe mostrarse contenido privado desde cache. |

## Limitacion deliberada

Una ventana incognito no comparte `localStorage` con el navegador normal; por eso no deberia ver expedientes creados en la sesion normal. Esta prueba requiere navegador real.
