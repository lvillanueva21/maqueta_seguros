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

config/demo_expedients.php
├── clientes y entidades demo
├── ejecutivos demo
├── tipos de gestión
└── expedientes iniciales

expedientes.php
├── requireModuleAccess('expedientes')
├── gerente: vista global y asignación de responsable
├── ejecutivo: vista de expedientes asignados
├── creación, filtros y ficha
└── cambio de estado temporal

assets/js/expedientes.js
├── carga de datos demo y catálogos
├── localStorage de expedientes
├── generación de código EXP-AAAA-NNNN
├── filtros por estado, seguro, aseguradora y responsable
└── actualización de estado

catalogos.php
└── catálogos demo y configuración operativa

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

## Fuente de expedientes

`config/demo_expedients.php` contiene el conjunto inicial de clientes, responsables y expedientes. Las modificaciones de la maqueta viven solo en el navegador mediante `localStorage`.

Cuando se incorpore MySQL, los datos se separarán en entidades normalizadas, al menos: clientes, usuarios responsables, expedientes y su historial de estados.
