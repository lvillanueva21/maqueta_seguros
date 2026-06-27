<?php
declare(strict_types=1);

/**
 * Datos demo del módulo Expedientes.
 *
 * Un expediente es un contenedor de trabajo para una necesidad del cliente.
 * Puede existir sin cotización, seguro, póliza, pago o documento.
 *
 * Las cotizaciones se agregarán después como entidades opcionales y múltiples
 * mediante plantillas configurables. Por eso el expediente solo almacena
 * inicialmente `quotes` como una lista vacía o con cotizaciones vinculadas.
 */
return [
    'clients' => [
        [
            'id' => 'cli-001',
            'name' => 'Constructora Norte S.A.C.',
            'document_type' => 'RUC',
            'document' => '20123456789',
            'entity_type' => 'Empresa',
        ],
        [
            'id' => 'cli-002',
            'name' => 'Ingeniería Andina S.A.C.',
            'document_type' => 'RUC',
            'document' => '20456789123',
            'entity_type' => 'Empresa',
        ],
        [
            'id' => 'cli-003',
            'name' => 'Consorcio Vías del Norte',
            'document_type' => 'RUC',
            'document' => '20698765432',
            'entity_type' => 'Consorcio',
        ],
        [
            'id' => 'cli-004',
            'name' => 'Transportes El Sol S.A.C.',
            'document_type' => 'RUC',
            'document' => '20511843721',
            'entity_type' => 'Empresa',
        ],
        [
            'id' => 'cli-005',
            'name' => 'Comercial Valle Norte E.I.R.L.',
            'document_type' => 'RUC',
            'document' => '20601856342',
            'entity_type' => 'Empresa',
        ],
    ],
    'executives' => [
        [
            'user_id' => '2',
            'name' => 'María Torres',
            'label' => 'Ejecutiva de seguros',
            'active' => true,
        ],
        [
            'user_id' => 'exec-003',
            'name' => 'Jorge Ramírez',
            'label' => 'Ejecutivo de seguros',
            'active' => true,
        ],
        [
            'user_id' => 'exec-004',
            'name' => 'Ana Pérez',
            'label' => 'Ejecutiva de seguros',
            'active' => true,
        ],
    ],
    'items' => [
        [
            'id' => 'exp-demo-001',
            'code' => 'EXP-2026-0001',
            'client_id' => 'cli-001',
            'client_name' => 'Constructora Norte S.A.C.',
            'client_document' => 'RUC 20123456789',
            'entity_type' => 'Empresa',
            'title' => 'Solicitud inicial para proyecto vial',
            'state' => 'En seguimiento',
            'responsible_user_id' => '2',
            'responsible_name' => 'María Torres',
            'opened_at' => '2026-06-23',
            'updated_at' => '2026-06-27 09:30:00',
            'description' => 'El cliente solicitó evaluar alternativas de protección para una obra vial. Aún no se ha registrado ninguna cotización.',
            'quotes' => [],
        ],
        [
            'id' => 'exp-demo-002',
            'code' => 'EXP-2026-0002',
            'client_id' => 'cli-002',
            'client_name' => 'Ingeniería Andina S.A.C.',
            'client_document' => 'RUC 20456789123',
            'entity_type' => 'Empresa',
            'title' => 'Consulta sobre cobertura de equipos',
            'state' => 'En espera',
            'responsible_user_id' => '2',
            'responsible_name' => 'María Torres',
            'opened_at' => '2026-06-25',
            'updated_at' => '2026-06-27 10:15:00',
            'description' => 'Caso abierto para centralizar la consulta del cliente. Se espera información adicional; todavía no tiene cotizaciones ni seguros vinculados.',
            'quotes' => [],
        ],
        [
            'id' => 'exp-demo-003',
            'code' => 'EXP-2026-0003',
            'client_id' => 'cli-003',
            'client_name' => 'Consorcio Vías del Norte',
            'client_document' => 'RUC 20698765432',
            'entity_type' => 'Consorcio',
            'title' => 'Revisión general de necesidades del consorcio',
            'state' => 'Abierto',
            'responsible_user_id' => 'exec-003',
            'responsible_name' => 'Jorge Ramírez',
            'opened_at' => '2026-06-20',
            'updated_at' => '2026-06-26 16:40:00',
            'description' => 'Expediente creado para registrar la conversación inicial y definir posteriormente si corresponde cotizar uno o varios seguros.',
            'quotes' => [],
        ],
        [
            'id' => 'exp-demo-004',
            'code' => 'EXP-2026-0004',
            'client_id' => 'cli-004',
            'client_name' => 'Transportes El Sol S.A.C.',
            'client_document' => 'RUC 20511843721',
            'entity_type' => 'Empresa',
            'title' => 'Actualización de información de flota',
            'state' => 'Abierto',
            'responsible_user_id' => 'exec-004',
            'responsible_name' => 'Ana Pérez',
            'opened_at' => '2026-06-27',
            'updated_at' => '2026-06-27 08:20:00',
            'description' => 'Registro inicial de una necesidad del cliente. No se ha definido aún qué cotización, seguro o trámite podría corresponder.',
            'quotes' => [],
        ],
        [
            'id' => 'exp-demo-005',
            'code' => 'EXP-2026-0005',
            'client_id' => 'cli-005',
            'client_name' => 'Comercial Valle Norte E.I.R.L.',
            'client_document' => 'RUC 20601856342',
            'entity_type' => 'Empresa',
            'title' => 'Consulta cerrada sin contratación',
            'state' => 'Cerrado',
            'responsible_user_id' => '2',
            'responsible_name' => 'María Torres',
            'opened_at' => '2026-06-11',
            'updated_at' => '2026-06-24 14:05:00',
            'description' => 'La consulta fue atendida y cerrada sin requerir una cotización, seguro, póliza ni pago.',
            'quotes' => [],
        ],
    ],
];
