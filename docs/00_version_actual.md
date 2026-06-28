# Versión actual entregada

- **Código de versión:** `BS-20260627-203011-COT`
- **Fecha y hora de entrega:** 27/06/2026 20:30:11 (America/Lima)
- **Zona horaria:** Perú — America/Lima
- **Bloque funcional:** Cotizaciones v1: plantillas, destinatario registrado/informal, grupos comparativos, alternativas, adicionales enriquecidos, logos de aseguradora y vista A4.
- **Estado:** Maqueta sin MySQL. Los datos de cotización y plantilla se guardan en caché local del navegador. El PDF no se guarda en servidor.

## Reglas aplicadas

1. Toda cotización exige expediente de referencia y destinatario completo.
2. El destinatario puede ser registrado (contacto + empresa/consorcio) o informal (tipo, nombre, teléfono y cliente en texto libre).
3. La cotización no modifica los datos del expediente.
4. Cada cotización puede tener varios grupos y alternativas, pero solo una alternativa puede quedar elegida.
5. La vigencia es opcional; cuando vence se muestra visualmente como vencida sin cambiar el estado guardado.
6. La vista A4 se imprime o guarda como PDF desde el navegador; no queda un PDF físico en `almacen`.
