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
├── catálogo y validación de permisos de módulos
└── creación y destrucción de sesión

config/modules.php
└── única fuente de módulos, rutas lógicas y roles permitidos

config/demo_users.php
└── catálogo temporal de cuatro usuarios demo

config/demo_dashboard_data.php
└── indicadores, alertas y tablas demo por usuario

views/partials/
├── sidebar.php
│   └── menú generado desde permisos del rol
└── topbar.php
    └── barra superior y cierre de sesión

dashboard.php
├── requireAuth()
├── carga datos demo según usuario
├── Inicio permitido para todo perfil autenticado
└── dashboard personalizado

modulo.php
├── requireModuleAccess()
└── ruta genérica protegida para módulos en preparación

acceso_denegado.php
└── respuesta controlada para rutas no permitidas o inexistentes

assets/js/app.js
├── navegación normal mediante enlaces
├── registro temporal de navegación
└── comportamiento del menú móvil

api/
└── conserva acciones de navegación durante la sesión

logout.php
└── destruye la sesión y redirige al login
```

## Fuente de permisos

`config/modules.php` contiene la matriz temporal de permisos. El menú y `requireModuleAccess()` usan esta misma fuente para evitar diferencias entre lo que se ve y lo que se permite abrir.

Cuando se implemente MySQL, esta matriz puede migrar a tablas de roles, permisos y módulos, manteniendo las funciones de acceso como contrato de aplicación.
