<?php
declare(strict_types=1);

require __DIR__ . '/config/bootstrap.php';

$user = requireAuth();
$menu = menuForRole($user['role']);
$dashboardDataSource = require __DIR__ . '/config/demo_dashboard_data.php';
$dashboard = $dashboardDataSource[(string) $user['id']] ?? $dashboardDataSource['default'];

$initials = implode('', array_map(
    static fn (string $part): string => strtoupper(firstChar($part)),
    array_slice(preg_split('/\s+/', $user['name']) ?: [], 0, 2)
));
$today = (new DateTimeImmutable('now', new DateTimeZone('America/Lima')))->format('d/m/Y · H:i');
$sessionStartedAt = formatSessionStartedAt($user['session_started_at'] ?? null);

$metrics = is_array($dashboard['metrics'] ?? null) ? $dashboard['metrics'] : [];
$alerts = is_array($dashboard['alerts'] ?? null) ? $dashboard['alerts'] : [];
$primaryTable = is_array($dashboard['primary_table'] ?? null) ? $dashboard['primary_table'] : [];
$secondaryTable = is_array($dashboard['secondary_table'] ?? null) ? $dashboard['secondary_table'] : [];
$companySummary = is_array($dashboard['company_summary'] ?? null) ? $dashboard['company_summary'] : [];
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e(APP_NAME) ?> | <?= e($user['role_label']) ?></title>
    <link rel="stylesheet" href="assets/css/app.css">
    <link rel="stylesheet" href="assets/css/dashboard.css">
</head>
<body class="app-body" data-role="<?= e($user['role']) ?>" data-user="<?= e((string) $user['id']) ?>">
<div class="app-shell">
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-top">
            <a class="sidebar-brand" href="dashboard.php" aria-label="<?= e(APP_NAME) ?>, Inicio">
                <span class="brand-mini">B</span>
                <span><?= e(APP_SHORT_NAME) ?> <b>SEGUROS</b></span>
            </a>
            <button class="sidebar-close" id="sidebar-close" type="button" aria-label="Cerrar menú">×</button>
        </div>

        <div class="profile-panel">
            <div class="profile-avatar" aria-hidden="true"><?= e($initials ?: 'U') ?></div>
            <div>
                <p class="profile-name"><?= e($user['name']) ?></p>
                <p class="profile-role"><?= e($user['profile_title']) ?></p>
            </div>
            <div class="profile-meta">
                <span class="role-badge role-<?= e($user['role']) ?>"><?= e($user['role_label']) ?></span>
                <span><?= e($user['document_type']) ?> <?= e($user['document']) ?></span>
            </div>
        </div>

        <nav class="main-nav" aria-label="Navegación principal">
            <?php foreach ($menu as $item): ?>
                <button
                    type="button"
                    class="nav-item <?= $item['id'] === 'inicio' ? 'is-active' : '' ?>"
                    data-section-id="<?= e($item['id']) ?>"
                    data-section-label="<?= e($item['label']) ?>"
                >
                    <span class="nav-icon" aria-hidden="true"><?= e($item['icon']) ?></span>
                    <span><?= e($item['label']) ?></span>
                </button>
            <?php endforeach; ?>
        </nav>

        <div class="sidebar-footer">
            <a href="logout.php" class="logout-link">Cerrar sesión <span>→</span></a>
            <small>Maqueta sin base de datos</small>
        </div>
    </aside>

    <div class="sidebar-overlay" id="sidebar-overlay"></div>

    <main class="workspace">
        <header class="topbar">
            <button id="menu-toggle" class="menu-toggle" type="button" aria-label="Abrir menú">☰</button>
            <div>
                <p class="topbar-system"><?= e(APP_NAME) ?></p>
                <h1 id="page-title">Inicio</h1>
            </div>
            <div class="topbar-actions">
                <div class="topbar-session">
                    <span class="live-dot" aria-hidden="true"></span>
                    <span>Sesión activa</span>
                </div>
                <a href="logout.php" class="topbar-logout" aria-label="Cerrar sesión" title="Cerrar sesión">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M14 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"></path>
                        <path d="M10 17l5-5-5-5"></path>
                        <path d="M15 12H3"></path>
                    </svg>
                    <span class="topbar-logout-label">Cerrar sesión</span>
                </a>
            </div>
        </header>

        <section class="workspace-content" id="workspace-content">
            <div id="home-view" class="page-view">
                <div class="welcome-banner">
                    <div>
                        <p class="eyebrow">PANEL DE <?= e(strtoupper($user['role_label'])) ?></p>
                        <h2>Bienvenido, <?= e($user['name']) ?></h2>
                        <p><?= e((string) ($dashboard['summary'] ?? 'Esta pantalla resume los datos principales del perfil que ingresó al sistema.')) ?></p>
                    </div>
                    <div class="welcome-date">
                        <span>Hora Perú</span>
                        <strong><?= e($today) ?></strong>
                    </div>
                </div>

                <div class="dashboard-metrics">
                    <?php foreach ($metrics as $metric): ?>
                        <?php
                        $metricTone = (string) ($metric['tone'] ?? 'primary');
                        $allowedTones = ['primary', 'warning', 'danger', 'success'];
                        $metricTone = in_array($metricTone, $allowedTones, true) ? $metricTone : 'primary';
                        ?>
                        <article class="dashboard-metric metric-<?= e($metricTone) ?>">
                            <div class="dashboard-metric-top">
                                <span class="dashboard-metric-icon" aria-hidden="true"><?= e((string) ($metric['icon'] ?? '•')) ?></span>
                                <span class="dashboard-metric-status" aria-hidden="true"></span>
                            </div>
                            <p><?= e((string) ($metric['label'] ?? 'Indicador')) ?></p>
                            <h3><?= e((string) ($metric['value'] ?? '—')) ?></h3>
                            <small><?= e((string) ($metric['note'] ?? '')) ?></small>
                        </article>
                    <?php endforeach; ?>
                </div>

                <div class="dashboard-main-grid">
                    <section class="dashboard-panel">
                        <div class="section-heading">
                            <div>
                                <p class="eyebrow">ATENCIÓN REQUERIDA</p>
                                <h2>Alertas principales</h2>
                            </div>
                        </div>

                        <?php if ($alerts !== []): ?>
                            <ul class="alert-list">
                                <?php foreach ($alerts as $alert): ?>
                                    <?php
                                    $alertLevel = (string) ($alert['level'] ?? 'primary');
                                    $allowedLevels = ['primary', 'warning', 'danger', 'success'];
                                    $alertLevel = in_array($alertLevel, $allowedLevels, true) ? $alertLevel : 'primary';
                                    ?>
                                    <li class="alert-item alert-<?= e($alertLevel) ?>">
                                        <p class="alert-item-title"><?= e((string) ($alert['title'] ?? 'Alerta registrada')) ?></p>
                                        <p class="alert-item-description"><?= e((string) ($alert['description'] ?? '')) ?></p>
                                        <span class="alert-item-meta"><?= e((string) ($alert['meta'] ?? '')) ?></span>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        <?php else: ?>
                            <p class="dashboard-empty">No hay alertas configuradas para este perfil.</p>
                        <?php endif; ?>
                    </section>

                    <section class="detail-card cache-card">
                        <div class="section-heading">
                            <div>
                                <p class="eyebrow">ESTADO TEMPORAL</p>
                                <h2>Acciones en caché</h2>
                            </div>
                            <span class="cache-status">Activo</span>
                        </div>
                        <p>Las acciones de navegación se mantienen durante esta sesión y también en el navegador, sin base de datos.</p>
                        <ul id="cache-list" class="cache-list"><li>Cargando acciones recientes…</li></ul>

                        <dl class="details-list">
                            <div><dt>Tipo de cuenta</dt><dd><?= e((string) ($user['account_type_label'] ?? 'No registrado')) ?></dd></div>
                            <div><dt>Sesión iniciada</dt><dd><?= e($sessionStartedAt) ?></dd></div>
                        </dl>
                    </section>
                </div>

                <section class="dashboard-panel">
                    <div class="section-heading">
                        <div>
                            <p class="eyebrow"><?= e((string) ($primaryTable['eyebrow'] ?? 'INFORMACIÓN')) ?></p>
                            <h2><?= e((string) ($primaryTable['title'] ?? 'Información principal')) ?></h2>
                        </div>
                    </div>
                    <p class="dashboard-panel-description"><?= e((string) ($primaryTable['description'] ?? '')) ?></p>

                    <?php if (!empty($primaryTable['columns']) && !empty($primaryTable['rows'])): ?>
                        <div class="dashboard-table-wrap">
                            <table class="dashboard-table">
                                <thead>
                                <tr>
                                    <?php foreach ($primaryTable['columns'] as $column): ?>
                                        <th scope="col"><?= e((string) $column) ?></th>
                                    <?php endforeach; ?>
                                </tr>
                                </thead>
                                <tbody>
                                <?php foreach ($primaryTable['rows'] as $row): ?>
                                    <tr>
                                        <?php foreach ($row as $cell): ?>
                                            <td><?= e((string) $cell) ?></td>
                                        <?php endforeach; ?>
                                    </tr>
                                <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php else: ?>
                        <p class="dashboard-empty">No hay datos disponibles para esta sección.</p>
                    <?php endif; ?>
                </section>

                <?php if ($companySummary !== []): ?>
                    <section class="dashboard-panel">
                        <div class="section-heading">
                            <div>
                                <p class="eyebrow">EMPRESAS PARTICIPANTES</p>
                                <h2>Resumen por empresa</h2>
                            </div>
                        </div>
                        <div class="company-summary-grid">
                            <?php foreach ($companySummary as $company): ?>
                                <article class="company-summary-card">
                                    <h3><?= e((string) ($company['name'] ?? 'Empresa')) ?></h3>
                                    <p><?= e((string) ($company['ruc'] ?? '')) ?></p>
                                    <p><?= e((string) ($company['policies'] ?? '')) ?></p>
                                    <p class="company-summary-pending"><?= e((string) ($company['pending'] ?? '')) ?></p>
                                </article>
                            <?php endforeach; ?>
                        </div>
                    </section>
                <?php endif; ?>

                <section class="dashboard-panel">
                    <div class="section-heading">
                        <div>
                            <p class="eyebrow"><?= e((string) ($secondaryTable['eyebrow'] ?? 'SEGUIMIENTO')) ?></p>
                            <h2><?= e((string) ($secondaryTable['title'] ?? 'Información complementaria')) ?></h2>
                        </div>
                    </div>
                    <p class="dashboard-panel-description"><?= e((string) ($secondaryTable['description'] ?? '')) ?></p>

                    <?php if (!empty($secondaryTable['columns']) && !empty($secondaryTable['rows'])): ?>
                        <div class="dashboard-table-wrap">
                            <table class="dashboard-table">
                                <thead>
                                <tr>
                                    <?php foreach ($secondaryTable['columns'] as $column): ?>
                                        <th scope="col"><?= e((string) $column) ?></th>
                                    <?php endforeach; ?>
                                </tr>
                                </thead>
                                <tbody>
                                <?php foreach ($secondaryTable['rows'] as $row): ?>
                                    <tr>
                                        <?php foreach ($row as $cell): ?>
                                            <td><?= e((string) $cell) ?></td>
                                        <?php endforeach; ?>
                                    </tr>
                                <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php else: ?>
                        <p class="dashboard-empty">No hay datos disponibles para esta sección.</p>
                    <?php endif; ?>
                </section>

                <?php if (!empty($user['consortium_members'])): ?>
                    <section class="detail-card consortium-card">
                        <div class="section-heading">
                            <div>
                                <p class="eyebrow">CONSORCIO</p>
                                <h2>Empresas participantes registradas</h2>
                            </div>
                        </div>
                        <ul class="member-list">
                            <?php foreach ($user['consortium_members'] as $member): ?>
                                <li><?= e($member) ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </section>
                <?php endif; ?>
            </div>

            <div id="construction-view" class="page-view construction-view" hidden>
                <div class="construction-mark">⌁</div>
                <p class="eyebrow">MÓDULO EN PREPARACIÓN</p>
                <h2 id="construction-title">Módulo</h2>
                <p id="construction-text">En construcción.</p>
                <span class="construction-note">La navegación y la acción se guardaron temporalmente en caché.</span>
            </div>
        </section>
    </main>
</div>
<script src="assets/js/app.js"></script>
</body>
</html>
