# Arquitectura actual

```text
config/bootstrap.php
|-- sesión, cabeceras no-cache, rutas relativas y permisos
`-- requireModuleAccess() protege rutas reales de módulo

config/modules.php
`-- catálogo temporal de módulos, roles permitidos y descripciones

config/demo_catalogs.php
`-- datos maestros demo y situaciones flexibles de expediente

config/demo_expedients.php
|-- empresas y consorcios demo
|-- contactos de gestión demo
`-- expedientes flexibles con quotes[]

assets/js/cache-migrations.js
|-- migración de catálogos locales antiguos
|-- migración de expedientes v1/v2 a v3
|-- caché local de contactos
|-- helpers de fecha/hora America/Lima
`-- lectura/escritura compartida de localStorage

assets/js/app.js
|-- window.BrokerNotify
|-- deduplicación breve de toasts
|-- confirmación por toast
`-- registro temporal de acciones

catalogos.php + assets/js/catalogos.js
|-- gerente: agrega, edita, activa, desactiva y restaura demo
`-- ejecutivo: consulta

expedientes.php + assets/js/expedientes.js
|-- requireModuleAccess('expedientes')
|-- gerente y ejecutivo: consulta y trabajo compartido
|-- creación: contacto, nombre y detalle obligatorios
|-- cliente opcional
|-- registro rápido de contacto
|-- ficha para actualizar datos básicos
`-- quotes[] reservado para cotizaciones futuras
```

## Contrato de expediente v3

```text
Expediente
- id
- code
- title
- description
- contact_id / contact_name / contact_mobile
- client_id / client_name / client_document / entity_type
- state
- opened_at / updated_at
- quotes[]
- legacy_assigned_executive_* (solo migración, no visible)
```

## Contrato de contacto de gestión

```text
Contacto
- id
- full_name
- mobile
- email
- document_type / document
- label
- relationships[]
- active
```

Cada elemento de `relationships[]` puede vincular el contacto a una empresa o consorcio y describir su relación.

## Seguridad y permisos

Los permisos actuales controlan interfaz y rutas PHP de la maqueta. `localStorage` no reemplaza autorización real. Cuando exista MySQL, todas las validaciones deberán ejecutarse también en backend.

## Próximas entidades

Empresas y Consorcios deberán formalizarse como módulos. Después se implementarán tipos de seguro, aseguradoras, cotizaciones, pólizas, timeline y documentos.
