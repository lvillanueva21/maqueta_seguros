# BROKER SEGUROS — Maqueta funcional inicial

Primer prototipo web en **PHP, JavaScript y CSS**, sin base de datos.

> El repositorio conserva el nombre `maqueta_seguros`, pero el nombre oficial visible del sistema es **BROKER SEGUROS**.

## Versión de entrega

La versión aplicada en el repositorio se controla desde:

```text
docs/00_version_actual.md
```

Versión de este paquete: `BS-20260627-1220-PET` — 27/06/2026 12:20:47 (America/Lima).

## Incluye

- Login por DNI, CE o RUC.
- Cuatro accesos de prueba: gerente, ejecutivo, empresa y consorcio.
- Sesión protegida y cierre de sesión.
- Dashboard con datos demo distintos para cada perfil.
- Matriz de permisos y rutas protegidas en servidor.
- Menú lateral generado según el rol autenticado.
- Página controlada de acceso no autorizado.
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
- Permisos y rutas: [`docs/funcionalidades/permisos_y_rutas.md`](docs/funcionalidades/permisos_y_rutas.md)

## Ejecución local

Requiere PHP 8.1 o superior.

```bash
php -S localhost:8000
```

Luego abre:

```text
http://localhost:8000
```

## Nota

Esta maqueta no almacena información de negocio de forma permanente. Los indicadores del Inicio y la matriz de permisos son datos de validación funcional; no representan información real ni se guardan en una base de datos.

## Publicación en Hostinger

La maqueta no usa dominios, subdominios ni una `BASE_URL` configurada. Puede instalarse en una subcarpeta como:

```text
public_html/maqueta/
```

No subas el ZIP como archivo de ejecución. Extrae su contenido y verifica que `index.php`, `dashboard.php`, `modulo.php`, `assets/`, `api/`, `config/` y `views/` queden directamente dentro de la carpeta pública elegida.
