# Arquitectura actual

```text
assets/js/app.js
├── menú móvil y registro temporal de navegación
├── carga de acciones recientes
├── window.BrokerNotify
└── detección de acciones guardadas en Catálogos y Expedientes

assets/css/notifications.css
└── estilos globales de éxito, error, advertencia e información

config/bootstrap.php
├── rutas relativas
├── sesiones y autenticación
└── permisos de módulos

config/demo_catalogs.php
└── catálogos demo

config/demo_expedients.php
└── clientes, responsables y expedientes demo

catalogos.php
└── gestión temporal de datos maestros

expedientes.php
└── creación, listado, ficha y estado de expedientes demo

docs/
└── reglas, pruebas, historial y versión de cada entrega
```

## Sistema de notificaciones

`assets/js/app.js` crea `window.BrokerNotify`, una interfaz global para comunicar éxito, error, advertencia e información. También carga automáticamente `assets/css/notifications.css`.

La capa de notificaciones observa las acciones de Catálogos y Expedientes para confirmar guardados temporales, cambios de estado, restauraciones y validaciones incompletas.

Esta solución no sustituye la validación de servidor que existirá con MySQL; por ahora comunica el resultado de las acciones que se guardan en `localStorage`.
