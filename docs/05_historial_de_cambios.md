# Historial de cambios

## 27/06/2026 12:20:47 (America/Lima) — BS-20260627-1220-PET — Matriz de permisos y rutas controladas

### Implementado

- Archivo central `config/modules.php` con módulos, roles permitidos, etiquetas e íconos.
- Funciones de permisos en `config/bootstrap.php`: `modulesForRole()`, `canAccessModule()`, `moduleUrl()` y `requireModuleAccess()`.
- Menú lateral generado desde la misma matriz utilizada para validar permisos.
- Nuevas rutas `modulo.php` y `acceso_denegado.php`.
- Validación de acceso realizada por PHP al abrir una URL, no solo al ocultar opciones visuales.
- Componentes reutilizables `views/partials/sidebar.php` y `views/partials/topbar.php`.
- JavaScript ajustado para navegar mediante URLs reales y registrar la navegación temporalmente.
- Archivo `docs/00_version_actual.md` como referencia de sincronización entre entrega y repositorio.

### Decisión técnica

Los módulos se mantienen en una única configuración mientras la maqueta valida el flujo. En una fase posterior, esta matriz podrá migrar a MySQL sin cambiar la forma en que las pantallas consultan permiso.

### Pendiente

- Ejecutar pruebas manuales PERM-01 a PERM-10.
- Catálogos demo básicos.
- Expedientes.
- Persistencia con MySQL.

## 27/06/2026 12:20:47 (America/Lima) — Marca BROKER SEGUROS y cierre de sesión accesible

### Implementado

- Nombre visible oficial actualizado a **BROKER SEGUROS**.
- Constantes `APP_NAME` y `APP_SHORT_NAME` centralizadas en `config/bootstrap.php`.
- Cookie de sesión renombrada a `broker_seguros_demo_session`.
- Menú lateral fijado al alto de la ventana en escritorio, con desplazamiento interno cuando sea necesario.
- Ícono y enlace de cierre de sesión agregado a la barra superior.
- Actualización de documentación y pruebas de humo de marca y navegación.

## 27/06/2026 — Dashboard con datos demo por perfil

### Implementado

- Fuente central `config/demo_dashboard_data.php`.
- Indicadores, alertas y tablas diferentes para gerente, ejecutivo, empresa y consorcio.
- Resumen consolidado y separado por empresas para el perfil consorcio.
- Hoja de estilos independiente `assets/css/dashboard.css`.
