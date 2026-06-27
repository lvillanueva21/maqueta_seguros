# Objetivo del sistema

## Visión inicial

**BROKER SEGUROS** será un sistema web para gestionar de forma gradual información y operaciones relacionadas con seguros intermediados.

La primera etapa es una maqueta funcional sin base de datos. Su propósito es validar interfaces, perfiles, navegación, reglas de acceso y flujos antes de diseñar tablas definitivas.

> El repositorio puede llamarse `maqueta_seguros`, pero el nombre oficial visible del producto es **BROKER SEGUROS**.

## Objetivo actual

Contar con una base estable de autenticación demo, contexto de usuario, dashboard diferenciado, permisos de módulos y catálogos básicos para validar el flujo antes de definir MySQL.

El sistema debe poder responder, sin una base de datos todavía:

- quién ingresó;
- qué rol tiene;
- si representa a una persona, empresa o consorcio;
- qué módulos puede ver y abrir;
- qué datos maestros estarán disponibles en formularios futuros;
- qué indicadores y alertas necesita en Inicio;
- cuándo empezó su sesión.

## Alcance actual

- Login por DNI, CE o RUC.
- Perfiles demo: gerente, ejecutivo, empresa cliente y consorcio.
- Dashboard con indicadores, alertas y tablas demo según el perfil.
- Catálogo central de módulos y permisos por rol.
- Rutas protegidas desde PHP y página controlada de acceso no autorizado.
- Catálogos demo para aseguradoras, seguros, monedas y estados operativos.
- Edición temporal de catálogos para gerente mediante almacenamiento local del navegador.
- Consulta de catálogos para ejecutivo.
- Sin base de datos ni almacenamiento permanente de negocio.

## Criterio de avance

Cada funcionalidad debe ser pequeña, ejecutable desde el sistema publicado y validada manualmente antes de iniciar la siguiente.
