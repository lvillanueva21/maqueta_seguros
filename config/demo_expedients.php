<?php
declare(strict_types=1);

$clientDefaults = require __DIR__ . '/demo_clients.php';

return [
    'entity_defaults' => is_array($clientDefaults) ? $clientDefaults : [],
    'items' => [
        ['id'=>'exp-demo-001','code'=>'EXP-2026-0001','contact_id'=>'contact-001','contact_name'=>'Carla Valladares','contact_mobile'=>'949 510 201','client_id'=>'company-001','client_name'=>'Constructora Norte S.A.C.','client_document'=>'RUC 20512345671','entity_type'=>'Empresa','title'=>'Protección para proyecto vial','state'=>'En seguimiento','opened_at'=>'2026-06-23','updated_at'=>'2026-06-27 09:30:00','description'=>'Carla solicitó evaluar alternativas de protección para una obra vial. Aún no se ha registrado ninguna cotización.','quotes'=>[]],
        ['id'=>'exp-demo-002','code'=>'EXP-2026-0002','contact_id'=>'contact-002','contact_name'=>'Renato Quispe','contact_mobile'=>'949 510 202','client_id'=>'company-002','client_name'=>'Ingeniería Andina S.A.C.','client_document'=>'RUC 20456789120','entity_type'=>'Empresa','title'=>'Consulta sobre cobertura de equipos','state'=>'En espera','opened_at'=>'2026-06-25','updated_at'=>'2026-06-27 10:15:00','description'=>'El contacto requiere revisar información disponible antes de definir el producto final.','quotes'=>[]],
        ['id'=>'exp-demo-003','code'=>'EXP-2026-0003','contact_id'=>'contact-003','contact_name'=>'Mariela Castañeda','contact_mobile'=>'949 510 203','client_id'=>'consortium-001','client_name'=>'Consorcio Vías del Norte','client_document'=>'RUC 20698765438','entity_type'=>'Consorcio con RUC propio','title'=>'Proceso asegurador de consorcio','state'=>'Abierto','opened_at'=>'2026-06-26','updated_at'=>'2026-06-27 11:20:00','description'=>'Se abrió el expediente para centralizar la información inicial del consorcio y su contacto de gestión.','quotes'=>[]],
        ['id'=>'exp-demo-004','code'=>'EXP-2026-0004','contact_id'=>'contact-004','contact_name'=>'Diego Fernández','contact_mobile'=>'949 510 204','client_id'=>'','client_name'=>'','client_document'=>'','entity_type'=>'','title'=>'Consulta inicial sin entidad definida','state'=>'En seguimiento','opened_at'=>'2026-06-26','updated_at'=>'2026-06-27 12:05:00','description'=>'El solicitante desea recibir orientación inicial. La empresa o consorcio todavía está pendiente de definir.','quotes'=>[]],
        ['id'=>'exp-demo-005','code'=>'EXP-2026-0005','contact_id'=>'contact-005','contact_name'=>'Lucía Paredes','contact_mobile'=>'949 510 205','client_id'=>'company-004','client_name'=>'Comercial Valle Norte E.I.R.L.','client_document'=>'RUC 20601856345','entity_type'=>'Empresa','title'=>'Renovación de proceso comercial','state'=>'Cerrado','opened_at'=>'2026-06-20','updated_at'=>'2026-06-27 08:40:00','description'=>'Expediente cerrado sin contratación. Se conserva como antecedente del proceso comercial.','quotes'=>[]],
    ],
];
