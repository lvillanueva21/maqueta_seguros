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
| SES-06 | Cerrar sesión y abrir `dashboard.php` | Redirección al login. |
| SES-07 | Cerrar sesión y usar Atrás | No debe mostrarse el dashboard como contenido vigente; al recargar debe volver al login. |
| SES-08 | Usar una contraseña incorrecta | Mensaje controlado sin error PHP. |
| SES-09 | Probar desde la subcarpeta publicada | Login, dashboard, recursos CSS y JavaScript deben cargar correctamente. |

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
