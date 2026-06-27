# BROKER SEGUROS — Maqueta funcional inicial

Primer prototipo web en **PHP, JavaScript y CSS**, sin base de datos.

> El repositorio conserva el nombre `maqueta_seguros`, pero el nombre oficial visible del sistema es **BROKER SEGUROS**.

## Incluye

- Login por DNI, CE o RUC.
- Cuatro accesos de prueba: gerente, ejecutivo, empresa y consorcio.
- Sesión protegida y cierre de sesión.
- Dashboard con datos demo distintos para cada perfil.
- Menú lateral fijo en escritorio y accesible en móvil.
- Botón de cierre de sesión en la barra superior.
- Módulos no implementados con vista **“En construcción”**.
- Caché temporal de navegación con:
  - `$_SESSION` de PHP durante la sesión actual.
  - `localStorage` en el navegador para recuperar la última sección visitada.
- Diseño responsive sin dependencias externas.

## Credenciales de prueba

| Perfil | Tipo | Documento | Contraseña |
|---|---:|---:|---|
| Gerente | DNI | 12345678 | `Gerente2026!` |
| Ejecutivo | DNI | 87654321 | `Ejecutivo2026!` |
| Empresa cliente | RUC | 20123456789 | `Empresa2026!` |
| Consorcio | RUC | 20698765432 | `Consorcio2026!` |

El consorcio representa a **Constructora Norte S.A.C.** e **Ingeniería Andina S.A.C.**

## Ejecución local

Requiere PHP 8.1 o superior.

```bash
php -S localhost:8000
```

Luego abre:

```text
http://localhost:8000
```

## Documentación del proyecto

La documentación viva se mantiene en [`docs/`](docs/):

- Objetivo y alcance: [`docs/00_objetivo_del_sistema.md`](docs/00_objetivo_del_sistema.md)
- Reglas técnicas: [`docs/01_reglas_tecnicas.md`](docs/01_reglas_tecnicas.md)
- Arquitectura actual: [`docs/02_arquitectura_actual.md`](docs/02_arquitectura_actual.md)
- Plan incremental: [`docs/03_plan_de_implementacion.md`](docs/03_plan_de_implementacion.md)
- Pruebas manuales: [`docs/04_pruebas_manual_y_humo.md`](docs/04_pruebas_manual_y_humo.md)
- Historial: [`docs/05_historial_de_cambios.md`](docs/05_historial_de_cambios.md)
- Dashboard: [`docs/funcionalidades/dashboard_inicio.md`](docs/funcionalidades/dashboard_inicio.md)

## Nota

Esta maqueta no almacena información de negocio de forma permanente. Al reiniciar el navegador o cerrar sesión, los datos de sesión se eliminan. La navegación reciente puede mantenerse localmente en el navegador por `localStorage`.

Los indicadores y tablas del Inicio salen de `config/demo_dashboard_data.php`. Son datos de validación visual y funcional; no representan información real ni se guardan en una base de datos.

## Publicación en Hostinger

La maqueta no usa dominios, subdominios ni una `BASE_URL` configurada. Sus enlaces y recursos usan rutas relativas, por lo que puede instalarse en cualquiera de estas ubicaciones:

- Raíz de un subdominio: sube el contenido de esta carpeta al directorio raíz asignado al subdominio.
- Subcarpeta: por ejemplo, `public_html/maqueta/`, para abrirla en `tudominio.com/maqueta/`.

No subas el ZIP como archivo de ejecución. Extrae su contenido y verifica que `index.php`, `dashboard.php`, `assets/`, `api/` y `config/` queden directamente dentro de la carpeta pública elegida.

La cookie de sesión se limita automáticamente a la carpeta donde instales esta copia, evitando que otra maqueta ubicada en una subcarpeta distinta comparta la misma sesión.
