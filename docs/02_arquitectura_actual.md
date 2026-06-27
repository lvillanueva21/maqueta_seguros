# Arquitectura actual

```text
config/bootstrap.php
|-- sesión, cabeceras no-cache, rutas relativas y permisos
`-- requireModuleAccess() protege rutas reales de módulo

config/demo_clients.php
|-- empresas demo
|-- consorcios demo
`-- contactos de gestión demo

assets/js/cache-migrations.js
|-- migración de catálogos locales antiguos
|-- migración de entidades, contactos y expedientes
|-- helpers de fecha/hora America/Lima
`-- lectura/escritura compartida de localStorage

assets/js/app.js
|-- window.BrokerNotify
|-- host global sin modal
|-- host interno cuando hay <dialog> abierto
|-- confirmación y deduplicación de notificaciones
`-- historial temporal de acciones

assets/css/notifications.css
`-- estilos de mensajes globales e internos

assets/css/modal-ui.css
`-- capa común de campos y bloques dinámicos en modales

clientes.php + assets/js/clientes.js
|-- Empresas, Consorcios y Contactos
`-- desactivación con motivo

expedientes.php + assets/js/expedientes.js
|-- expediente flexible
|-- contacto de gestión obligatorio
|-- cliente opcional
`-- cotizaciones futuras opcionales
```

## Regla de capas

Los `<dialog>` nativos se muestran en la capa superior del navegador. Por eso un toast normal del documento puede quedar detrás. La arquitectura actual inserta el aviso dentro del `<dialog>` cuando existe uno abierto.
