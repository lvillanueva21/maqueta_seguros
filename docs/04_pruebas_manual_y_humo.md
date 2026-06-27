# Pruebas manuales y de humo

## Ambiente publicado

Ruta esperada cuando se instala en Hostinger:

```text
https://cicsount.pe/maqueta/
```

## Control de versión

| ID | Prueba | Resultado esperado |
|---|---|---|
| VER-01 | Abrir `docs/00_version_actual.md` en GitHub luego del push | Debe aparecer el código de versión de la última entrega aplicada. |
| VER-02 | Comparar el código de versión con el ZIP recibido | Ambos deben coincidir exactamente. |

## Casos de Expedientes demo

| ID | Prueba | Resultado esperado |
|---|---|---|
| EXP-01 | Ingresar como gerente y abrir Expedientes | Ve todos los expedientes demo y el filtro de responsable. |
| EXP-02 | Ingresar como ejecutivo y abrir Expedientes | Ve únicamente expedientes asignados a María Torres. |
| EXP-03 | Como gerente, crear expediente y elegir responsable | Se genera un código `EXP-AAAA-NNNN`, aparece en el listado y respeta el responsable elegido. |
| EXP-04 | Como ejecutivo, crear expediente | El responsable se asigna automáticamente al ejecutivo autenticado. |
| EXP-05 | Crear expediente con campos obligatorios vacíos | El formulario no debe guardar y debe solicitar completar la información requerida. |
| EXP-06 | Filtrar por estado, tipo de seguro, aseguradora y texto | El listado debe mostrar solo expedientes coincidentes. |
| EXP-07 | Abrir ficha de expediente | Deben mostrarse cliente, seguro, aseguradora, moneda, responsable, fechas y descripción. |
| EXP-08 | Cambiar estado desde la ficha | El estado y fecha de actualización deben cambiar en el listado y persistir al recargar. |
| EXP-09 | Como ejecutivo, abrir la ficha de un expediente no asignado mediante manipulación de URL | No existe URL de ficha directa; la pantalla no debe listar ni permitir abrir expedientes ajenos. |
| EXP-10 | Como empresa o consorcio, abrir `expedientes.php` | Debe mostrarse Acceso no autorizado. |
| EXP-11 | Abrir `expedientes.php` sin sesión | Debe redirigir al login. |
| EXP-12 | Probar en móvil | Filtros deben acomodarse y la tabla debe permitir desplazamiento horizontal. |
| EXP-13 | Volver a Inicio luego de crear o cambiar estado | Acciones en caché debe registrar la acción temporal. |

## Casos de Catálogos demo

| ID | Prueba | Resultado esperado |
|---|---|---|
| CAT-01 | Ingresar como gerente y abrir Catálogos | Se muestran los siete grupos de datos maestros. |
| CAT-02 | Como ejecutivo, abrir Catálogos | Puede consultar sin botones de edición. |
| CAT-03 | Como cliente, abrir `catalogos.php` | Se muestra Acceso no autorizado. |

## Evidencia mínima

Por cada bloque implementado, registrar:

- fecha;
- perfil probado;
- URL;
- resultado;
- error encontrado, si aplica;
- captura cuando corresponda.
