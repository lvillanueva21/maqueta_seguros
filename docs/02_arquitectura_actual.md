# Arquitectura actual

```text
index.php
├── valida credenciales demo
├── createUserSession()
└── redirige a dashboard.php

config/bootstrap.php
├── constantes de marca: BROKER SEGUROS
├── rutas relativas
├── configuración de cookie y sesión
├── autenticación y protección de vistas
├── creación y destrucción de sesión
└── menú según rol

config/demo_users.php
└── catálogo temporal de cuatro usuarios demo

config/demo_dashboard_data.php
└── indicadores, alertas y tablas demo por usuario

dashboard.php
├── requireAuth()
├── carga datos demo según usuario
├── menú por rol
├── indicadores y alertas de Inicio
├── tablas de seguimiento
├── cierre de sesión en la barra superior
└── vistas temporales de módulos

assets/css/app.css
├── estilos globales
├── navegación lateral fija en escritorio
└── adaptación móvil

assets/css/dashboard.css
└── estilos específicos del Inicio con datos demo

api/
└── conserva acciones de navegación durante la sesión

logout.php
└── destruye la sesión y redirige al login
```

## Contexto guardado en sesión

La clave `$_SESSION['livp_user']` contiene, como mínimo:

- identificador del usuario;
- rol y etiqueta del rol;
- documento de acceso;
- nombre y perfil;
- tipo de cuenta: persona, empresa o consorcio;
- entidad relacionada;
- empresas participantes cuando es consorcio;
- fecha y hora de inicio de sesión.

La clave `$_SESSION['action_cache']` guarda el historial temporal de acciones de la sesión.

## Fuente de dashboard demo

`config/demo_dashboard_data.php` es la única fuente temporal de indicadores y tablas del Inicio. Los datos se indexan por `id` del usuario demo. Esto permite cambiar la información de una vista sin modificar `dashboard.php`.

Cuando se implemente MySQL, esta fuente debe ser reemplazada por consultas o servicios que entreguen la misma estructura: resumen, métricas, alertas, tabla principal y tabla secundaria.
