<?php
declare(strict_types=1);

require __DIR__ . '/config/bootstrap.php';

$user = requireAuth();
$menu = menuForRole($user['role']);
$initials = implode('', array_map(static fn (string $part): string => strtoupper(firstChar($part)), array_slice(preg_split('/\s+/', $user['name']) ?: [], 0, 2)));
$today = (new DateTimeImmutable('now', new DateTimeZone('America/Lima')))->format('d/m/Y · H:i');
$sessionStartedAt = formatSessionStartedAt($user['session_started_at'] ?? null);
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LIVP Seguros | <?= e($user['role_label']) ?></title>
    <link rel="stylesheet" href="assets/css/app.css">
</head>
<body class="app-body" data-role="<?= e($user['role']) ?>" data-user="<?= e((string) $user['id']) ?>">
<div class="app-shell">
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-top">
            <a class="sidebar-brand" href="dashboard.php" aria-label="LIVP Seguros, Inicio">
                <span class="brand-mini">L</span>
                <span>LIVP <b>Seguros</b></span>
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
            <?php foreach ($menu as $index => $item): ?>
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
                <p class="topbar-system">LIVP SEGUROS</p>
                <h1 id="page-title">Inicio</h1>
            </div>
            <div class="topbar-right">
                <span class="live-dot"></span>
                <span>Sesión activa</span>
            </div>
        </header>

        <section class="workspace-content" id="workspace-content">
            <div id="home-view" class="page-view">
                <div class="welcome-banner">
                    <div>
                        <p class="eyebrow">PANEL DE <?= e(strtoupper($user['role_label'])) ?></p>
                        <h2>Bienvenido, <?= e($user['name']) ?></h2>
                        <p>Esta pantalla resume los datos principales del perfil que ingresó al sistema.</p>
                    </div>
                    <div class="welcome-date">
                        <span>Hora Perú</span>
                        <strong><?= e($today) ?></strong>
                    </div>
                </div>

                <div class="stats-grid">
                    <article class="info-card">
                        <span class="card-icon">◉</span>
                        <p>Tipo de perfil</p>
                        <h3><?= e($user['profile_title']) ?></h3>
                    </article>
                    <article class="info-card">
                        <span class="card-icon">#</span>
                        <p>Documento de acceso</p>
                        <h3><?= e($user['document_type']) ?> <?= e($user['document']) ?></h3>
                    </article>
                    <article class="info-card">
                        <span class="card-icon">▣</span>
                        <p>Entidad relacionada</p>
                        <h3><?= e($user['entity_name']) ?></h3>
                    </article>
                    <article class="info-card">
                        <span class="card-icon">✓</span>
                        <p>Ámbito de acceso</p>
                        <h3><?= e($user['scope']) ?></h3>
                    </article>
                </div>

                <div class="details-layout">
                    <section class="detail-card">
                        <div class="section-heading">
                            <div>
                                <p class="eyebrow">DATOS DEL PERFIL</p>
                                <h2>Información registrada</h2>
                            </div>
                        </div>
                        <dl class="details-list">
                            <div><dt>Rol</dt><dd><?= e($user['role_label']) ?></dd></div>
                            <div><dt>Tipo de cuenta</dt><dd><?= e((string) ($user['account_type_label'] ?? 'No registrado')) ?></dd></div>
                            <div><dt>Tipo de entidad</dt><dd><?= e($user['entity_type']) ?></dd></div>
                            <div><dt>Correo de referencia</dt><dd><?= e($user['contact_email']) ?></dd></div>
                            <div><dt>Teléfono de referencia</dt><dd><?= e($user['contact_phone']) ?></dd></div>
                            <div><dt>Sesión iniciada</dt><dd><?= e($sessionStartedAt) ?></dd></div>
                        </dl>
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
                    </section>
                </div>

                <?php if (!empty($user['consortium_members'])): ?>
                    <section class="detail-card consortium-card">
                        <div class="section-heading">
                            <div>
                                <p class="eyebrow">CONSORCIO</p>
                                <h2>Empresas participantes</h2>
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
