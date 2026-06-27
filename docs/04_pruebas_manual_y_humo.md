# Pruebas manuales y de humo

## Versión

| ID | Prueba | Resultado esperado |
|---|---|---|
| VER-01 | Abrir `docs/00_version_actual.md` en GitHub luego del push | Debe aparecer `BS-20260627-164101-PET`. |
| VER-02 | Revisar fecha y hora | Debe indicar 27/06/2026 16:41:01 (America/Lima). |

## Contactos y expedientes v3

| ID | Prueba | Resultado esperado |
|---|---|---|
| EXP-CONT-01 | Abrir Expedientes en incógnito | Deben mostrarse 5 expedientes demo, incluyendo 1 con cliente pendiente. |
| EXP-CONT-02 | Abrir Crear expediente | Contacto de gestión, nombre y descripción son obligatorios; cliente es opcional. |
| EXP-CONT-03 | Crear expediente sin cliente | Se guarda y muestra `Pendiente de definir` como cliente. |
| EXP-CONT-04 | Intentar crear sin contacto | No se crea y aparece advertencia amigable. |
| EXP-CONT-05 | Intentar crear sin nombre o descripción | No se crea y aparece advertencia amigable. |
| EXP-CONT-06 | Registrar contacto rápido | Exige nombre y celular, se guarda localmente y queda seleccionado en el formulario. |
| EXP-CONT-07 | Registrar contacto rápido vinculado a entidad | El contacto se crea y la entidad vinculada queda en sus datos locales. |
| EXP-CONT-08 | Crear expediente con cliente | La tabla muestra contacto, cliente, código, situación y 0 cotizaciones. |
| EXP-CONT-09 | Abrir ficha de un expediente | Muestra contacto, cliente o pendiente, fechas Perú y descripción. |
| EXP-CONT-10 | Actualizar ficha | Permite cambiar contacto, cliente, situación, nombre y descripción. |
| EXP-CONT-11 | Actualizar expediente antiguo migrado | Permite asignar contacto sin convertir al antiguo ejecutivo en contacto. |
| EXP-CONT-12 | Entrar como gerente y luego como ejecutivo | Ambos ven todos los expedientes de la misma caché local. |
| EXP-CONT-13 | Recargar con F5 después de crear o editar | Los datos siguen visibles en el mismo navegador. |
| EXP-CONT-14 | Filtrar por Pendiente de definir | Solo muestra expedientes sin cliente. |
| EXP-CONT-15 | Revisar formulario y ficha | No deben aparecer `Ejecutivo responsable`, `responsible_user_id` ni filtros por ejecutivo. |
| EXP-CONT-16 | Revisar fechas `YYYY-MM-DD` | No cambian de día al mostrarse. |
| EXP-CONT-17 | Crear o actualizar | Aparece un solo toast claro por acción. |

## Migración de caché

| ID | Prueba | Resultado esperado |
|---|---|---|
| MIG-CONT-01 | Abrir Expedientes con caché `broker_seguros_demo_expedients_v2` | Se crea caché v3 sin perder código, cliente, fechas, descripción ni cotizaciones. |
| MIG-CONT-02 | Revisar campos antiguos de ejecutivo | No se muestran como contacto de gestión. |
| MIG-CONT-03 | Abrir Expedientes antes que Catálogos | Las situaciones antiguas se normalizan sin depender del orden de navegación. |

## Permisos

| ID | Prueba | Resultado esperado |
|---|---|---|
| PERM-CONT-01 | Cliente abre `expedientes.php` | Redirige a acceso no autorizado. |
| PERM-CONT-02 | Cliente abre `catalogos.php` | Redirige a acceso no autorizado. |
| PERM-CONT-03 | Cerrar sesión y usar Atrás/recargar | No debe mostrarse contenido privado desde caché. |

## Limitaciones deliberadas

- Incógnito no comparte `localStorage` con el navegador normal.
- La información demo no se comparte entre equipos.
- La seguridad real y los filtros por usuario se implementarán con MySQL y backend.
