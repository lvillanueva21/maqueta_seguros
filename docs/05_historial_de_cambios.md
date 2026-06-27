# Historial de cambios

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

### Pendiente

- Datos demo de negocio por perfil.
- Permisos de rutas para módulos reales.
- Expedientes.
- Persistencia con MySQL.
