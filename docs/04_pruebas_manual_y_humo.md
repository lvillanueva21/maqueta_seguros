# Pruebas manuales y de humo — Recuperación

## Identificación

- Versión esperada: `BS-20260627-193319-PET`
- Fecha: 27/06/2026 19:33:19 (America/Lima)

## Instalación

1. Haz copia de `public_html/maqueta/`.
2. Descomprime este paquete en `public_html/maqueta/`, reemplazando rutas.
3. Confirma que existe `public_html/maqueta/expedientes.php`.
4. Recarga con `Ctrl + F5`.

## Pruebas críticas

| ID | Acción | Resultado esperado |
|---|---|---|
| REC-01 | Abrir `/maqueta/expedientes.php` | La página existe y permite iniciar sesión normalmente. |
| REC-02 | Abrir Ver ficha de un expediente con cliente | Se muestra sección Pólizas con botón azul estilizado. |
| REC-03 | Pulsar Registrar póliza | La ficha cambia inmediatamente al formulario. No queda en silencio. |
| REC-04 | Pulsar Volver a ficha o Cancelar en póliza | Regresa a la misma ficha del expediente. |
| REC-05 | Guardar póliza sin título | Mensaje visible dentro del modal, debajo del encabezado. |
| REC-06 | Registrar póliza sin PDF | Crea póliza y muestra Falta PDF de póliza. |
| REC-07 | Poner fin igual/anterior al inicio | Bloquea y explica la vigencia inválida. |
| REC-08 | En Actualizar información modificar valores y pulsar Cancelar | Recupera datos guardados, no persiste los cambios no guardados. |
| REC-09 | Crear expediente y dejar campos requeridos vacíos | Mensaje visible dentro del modal. |
| REC-10 | Revisar select, input y textarea | Valores con peso normal; solo etiquetas/títulos semibold. |
| REC-11 | Adjuntar PDF | Muestra nombre antes de guardar y progreso al subir. |
| REC-12 | Reemplazar PDF | El nuevo queda asociado; el anterior se elimina físicamente. |
