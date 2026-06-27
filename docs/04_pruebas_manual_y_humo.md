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

## Casos de Catálogos demo

| ID | Prueba | Resultado esperado |
|---|---|---|
| CAT-01 | Ingresar como gerente y abrir Catálogos | Se muestran los siete grupos de datos maestros. |
| CAT-02 | Seleccionar cada grupo | Cambian título, descripción y filas sin error de pantalla. |
| CAT-03 | Como gerente, agregar una aseguradora demo | La nueva fila aparece y continúa después de recargar la página. |
| CAT-04 | Como gerente, editar una fila demo | Código, nombre, detalle y estado se actualizan al guardar. |
| CAT-05 | Como gerente, desactivar y activar una fila | El estado cambia entre Activo e Inactivo. |
| CAT-06 | Como gerente, pulsar Restaurar demo | Se eliminan solo los cambios locales y vuelven los valores iniciales. |
| CAT-07 | Ingresar como ejecutivo y abrir Catálogos | Puede consultar grupos y filas, pero no ve botones de agregar, editar, activar, desactivar ni restaurar. |
| CAT-08 | Ingresar como empresa o consorcio y abrir `catalogos.php` | Se muestra Acceso no autorizado. |
| CAT-09 | Usar Catálogos en móvil | Los grupos se acomodan; la tabla mantiene desplazamiento horizontal sin cortar datos. |
| CAT-10 | Volver a Inicio después de editar un catálogo | En Acciones en caché debe aparecer el registro temporal de la acción. |

## Casos de permisos y rutas

| ID | Prueba | Resultado esperado |
|---|---|---|
| PERM-01 | Ingresar como gerente | Ve Inicio, Reportes, Usuarios, Clientes, Seguros, Cobranzas, Siniestros y Catálogos. |
| PERM-02 | Ingresar como ejecutivo | Ve Inicio, Clientes, Seguros, Cobranzas, Siniestros y Catálogos; no ve Reportes ni Usuarios. |
| PERM-03 | Ingresar como empresa o consorcio | Ve Inicio, Mis Seguros, Mis Pagos, Mis Siniestros y Mi Perfil. |
| PERM-04 | Como ejecutivo, abrir directamente `modulo.php?modulo=reportes` | Redirige a acceso no autorizado. |
| PERM-05 | Abrir `modulo.php?modulo=seguros` sin sesión | Redirige al login. |

## Evidencia mínima

Por cada bloque implementado, registrar:

- fecha;
- perfil probado;
- URL;
- resultado;
- error encontrado, si aplica;
- captura cuando corresponda.
