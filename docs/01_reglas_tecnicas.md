# Reglas técnicas

## Marca y textos visibles

1. El nombre oficial visible del sistema es **BROKER SEGUROS**.
2. El nombre del repositorio no define el nombre de la aplicación.
3. Los textos de marca deben obtenerse de las constantes `APP_NAME` y `APP_SHORT_NAME` declaradas en `config/bootstrap.php`.
4. No volver a escribir nombres de marca distintos directamente en pantallas nuevas.

## Versionado y trazabilidad

1. Toda entrega debe actualizar `docs/00_version_actual.md`.
2. El archivo debe registrar código de versión, fecha, hora y zona `America/Lima`.
3. Antes de generar una nueva entrega, se debe revisar el código de versión existente en GitHub para confirmar si el repositorio remoto está sincronizado.
4. El historial de cambios debe incluir la misma fecha y hora de entrega.

## Rutas y publicación

1. No usar dominios, subdominios ni `BASE_URL` codificados.
2. Las rutas internas deben generarse con `appRelativeUrl()` cuando se navega entre archivos PHP.
3. Los recursos estáticos deben mantenerse relativos a la ubicación del archivo.
4. La aplicación debe funcionar en una subcarpeta como `public_html/maqueta/` sin cambios de código.

## PHP, sesiones y permisos

1. Todo archivo PHP debe iniciar con `declare(strict_types=1);`.
2. La zona horaria oficial es `America/Lima`.
3. Las páginas privadas deben incluir `config/bootstrap.php` y ejecutar `requireAuth()` antes de generar HTML.
4. Toda sesión iniciada debe regenerar su identificador con `session_regenerate_id(true)`.
5. Las vistas privadas y el cierre de sesión deben enviar cabeceras que eviten mostrar contenido privado desde la caché del navegador.
6. La cookie de sesión debe limitarse a la carpeta de instalación del proyecto.
7. Los módulos y sus permisos deben declararse únicamente en `config/modules.php`.
8. Un módulo debe validar permiso en servidor mediante `requireModuleAccess()`. Ocultar un enlace no es una validación de seguridad.

## Catálogos demo

1. Los datos maestros demo se definen únicamente en `config/demo_catalogs.php`.
2. Solo el rol `gerente` puede usar las acciones demo de agregar, editar, activar o desactivar.
3. Los cambios de catálogos demo se guardan en `localStorage`; no modifican archivos PHP, servidor ni base de datos.
4. El rol `ejecutivo` tiene acceso de consulta a Catálogos.
5. Los perfiles cliente no deben poder abrir `catalogos.php`.
6. Antes de migrar a MySQL, se debe validar el nombre, código, estado y detalle requeridos para cada catálogo.

## Navegación y usabilidad

1. En escritorio, el menú lateral debe mantenerse visible dentro del alto de la ventana, incluso cuando el contenido principal sea extenso.
2. El cierre de sesión debe estar disponible desde la barra superior y desde el menú lateral.
3. En móvil, el menú lateral se abre como panel fijo y el cierre de sesión de la barra superior debe conservar un nombre accesible mediante `aria-label`.
4. Las tablas anchas deben poder desplazarse horizontalmente en móvil sin romper la interfaz.

## Datos demo y evolución

1. Los usuarios demo se mantienen centralizados en `config/demo_users.php`.
2. Las contraseñas demo se validan con `password_verify()`.
3. Los datos de sesión no deben incluir `password_hash`.
4. Cuando se incorpore MySQL, se debe conservar el mismo contrato de contexto de usuario para no rehacer vistas ni controladores.
5. Las reglas importantes, decisiones y cambios deben documentarse en `docs/`.
