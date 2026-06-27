# Funcionalidad: Expedientes demo v1

## Versión de entrega

- **Código:** `BS-20260627-123937-PET`
- **Fecha y hora Perú:** 27/06/2026 12:39:37 (America/Lima)

## Propósito

Validar el núcleo operativo de BROKER SEGUROS antes de diseñar una base de datos. Un expediente representa una gestión previa o relacionada a una póliza: cotización, emisión, renovación, endoso, consulta o regularización.

## Ruta y permisos

- Ruta: `expedientes.php`
- Roles permitidos: gerente y ejecutivo.
- Gerente: ve todos los expedientes y elige responsable al crear.
- Ejecutivo: ve únicamente los expedientes cuyo `responsible_user_id` corresponde a su sesión.
- Cliente empresa y consorcio: sin acceso durante esta fase.

## Datos mínimos

Todo expediente usa:

- código automático;
- cliente o entidad;
- tipo de gestión;
- tipo de seguro;
- aseguradora;
- moneda;
- estado;
- responsable;
- fecha de apertura;
- fecha de actualización;
- descripción inicial.

## Código automático

Formato:

```text
EXP-AAAA-NNNN
```

Ejemplo:

```text
EXP-2026-0006
```

La secuencia se calcula sobre los expedientes guardados en el navegador para el año actual.

## Persistencia temporal

- Fuente inicial: `config/demo_expedients.php`.
- Cambios del usuario: `localStorage`.
- No se modifican archivos PHP, servidor ni GitHub.
- La información no se comparte entre navegadores o dispositivos.
- La limpieza del almacenamiento del navegador restablece los datos iniciales.

## Flujo

1. Gerente o ejecutivo ingresa al módulo Expedientes.
2. El sistema filtra la cartera visible según el rol.
3. El usuario crea una gestión con los catálogos disponibles.
4. Se genera el código automático.
5. El expediente aparece en el listado.
6. Se abre su ficha y se puede cambiar el estado.
7. La acción se registra temporalmente en el historial de sesión.

## Pruebas esenciales

- Crear como gerente y ejecutivo.
- Comprobar visibilidad diferenciada por responsable.
- Validar filtros.
- Revisar la ficha.
- Cambiar estado y recargar.
- Confirmar acceso denegado para perfiles cliente.
