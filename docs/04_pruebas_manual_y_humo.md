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

## Evidencia mínima

Por cada bloque implementado, registrar:

- fecha;
- perfil probado;
- URL;
- resultado;
- error encontrado, si aplica;
- captura cuando corresponda.
