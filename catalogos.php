<?php
declare(strict_types=1);

require __DIR__ . '/config/bootstrap.php';

$context = requireModuleAccess('catalogos');
$user = $context['user'];
$module = $context['module'];
$menu = modulesForRole((string) $user['role']);
$activeModule = 'catalogos';
$pageTitle = 'Catálogos';

$catalogs = require __DIR__ . '/config/demo_catalogs.php';
$catalogs = is_array($catalogs) ? $catalogs : [];
$canManageCatalogs = (string) $user['role'] === 'gerente';

$catalogsJson = json_encode(
    $catalogs,
    JSON_UNESCAPED_UNICODE
    | JSON_UNESCAPED_SLASHES
    | JSON_HEX_TAG
    | JSON_HEX_AMP
    | JSON_HEX_APOS
    | JSON_HEX_QUOT
);

if ($catalogsJson === false) {
    $catalogsJson = '{}';
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
    <link rel="stylesheet" href="assets/css/catalogos.css">
</head>
<body
    class="app-body"
    data-role="<?= e((string) $user['role']) ?>"
    data-user="<?= e((string) $user['id']) ?>"
    data-catalog-manager="<?= $canManageCatalogs ? '1' : '0' ?>"
>
<div class="app-shell">
    <?php require __DIR__ . '/views/partials/sidebar.php'; ?>

    <div class="sidebar-overlay" id="sidebar-overlay"></div>

    <main class="workspace">
        <?php require __DIR__ . '/views/partials/topbar.php'; ?>

        <section class="workspace-content">
            <article class="module-hero catalogs-hero">
                <div class="module-hero-icon" aria-hidden="true"><?= e((string) ($module['icon'] ?? '▤')) ?></div>
                <div>
                    <p class="eyebrow">CONFIGURACIÓN OPERATIVA</p>
                    <h2>Catálogos demo</h2>
                    <p>Valida los datos maestros que utilizarán los próximos módulos antes de definir tablas en MySQL.</p>
                </div>
                <span class="module-access-badge"><?= $canManageCatalogs ? 'Edición demo habilitada' : 'Consulta habilitada' ?></span>
            </article>

            <section class="catalogs-layout" id="catalogs-app" aria-label="Catálogos de BROKER SEGUROS">
                <aside class="catalog-groups-panel">
                    <div class="catalog-groups-heading">
                        <div>
                            <p class="eyebrow">GRUPOS DISPONIBLES</p>
                            <h2>Datos maestros</h2>
                        </div>
                        <span id="catalog-count" class="catalog-count">0</span>
                    </div>
                    <div id="catalog-groups" class="catalog-groups" role="tablist" aria-label="Grupos de catálogos"></div>
                </aside>

                <section class="catalog-content-panel">
                    <div class="catalog-content-heading">
                        <div>
                            <p id="catalog-current-eyebrow" class="eyebrow">CATÁLOGO</p>
                            <h2 id="catalog-current-title">Cargando catálogo</h2>
                            <p id="catalog-current-description">Cargando información demo.</p>
                        </div>
                        <div class="catalog-actions">
                            <?php if ($canManageCatalogs): ?>
                                <button id="restore-catalogs" class="catalog-secondary-button" type="button">Restaurar demo</button>
                                <button id="add-catalog-item" class="catalog-primary-button" type="button">+ Agregar elemento</button>
                            <?php endif; ?>
                        </div>
                    </div>

                    <?php if ($canManageCatalogs): ?>
                        <div class="catalog-notice catalog-notice-manager">
                            <strong>Modo gerente:</strong> puedes agregar, editar, activar o desactivar elementos. Los cambios se guardan solamente en este navegador mediante caché local.
                        </div>
                    <?php else: ?>
                        <div class="catalog-notice">
                            <strong>Modo consulta:</strong> puedes revisar los catálogos disponibles, pero no modificar sus elementos.
                        </div>
                    <?php endif; ?>

                    <div class="catalog-table-wrap">
                        <table class="catalog-table">
                            <thead>
                            <tr>
                                <th scope="col">Código</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Detalle</th>
                                <th scope="col">Estado</th>
                                <?php if ($canManageCatalogs): ?>
                                    <th scope="col" class="catalog-actions-column">Acciones</th>
                                <?php endif; ?>
                            </tr>
                            </thead>
                            <tbody id="catalog-table-body">
                            <tr>
                                <td colspan="<?= $canManageCatalogs ? '5' : '4' ?>">Cargando elementos…</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <p id="catalog-empty" class="catalog-empty" hidden>No hay elementos registrados en este catálogo.</p>
                </section>
            </section>
        </section>
    </main>
</div>

<?php if ($canManageCatalogs): ?>
    <dialog id="catalog-item-dialog" class="catalog-dialog" aria-labelledby="catalog-dialog-title">
        <form id="catalog-item-form" method="dialog">
            <div class="catalog-dialog-heading">
                <div>
                    <p class="eyebrow">EDICIÓN TEMPORAL</p>
                    <h2 id="catalog-dialog-title">Agregar elemento</h2>
                </div>
                <button id="catalog-dialog-close" class="catalog-dialog-close" type="button" aria-label="Cerrar">×</button>
            </div>

            <input id="catalog-item-id" name="id" type="hidden">

            <label for="catalog-item-code">Código</label>
            <input id="catalog-item-code" name="code" maxlength="20" placeholder="Ejemplo: ASE-006" required>

            <label for="catalog-item-name">Nombre</label>
            <input id="catalog-item-name" name="name" maxlength="100" placeholder="Nombre del elemento" required>

            <label for="catalog-item-detail">Detalle</label>
            <textarea id="catalog-item-detail" name="detail" rows="3" maxlength="180" placeholder="Descripción o referencia breve"></textarea>

            <label for="catalog-item-status">Estado</label>
            <select id="catalog-item-status" name="status">
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
            </select>

            <div class="catalog-dialog-actions">
                <button id="catalog-dialog-cancel" class="catalog-secondary-button" type="button">Cancelar</button>
                <button class="catalog-primary-button" type="submit">Guardar cambio demo</button>
            </div>
        </form>
    </dialog>
<?php endif; ?>

<script id="catalog-default-data" type="application/json"><?= $catalogsJson ?></script>
<script src="assets/js/app.js"></script>
<script src="assets/js/catalogos.js"></script>
</body>
</html>
