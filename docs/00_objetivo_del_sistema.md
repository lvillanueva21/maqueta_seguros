# Objetivo del sistema

## Visión inicial

LIVP Seguros será un sistema web para gestionar de forma gradual información y operaciones relacionadas con seguros intermediados.

La primera etapa es una maqueta funcional sin base de datos. Su propósito es validar interfaces, perfiles, navegación, reglas de acceso y flujos antes de diseñar tablas definitivas.

## Objetivo actual

Contar con una base estable de autenticación demo, contexto de usuario y dashboard diferenciado para validar qué información necesita realmente cada perfil.

El sistema debe poder responder, sin una base de datos todavía:

- quién ingresó;
- qué rol tiene;
- si representa a una persona, empresa o consorcio;
- qué menú y datos puede visualizar;
- qué indicadores y alertas necesita en Inicio;
- cuándo empezó su sesión.

## Alcance actual

- Login por DNI, CE o RUC.
- Perfiles demo: gerente, ejecutivo, empresa cliente y consorcio.
- Dashboard con indicadores, alertas y tablas demo según el perfil.
- Navegación y acciones temporales en sesión y navegador.
- Sin base de datos ni almacenamiento permanente de negocio.

## Criterio de avance

Cada funcionalidad debe ser pequeña, ejecutable desde el sistema publicado y validada manualmente antes de iniciar la siguiente.
