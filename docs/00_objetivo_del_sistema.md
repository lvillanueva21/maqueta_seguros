# Objetivo del sistema

## Visión inicial

**BROKER SEGUROS** será un sistema web para digitalizar de forma gradual la gestión de procesos aseguradores que antes se controlaban en papel: expedientes, contactos, clientes, cotizaciones, pólizas, documentos y seguimiento.

La primera etapa es una maqueta funcional sin base de datos. Su propósito es validar interfaces, perfiles, reglas de acceso y flujos antes de diseñar tablas definitivas.

## Modelo operativo vigente

Un **expediente** representa un solo proceso asegurador.

Puede iniciar sin cliente, tipo de seguro, aseguradora, cotización o póliza. No puede iniciar sin:

- nombre del expediente;
- descripción o detalle;
- contacto de gestión.

El **contacto de gestión** es una persona natural interesada o relacionada con el proceso, por ejemplo una secretaria, representante, gerente o solicitante. No es un usuario interno ni un cliente por sí mismo.

El **cliente** es una empresa o consorcio. Puede quedar pendiente al inicio y será obligatorio antes de registrar una póliza en una fase posterior.

No existe un flujo rígido: el expediente puede mantenerse como consulta, recibir cotizaciones, llegar a una o varias pólizas de continuidad o cerrarse sin contratación.

## Alcance actual

- Login por DNI, CE o RUC.
- Perfiles demo: gerente, ejecutivo, empresa cliente y consorcio.
- Dashboard con datos demo según perfil.
- Rutas y menú por rol.
- Catálogos demo básicos.
- Expedientes flexibles.
- Contactos de gestión demo y registro rápido local.
- Cliente o entidad opcional al crear expediente.
- Situaciones de expediente sin secuencia forzada.
- Notificaciones de éxito, advertencia, información y error.
- Sin base de datos ni almacenamiento permanente de negocio.

## Criterio de avance

Cada funcionalidad debe ser pequeña, usable desde el sistema publicado y validada manualmente antes de iniciar la siguiente.
