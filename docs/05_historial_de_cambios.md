# Historial de cambios

## 27/06/2026 12:39:37 (America/Lima) — BS-20260627-123937-PET — Expedientes demo v1

### Implementado

- Nuevo módulo protegido `expedientes.php`.
- Catálogo de módulo y permisos actualizado con Expedientes para gerente y ejecutivo.
- Fuente inicial `config/demo_expedients.php` con clientes, responsables, tipos de gestión y expedientes demo.
- Creación temporal de expedientes con código automático `EXP-AAAA-NNNN`.
- Listado, búsqueda y filtros por estado, tipo de seguro, aseguradora y responsable.
- Ficha de expediente con datos clave y cambio de estado.
- Gerente con vista global y selector de ejecutivo responsable.
- Ejecutivo con vista limitada a expedientes asignados a su usuario.
- Persistencia temporal por navegador mediante `localStorage`.
- Documentación, arquitectura, plan, pruebas y versión actualizados.

### Decisión técnica

Expedientes es el núcleo previo a pólizas, pagos y documentos. Los cambios se mantienen locales durante la etapa de maqueta para validar campos y flujo sin definir aún las tablas finales de MySQL.

### Pendiente

- Ejecutar pruebas EXP-01 a EXP-13.
- Detalle ampliado, línea de tiempo y observaciones por expediente.
- Persistencia con MySQL.

## 27/06/2026 12:28:26 (America/Lima) — BS-20260627-122826-PET — Catálogos demo básicos

### Implementado

- Fuente central `config/demo_catalogs.php`.
- Ruta funcional `catalogos.php` protegida por permisos.
- Catálogos de aseguradoras, tipos de seguro, monedas y estados.
- Gerente con edición temporal; ejecutivo con consulta.

## 27/06/2026 12:20:47 (America/Lima) — BS-20260627-1220-PET — Matriz de permisos y rutas controladas

### Implementado

- Catálogo central de módulos y validación de permisos por PHP.
- Menú generado desde permisos y página de acceso denegado.
