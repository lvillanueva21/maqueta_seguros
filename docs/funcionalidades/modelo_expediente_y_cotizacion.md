# Modelo de expediente y cotización

## Versión de decisión

- **Código de versión:** `BS-20260627-131127-PET`
- **Fecha y hora Perú:** 27/06/2026 13:11:27 (America/Lima)

## Regla principal

El expediente no es una cotización ni una póliza. Es el contenedor principal de una necesidad o caso del cliente.

No hay flujo obligatorio.

Un expediente puede abrirse, asignarse a un responsable, mantenerse en seguimiento, quedar en espera, cerrarse o cancelarse sin tener:

- cotización;
- tipo de seguro;
- aseguradora;
- póliza;
- pago;
- voucher;
- documento.

## Relación futura

```text
Expediente 1 ── 0..N Cotizaciones
Cotización 1 ── 1..N Alternativas
Alternativa ── 0..N Seguros / coberturas / condiciones
```

- Un expediente puede tener cero, una o varias cotizaciones.
- Una cotización puede usar una plantilla.
- Una cotización puede tener una o más alternativas.
- Una alternativa puede contener uno o varios seguros según la plantilla y el caso real.
- La creación de una póliza, pago o voucher depende de que el caso avance, pero nunca será requisito para que el expediente exista o se cierre.

## Plantillas de cotización

Una plantilla debe permitir configurar:

- nombre y propósito;
- ítems personalizados;
- tipo de dato por ítem;
- orden y obligatoriedad;
- mensajes, advertencias y notas;
- secciones para datos del cliente, objeto asegurado, alternativas, coberturas, pagos u otros;
- datos propios de un seguro o producto sin afectar cotizaciones de otro tipo.

## Separación de responsabilidades

| Elemento | Pertenece a |
|---|---|
| Cliente, responsable, asunto, situación, fecha, descripción | Expediente |
| Formulario variable, datos particulares, advertencias, mensajes, notas | Cotización y su plantilla |
| Aseguradora, prima, cuotas, vigencia, GPS, deducibles, coberturas | Alternativa de cotización, según plantilla |
| Número de póliza, vigencia emitida, estado de póliza | Póliza futura |
| Cuotas, vouchers, validación de pago | Pago futuro |

## Regla técnica

No agregar campos de una cotización directamente a `config/demo_expedients.php`, `expedientes.php` ni a la ficha de expediente salvo que se confirme que son universales para todos los casos.
