# Historial de cambios

## 2026-06-27 — Marca BROKER SEGUROS y cierre de sesión accesible

### Implementado

- Nombre visible oficial actualizado a **BROKER SEGUROS**.
- Constantes `APP_NAME` y `APP_SHORT_NAME` centralizadas en `config/bootstrap.php`.
- Cookie de sesión renombrada a `broker_seguros_demo_session`.
- Menú lateral fijado al alto de la ventana en escritorio, con desplazamiento interno cuando sea necesario.
- Ícono y enlace de cierre de sesión agregado a la barra superior.
- Actualización de documentación y pruebas de humo de marca y navegación.

### Impacto esperado

Después de desplegar este cambio, las sesiones abiertas previamente pueden requerir un nuevo inicio de sesión porque cambia el nombre de la cookie.

### Pendiente

- Matriz de permisos y control de acceso real por módulo.
- Catálogos demo básicos.
- Expedientes.
- Persistencia con MySQL.

## 2026-06-27 — Dashboard con datos demo por perfil

### Implementado

- Fuente central `config/demo_dashboard_data.php`.
- Indicadores, alertas y tablas diferentes para gerente, ejecutivo, empresa y consorcio.
- Resumen consolidado y separado por empresas para el perfil consorcio.
- Hoja de estilos independiente `assets/css/dashboard.css`.
- Actualización de documentación, plan y pruebas de humo para el dashboard.

### Decisión técnica

Los datos de Inicio se concentran en un único archivo de configuración para validar la necesidad real de cada indicador antes de crear tablas MySQL.

## 2026-06-27 — Base de sesión y documentación viva

### Implementado

- Contexto de sesión centralizado mediante `createUserSession()`.
- Regeneración del identificador de sesión al iniciar sesión.
- Tipo de cuenta explícito: persona, empresa o consorcio.
- Fecha y hora de inicio de sesión.
- Cabeceras anti-caché para vistas privadas y cierre de sesión.
- Función centralizada para destruir sesión.
- Visualización de tipo de cuenta e inicio de sesión en el dashboard.
- Estructura inicial de documentación en `docs/`.
