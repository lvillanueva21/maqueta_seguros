# Arquitectura actual

```text
config/demo_expedients.php
├── clientes y entidades demo
├── ejecutivos demo
└── expedientes como contenedores con quotes[]

expedientes.php
├── requireModuleAccess('expedientes')
├── creación mínima: entidad, responsable, situación opcional
├── listado y filtros de expediente
├── ficha sin campos obligatorios de seguro
└── marcador para cotizaciones futuras

assets/js/expedientes.js
├── localStorage v2
├── migración de datos v1 al modelo corregido
├── código EXP-AAAA-NNNN
├── conteo de cotizaciones opcionales
├── filtros por situación y responsable
└── cambio flexible de situación

config/demo_catalogs.php
└── situaciones de expediente sin flujo obligatorio

assets/js/catalogos.js
└── migración de situaciones antiguas guardadas en caché

assets/js/app.js
└── sistema global window.BrokerNotify

assets/js/catalogos.js
└── notificaciones explícitas de guardado, error y restauración
```

## Contrato de datos de expediente

```text
Expediente
- id
- code
- client_id / client_name
- responsable
- title
- state
- opened_at / updated_at
- description
- quotes[] (opcional)
```

El expediente no contiene en su raíz: tipo de gestión, tipo de seguro, aseguradora, moneda, prima, cuotas, pagos ni póliza.

## Próxima entidad: cotización

Una cotización pertenecerá opcionalmente a un expediente y podrá tener:

```text
Cotización
- id y código
- expediente padre
- plantilla aplicada
- datos personalizados de la plantilla
- alternativas[]
- advertencias, mensajes y notas
- estado propio
```

Cada alternativa podrá representar una propuesta de aseguradora, uno o varios seguros, primas, cuotas, vigencia, coberturas, deducibles y condiciones.
