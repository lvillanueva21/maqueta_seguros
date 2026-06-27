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

config/demo_catalogs.php
└── datos maestros demo de aseguradoras, seguros, monedas y estados

catalogos.php
├── requireModuleAccess('catalogos')
├── gerente: edición temporal en navegador
└── ejecutivo: consulta de datos maestros

assets/js/catalogos.js
├── carga de catálogos demo
├── persistencia local de cambios temporales
├── agregar, editar y activar/desactivar para gerente
└── restauración de datos demo

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
└── panel personalizado de Inicio

modulo.php
└── ruta genérica protegida para módulos en preparación

acceso_denegado.php
└── respuesta controlada para rutas no permitidas o inexistentes
```

## Fuente de permisos

`config/modules.php` contiene la matriz temporal de permisos. El menú y `requireModuleAccess()` usan esta misma fuente para evitar diferencias entre lo que se ve y lo que se permite abrir.

## Fuente de catálogos

`config/demo_catalogs.php` es la fuente inicial de datos maestros. Los cambios realizados por gerente en la maqueta viven solo en el navegador, por lo que una restauración, limpieza de caché o cambio de navegador recupera los datos base.
