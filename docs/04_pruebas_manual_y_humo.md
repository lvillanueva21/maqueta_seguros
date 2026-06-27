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

## Casos de permisos y rutas

| ID | Prueba | Resultado esperado |
|---|---|---|
| PERM-01 | Ingresar como gerente | Ve Inicio, Reportes, Usuarios, Clientes, Seguros, Cobranzas, Siniestros y Catálogos. |
| PERM-02 | Ingresar como ejecutivo | Ve Inicio, Clientes, Seguros, Cobranzas, Siniestros y Catálogos; no ve Reportes ni Usuarios. |
| PERM-03 | Ingresar como empresa o consorcio | Ve Inicio, Mis Seguros, Mis Pagos, Mis Siniestros y Mi Perfil. |
| PERM-04 | Como gerente, abrir Reportes desde el menú | Abre `modulo.php?modulo=reportes` y muestra “Acceso habilitado”. |
| PERM-05 | Como ejecutivo, abrir directamente `modulo.php?modulo=reportes` | Redirige a `acceso_denegado.php`; no muestra contenido del módulo. |
| PERM-06 | Como cliente, abrir directamente `modulo.php?modulo=clientes` | Redirige a `acceso_denegado.php`; debe listar solo sus módulos permitidos. |
| PERM-07 | Abrir `modulo.php?modulo=inexistente` con sesión activa | Muestra página controlada de ruta no disponible. |
| PERM-08 | Abrir `modulo.php?modulo=seguros` sin sesión | Redirige al login. |
| PERM-09 | Pulsar un módulo permitido y volver al Inicio | La navegación funciona con URL real y el menú marca el módulo activo. |
| PERM-10 | Revisar Acciones en caché al volver al Inicio | Debe aparecer la navegación registrada de forma temporal. |

## Casos de sesión y navegación

| ID | Prueba | Resultado esperado |
|---|---|---|
| SES-01 | Cerrar sesión desde la barra superior | Redirección al login y eliminación de sesión. |
| SES-02 | Cerrar sesión desde el menú lateral | Redirección al login y eliminación de sesión. |
| NAV-01 | Abrir un dashboard con mucho contenido y desplazarse hacia abajo | El menú lateral se mantiene visible; el enlace Cerrar sesión queda disponible. |
| NAV-02 | Reducir la pantalla a móvil | El menú lateral se abre como panel; el botón superior conserva el ícono de salida. |

## Evidencia mínima

Por cada bloque implementado, registrar:

- fecha;
- perfil probado;
- URL;
- resultado;
- error encontrado, si aplica;
- captura cuando corresponda.
