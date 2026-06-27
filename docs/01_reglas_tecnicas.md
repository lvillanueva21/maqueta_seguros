# Reglas técnicas

## Rutas y publicación

1. No usar dominios, subdominios ni `BASE_URL` codificados.
2. Las rutas internas deben generarse con `appRelativeUrl()` cuando se navega entre archivos PHP.
3. Los recursos estáticos deben mantenerse relativos a la ubicación del archivo.
4. La aplicación debe funcionar en una subcarpeta como `public_html/maqueta/` sin cambios de código.

## PHP y sesiones

1. Todo archivo PHP debe iniciar con `declare(strict_types=1);`.
2. La zona horaria oficial es `America/Lima`.
3. Las páginas privadas deben incluir `config/bootstrap.php` y ejecutar `requireAuth()` antes de generar HTML.
4. Toda sesión iniciada debe regenerar su identificador con `session_regenerate_id(true)`.
5. Las vistas privadas y el cierre de sesión deben enviar cabeceras que eviten mostrar contenido privado desde la caché del navegador.
6. La cookie de sesión debe limitarse a la carpeta de instalación del proyecto.

## Datos demo y evolución

1. Los usuarios demo se mantienen centralizados en `config/demo_users.php`.
2. Las contraseñas demo se validan con `password_verify()`.
3. Los datos de sesión no deben incluir `password_hash`.
4. Cuando se incorpore MySQL, se debe conservar el mismo contrato de contexto de usuario para no rehacer vistas ni controladores.
5. Las reglas importantes, decisiones y cambios deben documentarse en `docs/`.
