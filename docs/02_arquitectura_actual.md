# Arquitectura actual

```text
config/demo_clients.php
|-- empresas demo
|-- consorcios demo
`-- contactos de gestión demo

clientes.php + assets/js/clientes.js + assets/css/clientes.css
|-- pestañas Empresas / Consorcios / Contactos
|-- creación, edición, búsqueda, activación y desactivación
`-- validación de RUC y relaciones locales

assets/js/cache-migrations.js
|-- catálogos
|-- contactos
|-- entidades `broker_seguros_demo_entities_v1`
|-- expedientes `broker_seguros_demo_expedients_v3`
`-- migración de referencias antiguas de cliente

expedientes.php + assets/js/expedientes.js
|-- usa entidades dinámicas de Clientes
|-- sugiere entidad para contacto con único vínculo
`-- conserva cliente como dato opcional
```

## Claves de caché

- `broker_seguros_demo_entities_v1`
- `broker_seguros_demo_contacts_v1`
- `broker_seguros_demo_expedients_v3`
