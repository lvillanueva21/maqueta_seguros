<?php
declare(strict_types=1);

require __DIR__ . '/config/bootstrap.php';

$context = requireModuleAccess('expedientes');
$user = $context['user'];
$module = $context['module'];
$menu = modulesForRole((string) $user['role']);
$activeModule = 'expedientes';
$pageTitle = 'Expedientes';
$canViewAllExpedients = (string) $user['role'] === 'gerente';

$expedientData = require __DIR__ . '/config/demo_expedients.php';
$catalogData = require __DIR__ . '/config/demo_catalogs.php';

$expedientData = is_array($expedientData) ? $expedientData : [];
$catalogData = is_array($catalogData) ? $catalogData : [];

$clientDataJson = json_encode(
    $expedientData,
    JSON_UNESCAPED_UNICODE
    | JSON_UNESCAPED_SLASHES
    | JSON_HEX_TAG
    | JSON_HEX_AMP
    | JSON_HEX_APOS
    | JSON_HEX_QUOT
);

$catalogDataJson = json_encode(
    $catalogData,
    JSON_UNESCAPED_UNICODE
    | JSON_UNESCAPED_SLASHES
    | JSON_HEX_TAG
    | JSON_HEX_AMP
    | JSON_HEX_APOS
    | JSON_HEX_QUOT
);

if ($clientDataJson === false) {
    $clientDataJson = '{}';
}

if ($catalogDataJson === false) {
    $catalogDataJson = '{}';
}
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e(APP_NAME) ?> | <?= e($pageTitle) ?></title>
    <link rel="stylesheet" href="assets/css/app.css">
    <link rel="stylesheet" href="assets/css/modules.css">
    <link rel="stylesheet" href="assets/css/expedientes.css">
</head>
<body
    class="app-body"
    data-role="<?= e((string) $user['role']) ?>"
    data-user="<?= e((string) $user['id']) ?>"
    data-user-name="<?= e((string) $user['name']) ?>"
    data-view-all-expedients="<?= $canViewAllExpedients ? '1' : '0' ?>"
>
<div class="app-shell">
    <?php require __DIR__ . '/views/partials/sidebar.php'; ?>

    <div class="sidebar-overlay" id="sidebar-overlay"></div>

    <main class="workspace">
        <?php require __DIR__ . '/views/partials/topbar.php'; ?>

        <section class="workspace-content">
            <article class="module-hero expedients-hero">
                <div class="module-hero-icon" aria-hidden="true"><?= e((string) ($module['icon'] ?? '▧')) ?></div>
                <div>
                    <p class="eyebrow">NÚCLEO OPERATIVO</p>
                    <h2>Expedientes demo</h2>
                    <p>Registra y controla gestiones de cotización, emisión, renovación, endoso o regularización antes de crear pólizas y pagos.</p>
                </div>
                <span class="module-access-badge"><?= $canViewAllExpedients ? 'Vista global de gerencia' : 'Mis expedientes asignados' ?></span>
            </article>

            <section id="expedients-app" class="expedients-app">
                <div class="expedients-summary-grid">
                    <article class="expedient-summary-card">
                        <span class="expedient-summary-icon">▧</span>
                        <p>Expedientes visibles</p>
                        <strong id="summary-total">0</strong>
                        <small id="summary-total-note">Cargando registros</small>
                    </article>
                    <article class="expedient-summary-card summary-warning">
                        <span class="expedient-summary-icon">◷</span>
                        <p>Pendientes de documentos</p>
                        <strong id="summary-documents">0</strong>
                        <small>Requieren seguimiento</small>
                    </article>
                    <article class="expedient-summary-card summary-primary">
                        <span class="expedient-summary-icon">↻</span>
                        <p>Renovaciones activas</p>
                        <strong id="summary-renewals">0</strong>
                        <small>En gestión o borrador</small>
                    </article>
                    <article class="expedient-summary-card summary-success">
                        <span class="expedient-summary-icon">✓</span>
                        <p>Gestiones cerradas</p>
                        <strong id="summary-closed">0</strong>
                        <small>Resultados finalizados</small>
                    </article>
                </div>

                <section class="expedients-panel">
                    <div class="expedients-panel-heading">
                        <div>
                            <p class="eyebrow">CONTROL DE GESTIONES</p>
                            <h2>Listado de expedientes</h2>
                            <p id="expedients-context-text">Cargando expedientes disponibles para tu perfil.</p>
                        </div>
                        <button id="add-expedient" class="expedient-primary-button" type="button">+ Crear expediente</button>
                    </div>

                    <div class="expedient-filters" aria-label="Filtros de expedientes">
                        <label class="filter-search">
                            <span>Buscar</span>
                            <input id="filter-search" type="search" placeholder="Código, cliente o descripción">
                        </label>

                        <label>
                            <span>Estado</span>
                            <select id="filter-state">
                                <option value="">Todos</option>
                            </select>
                        </label>

                        <label>
                            <span>Tipo de seguro</span>
                            <select id="filter-insurance">
                                <option value="">Todos</option>
                            </select>
                        </label>

                        <label>
                            <span>Aseguradora</span>
                            <select id="filter-insurer">
                                <option value="">Todas</option>
                            </select>
                        </label>

                        <?php if ($canViewAllExpedients): ?>
                            <label>
                                <span>Responsable</span>
                                <select id="filter-responsible">
                                    <option value="">Todos</option>
                                </select>
                            </label>
                        <?php endif; ?>

                        <button id="clear-expedient-filters" class="expedient-secondary-button" type="button">Limpiar filtros</button>
                    </div>

                    <div class="expedient-table-wrap">
                        <table class="expedient-table">
                            <thead>
                            <tr>
                                <th scope="col">Código</th>
                                <th scope="col">Cliente</th>
                                <th scope="col">Gestión</th>
                                <th scope="col">Seguro / Aseguradora</th>
                                <th scope="col">Responsable</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Actualización</th>
                                <th scope="col">Acción</th>
                            </tr>
                            </thead>
                            <tbody id="expedient-table-body">
                            <tr>
                                <td colspan="8">Cargando expedientes…</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <p id="expedient-empty" class="expedient-empty" hidden>No existen expedientes que coincidan con los filtros seleccionados.</p>
                </section>
            </section>
        </section>
    </main>
</div>

<dialog id="expedient-form-dialog" class="expedient-dialog" aria-labelledby="expedient-form-title">
    <form id="expedient-form" method="dialog">
        <div class="expedient-dialog-heading">
            <div>
                <p class="eyebrow">NUEVA GESTIÓN</p>
                <h2 id="expedient-form-title">Crear expediente</h2>
            </div>
            <button id="expedient-form-close" class="expedient-dialog-close" type="button" aria-label="Cerrar">×</button>
        </div>

        <div class="expedient-form-grid">
            <label>
                <span>Cliente o entidad</span>
                <select id="expedient-client" required></select>
            </label>

            <label>
                <span>Tipo de gestión</span>
                <select id="expedient-management-type" required></select>
            </label>

            <label>
                <span>Tipo de seguro</span>
                <select id="expedient-insurance-type" required></select>
            </label>

            <label>
                <span>Aseguradora</span>
                <select id="expedient-insurer" required></select>
            </label>

            <label>
                <span>Moneda</span>
                <select id="expedient-currency" required></select>
            </label>

            <label>
                <span>Estado inicial</span>
                <select id="expedient-state" required></select>
            </label>

            <?php if ($canViewAllExpedients): ?>
                <label>
                    <span>Ejecutivo responsable</span>
                    <select id="expedient-responsible" required></select>
                </label>
            <?php else: ?>
                <input id="expedient-responsible" type="hidden" value="<?= e((string) $user['id']) ?>">
            <?php endif; ?>
        </div>

        <label class="expedient-description-field">
            <span>Descripción inicial</span>
            <textarea id="expedient-description" rows="4" maxlength="800" placeholder="Describe la necesidad del cliente, antecedentes o siguiente acción." required></textarea>
        </label>

        <p class="expedient-code-note">El código se generará automáticamente al guardar. Ejemplo: EXP-2026-0006.</p>

        <div class="expedient-dialog-actions">
            <button id="expedient-form-cancel" class="expedient-secondary-button" type="button">Cancelar</button>
            <button class="expedient-primary-button" type="submit">Crear expediente demo</button>
        </div>
    </form>
</dialog>

<dialog id="expedient-detail-dialog" class="expedient-dialog expedient-detail-dialog" aria-labelledby="expedient-detail-title">
    <div class="expedient-dialog-content">
        <div class="expedient-dialog-heading">
            <div>
                <p class="eyebrow">FICHA DE EXPEDIENTE</p>
                <h2 id="expedient-detail-title">Expediente</h2>
            </div>
            <button id="expedient-detail-close" class="expedient-dialog-close" type="button" aria-label="Cerrar">×</button>
        </div>

        <div id="expedient-detail-content"></div>
    </div>
</dialog>

<script id="expedient-default-data" type="application/json"><?= $clientDataJson ?></script>
<script id="expedient-catalog-data" type="application/json"><?= $catalogDataJson ?></script>
<script src="assets/js/app.js"></script>
<script src="assets/js/expedientes.js"></script>
</body>
</html>
