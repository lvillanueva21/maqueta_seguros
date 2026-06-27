# Arquitectura actual

```text
config/bootstrap.php
|-- sesion, cabeceras no-cache, rutas relativas y permisos
`-- requireModuleAccess() protege rutas reales de modulo

config/modules.php
`-- catalogo temporal de modulos, roles permitidos y descripciones

config/demo_catalogs.php
`-- datos maestros demo, incluidas situaciones flexibles de expediente

config/demo_expedients.php
|-- clientes y entidades demo
|-- ejecutivos demo
`-- expedientes como contenedores con quotes[]

assets/js/cache-migrations.js
|-- migracion de catalogos locales antiguos
|-- migracion de expedientes v1 a v2
|-- helpers de fecha/hora America/Lima
`-- lectura/escritura compartida de localStorage

assets/js/app.js
|-- window.BrokerNotify
|-- deduplicacion breve de toasts
|-- confirmacion por toast para acciones reversibles
`-- registro temporal de acciones

catalogos.php + assets/js/catalogos.js
|-- gerente: agrega, edita, activa, desactiva y restaura demo
`-- ejecutivo: consulta

expedientes.php + assets/js/expedientes.js
|-- requireModuleAccess('expedientes')
|-- creacion minima: entidad y responsable
|-- asunto y descripcion opcionales
|-- listado y filtros por situacion/responsable
|-- ficha sin campos obligatorios de seguro
`-- quotes[] reservado para cotizaciones futuras opcionales
```

## Contrato de expediente

```text
Expediente
- id
- code
- client_id / client_name
- responsible_user_id / responsible_name
- title
- state
- opened_at / updated_at
- description
- quotes[]
```

El expediente no contiene en su raiz: tipo de gestion, tipo de seguro, aseguradora, moneda, prima, cuotas, pagos, voucher, documento ni poliza.

## Seguridad y permisos

Los permisos actuales controlan interfaz y rutas PHP de la maqueta. La informacion guardada en `localStorage` no reemplaza autorizacion real de servidor. Cuando exista MySQL, todos los permisos y filtros deberan validarse en backend.

## Proxima entidad

Una cotizacion sera una entidad hija opcional del expediente. Podra usar plantillas configurables, varios seguros, alternativas y campos personalizados, pero ese modulo no forma parte de esta estabilizacion.
