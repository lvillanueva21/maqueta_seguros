# Historial de cambios

## 27/06/2026 12:28:26 (America/Lima) — BS-20260627-122826-PET — Catálogos demo básicos

### Implementado

- Fuente central `config/demo_catalogs.php`.
- Ruta funcional `catalogos.php` protegida por permisos.
- Siete grupos demo: aseguradoras, tipos de seguro, monedas, estados de expediente, póliza, pago y siniestro.
- Gerente: acciones demo de agregar, editar, activar, desactivar y restaurar.
- Ejecutivo: consulta sin acciones de edición.
- Cambios demo persistentes solo en el navegador mediante `localStorage`.
- Redirección del módulo Catálogos desde `moduleUrl()` hacia la nueva ruta funcional.
- Actualización de documentación, plan, pruebas y versión trazable.

### Decisión técnica

Los cambios de Catálogos no alteran la configuración PHP ni se comparten entre dispositivos. Esta fase sirve para validar cuáles campos y estados serán persistidos cuando exista MySQL.

### Pendiente

- Ejecutar pruebas CAT-01 a CAT-10.
- Expedientes demo: crear, listar, filtrar, ver detalle y cambiar estado.
- Persistencia con MySQL.

## 27/06/2026 12:20:47 (America/Lima) — BS-20260627-1220-PET — Matriz de permisos y rutas controladas

### Implementado

- Archivo central `config/modules.php` con módulos, roles permitidos, etiquetas e íconos.
- Funciones de permisos en `config/bootstrap.php`.
- Menú lateral generado desde la misma matriz utilizada para validar permisos.
- Rutas `modulo.php` y `acceso_denegado.php`.
- Validación de acceso por PHP.
- Componentes reutilizables de navegación.

## 27/06/2026 12:20:47 (America/Lima) — Marca BROKER SEGUROS y cierre de sesión accesible

### Implementado

- Nombre visible oficial actualizado a **BROKER SEGUROS**.
- Menú lateral fijo e ícono de cierre de sesión superior.
