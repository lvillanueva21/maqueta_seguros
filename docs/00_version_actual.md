# Versión actual entregada

- **Código de versión:** `BS-20260627-173744-PET`
- **Fecha y hora de entrega:** 27/06/2026 17:37:44 (America/Lima)
- **Zona horaria:** Perú - America/Lima
- **Bloque funcional:** Clientes v1: Empresas, Consorcios y Contactos de gestión integrados a Expedientes.
- **Estado de esta versión:** Paquete preparado localmente. Debe integrarse, probarse y subirse manualmente a GitHub `main`. Hostinger se verifica por separado.

## Base remota revisada antes de generar esta versión

- Repositorio: `lvillanueva21/maqueta_seguros`
- Rama: `main`
- Versión remota encontrada: `BS-20260627-164101-PET`
- Base funcional: Contactos de gestión + Expedientes v3.

## Incluye

1. Módulo `Clientes` con pestañas Empresas, Consorcios y Contactos de gestión.
2. Empresas con razón social o RUC, validación de RUC completo y unicidad global.
3. Consorcios con RUC propio o operador tributario, mínimo dos participantes.
4. Contactos con relaciones múltiples, etiqueta por vínculo y contacto principal.
5. Modal rojo con motivo obligatorio para desactivar empresa, consorcio, contacto o participación.
6. Integración dinámica de empresas/consorcios en Expedientes.
7. Migración local de entidades demo y actualización de referencias antiguas `cli-*`.

## Limitaciones conocidas

- Los registros son locales al navegador; no se comparten entre equipos ni perfiles de navegador.
- Usuarios cliente por RUC, pólizas, cotizaciones, documentos, pagos y timeline no forman parte de este bloque.
- Las validaciones de RUC son de formato y dígito verificador; no consultan SUNAT.
