# Objetivo del sistema

## Visión inicial

**BROKER SEGUROS** será un sistema web para gestionar de forma gradual información y operaciones relacionadas con seguros intermediados.

La primera etapa es una maqueta funcional sin base de datos. Su propósito es validar interfaces, perfiles, navegación, reglas de acceso y flujos antes de diseñar tablas definitivas.

> El repositorio puede llamarse `maqueta_seguros`, pero el nombre oficial visible del producto es **BROKER SEGUROS**.

## Modelo operativo validado

Un **expediente** es el contenedor principal de una necesidad, consulta o caso de un cliente.

No existe un flujo obligatorio. Un expediente puede:

- crearse con cliente o entidad y responsable;
- permanecer solo como registro de una consulta;
- recibir una o varias cotizaciones;
- no llegar nunca a tener una cotización;
- cerrarse sin seguro, póliza, pago o documento;
- incorporar datos adicionales en cualquier momento.

Las **cotizaciones** serán entidades opcionales que pertenecen a un expediente. Cada cotización podrá usar una plantilla con ítems personalizados, uno o varios tipos de seguro, alternativas de aseguradoras, primas, cuotas, advertencias, mensajes y notas.

## Objetivo actual

Validar la estructura mínima de expediente y preparar el sistema para agregar cotizaciones configurables sin fijar prematuramente los campos de cada tipo de seguro.

## Alcance actual

- Login por DNI, CE o RUC.
- Perfiles demo: gerente, ejecutivo, empresa cliente y consorcio.
- Dashboard con indicadores, alertas y tablas demo según el perfil.
- Catálogo central de módulos y permisos por rol.
- Catálogos demo para aseguradoras, seguros, monedas y situaciones operativas.
- Expedientes demo como contenedor flexible.
- Situaciones de expediente sin secuencia forzada.
- Notificaciones de éxito, advertencia, información y error.
- Sin base de datos ni almacenamiento permanente de negocio.

## Criterio de avance

Cada funcionalidad debe ser pequeña, ejecutable desde el sistema publicado y validada manualmente antes de iniciar la siguiente.
