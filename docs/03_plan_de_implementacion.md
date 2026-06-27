# Plan incremental de implementación

## Estado actual

- [x] Maqueta visual inicial.
- [x] Login demo por DNI, CE y RUC.
- [x] Contexto de sesión centralizado.
- [x] Dashboard con datos demo por perfil.
- [x] Matriz inicial de permisos y rutas controladas por servidor.
- [x] Catálogos demo básicos.
- [x] Notificaciones globales y mensajes amigables.
- [x] Migraciones compartidas de caché local.
- [x] Fechas JavaScript alineadas a America/Lima.
- [x] Expediente flexible sin flujo obligatorio.
- [x] Contacto de gestión separado de usuario interno.
- [x] Cliente opcional al inicio del expediente.
- [ ] Validación visual completa pendiente en navegador real.
- [ ] Módulos reales con MySQL.

## Siguiente bloque recomendado

### Fase 6: Empresas y Consorcios — base flexible

Alcance:

- registrar empresas con datos parciales;
- registrar consorcios con dos o más empresas;
- soportar consorcio con RUC propio;
- soportar consorcio con operador tributario;
- permitir contactos vinculados a una o varias entidades;
- reemplazar gradualmente los datos demo de cliente por registros administrables;
- no implementar todavía pólizas ni requisitos obligatorios.

## Fases posteriores

1. Catálogo completo de tipos de seguro y aseguradoras.
2. Cotizaciones flexibles y vencimiento por fecha límite.
3. Registro básico de pólizas con datos opcionales y cliente obligatorio.
4. Timeline y gestión documental.
5. Requisitos y formatos reutilizables.
6. Pagos, vouchers, garantías y siniestros.
7. Constructor de ítems configurables.
8. Vista cliente por RUC.
9. OCR/PDF y QR.

## Regla de avance

No iniciar una fase mientras la anterior tenga fallas funcionales críticas. No agregar campos específicos de seguros a la raíz del expediente.
