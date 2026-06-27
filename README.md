# BROKER SEGUROS — Maqueta funcional inicial

Primer prototipo web en **PHP, JavaScript y CSS**, sin base de datos.

> El repositorio conserva el nombre `maqueta_seguros`, pero el nombre oficial visible del sistema es **BROKER SEGUROS**.

## Versión de entrega

La versión aplicada en el repositorio se controla desde:

```text
docs/00_version_actual.md
```

Versión base revisada: `BS-20260627-135448-PET` — 27/06/2026 13:54:48 (America/Lima).

Este paquete local prepara la corrección `Contacto de gestión + Expediente v3`:

```text
BS-20260627-164101-PET
27/06/2026 16:41:01 (America/Lima)
```

## Incluye

- Login demo por DNI, CE o RUC.
- Cuatro accesos de prueba: gerente, ejecutivo, empresa y consorcio.
- Sesión protegida y cierre de sesión.
- Dashboard con datos demo distintos para cada perfil.
- Matriz de permisos y rutas protegidas en servidor.
- Catálogos demo de aseguradoras, tipos de seguro, monedas y situaciones.
- Expedientes flexibles: crear, listar, filtrar, abrir ficha y actualizar datos básicos.
- Contactos de gestión: persona natural con celular obligatorio y vínculo opcional a empresa o consorcio.
- Cliente o entidad opcional al inicio del expediente.
- Expedientes que pueden existir sin cotizaciones, seguros, pólizas o pagos.
- Notificaciones amigables de éxito, error, advertencia e información.
- Diseño responsive sin dependencias externas.

## Credenciales de prueba

| Perfil | Tipo | Documento | Contraseña |
|---|---:|---:|---|
| Gerente | DNI | 12345678 | `Gerente2026!` |
| Ejecutivo | DNI | 87654321 | `Ejecutivo2026!` |
| Empresa cliente | RUC | 20123456789 | `Empresa2026!` |
| Consorcio | RUC | 20698765432 | `Consorcio2026!` |

## Documentación del proyecto

La documentación viva se mantiene en [`docs/`](docs/):

- Versión actual: [`docs/00_version_actual.md`](docs/00_version_actual.md)
- Objetivo y alcance: [`docs/00_objetivo_del_sistema.md`](docs/00_objetivo_del_sistema.md)
- Reglas técnicas: [`docs/01_reglas_tecnicas.md`](docs/01_reglas_tecnicas.md)
- Arquitectura actual: [`docs/02_arquitectura_actual.md`](docs/02_arquitectura_actual.md)
- Plan incremental: [`docs/03_plan_de_implementacion.md`](docs/03_plan_de_implementacion.md)
- Pruebas manuales: [`docs/04_pruebas_manual_y_humo.md`](docs/04_pruebas_manual_y_humo.md)
- Historial: [`docs/05_historial_de_cambios.md`](docs/05_historial_de_cambios.md)
- Contactos y Expedientes v2: [`docs/funcionalidades/contactos_y_expedientes_v2.md`](docs/funcionalidades/contactos_y_expedientes_v2.md)

## Nota

Esta maqueta no almacena información de negocio de forma permanente. Los cambios realizados desde Catálogos, Contactos y Expedientes se guardan solamente en el navegador actual mediante `localStorage`.
