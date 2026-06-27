# Pruebas manuales y de humo

## Ambiente publicado

Ruta esperada cuando se instala en Hostinger:

```text
https://cicsount.pe/maqueta/
```

## Casos de sesión

| ID | Prueba | Resultado esperado |
|---|---|---|
| SES-01 | Ingresar como gerente | Dashboard de gerente, menú con Reportes y Usuarios. |
| SES-02 | Ingresar como ejecutivo | Dashboard de ejecutiva, menú operativo sin Reportes ni Usuarios. |
| SES-03 | Ingresar como empresa | Dashboard de cliente, tipo de cuenta Empresa. |
| SES-04 | Ingresar como consorcio | Tipo de cuenta Consorcio y lista de dos empresas participantes. |
| SES-05 | Abrir `dashboard.php` sin login | Redirección al login. |
| SES-06 | Cerrar sesión desde la barra superior | Redirección al login y eliminación de sesión. |
| SES-07 | Cerrar sesión desde el menú lateral | Redirección al login y eliminación de sesión. |
| SES-08 | Cerrar sesión y usar Atrás | No debe mostrarse el dashboard como contenido vigente; al recargar debe volver al login. |
| SES-09 | Usar una contraseña incorrecta | Mensaje controlado sin error PHP. |
| SES-10 | Probar desde la subcarpeta publicada | Login, dashboard, recursos CSS y JavaScript deben cargar correctamente. |

## Casos de navegación y marca

| ID | Prueba | Resultado esperado |
|---|---|---|
| NAV-01 | Abrir un dashboard con mucho contenido y desplazarse hacia abajo | El menú lateral se mantiene visible; el enlace Cerrar sesión queda disponible en la parte inferior de la barra lateral. |
| NAV-02 | Pulsar el ícono de cierre en la esquina superior derecha | Se cierra la sesión sin requerir bajar por la página. |
| NAV-03 | Reducir la pantalla a móvil | El botón superior muestra el ícono de salida y el menú lateral se abre como panel. |
| MAR-01 | Revisar login, menú y barra superior | Debe mostrarse BROKER SEGUROS; no debe aparecer LIVP Seguros en textos visibles. |

## Casos de dashboard demo

| ID | Prueba | Resultado esperado |
|---|---|---|
| DASH-01 | Ingresar como gerente | Cuatro indicadores globales, alertas gerenciales, cartera por aseguradora y seguimiento ejecutivo. |
| DASH-02 | Ingresar como ejecutivo | Indicadores de clientes, renovaciones, tareas y cobranza; cartera priorizada y agenda operativa. |
| DASH-03 | Ingresar como empresa | Pólizas vigentes, pagos, solicitud activa y tabla de acciones disponibles. |
| DASH-04 | Ingresar como consorcio | Resumen consolidado, tabla de pólizas por empresa, tarjetas de dos participantes y gestiones separadas. |
| DASH-05 | Comparar empresa y consorcio | No deben mostrar las mismas cifras, tablas ni alertas. |
| DASH-06 | Recargar el dashboard | Los datos demo del perfil deben mantenerse sin errores PHP ni CSS faltante. |
| DASH-07 | Reducir la ventana o usar celular | Tarjetas y tablas deben adaptarse; las tablas pueden desplazarse horizontalmente sin romper el diseño. |
| DASH-08 | Pulsar cualquier opción de menú | El Inicio se oculta, aparece la vista En construcción y se registra la acción temporal. |
| DASH-09 | Volver a Inicio | Deben reaparecer los indicadores y tablas del perfil autenticado. |

## Evidencia mínima

Por cada bloque implementado, registrar:

- fecha;
- perfil probado;
- URL;
- resultado;
- error encontrado, si aplica;
- captura cuando corresponda.
