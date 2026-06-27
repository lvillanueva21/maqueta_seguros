<?php
declare(strict_types=1);

date_default_timezone_set('America/Lima');

/**
 * Devuelve el nombre del archivo actual relativo a la raíz del proyecto.
 * Ejemplos: "dashboard.php" o "api/cache_actions.php".
 */
function currentProjectRelativeScript(): string
{
    $projectRoot = realpath(__DIR__ . '/..') ?: dirname(__DIR__);
    $scriptFile = realpath((string) ($_SERVER['SCRIPT_FILENAME'] ?? ''));

    if ($scriptFile !== false && str_starts_with($scriptFile, $projectRoot)) {
        return ltrim(str_replace('\\', '/', substr($scriptFile, strlen($projectRoot))), '/');
    }

    return basename((string) ($_SERVER['SCRIPT_NAME'] ?? 'index.php'));
}

/**
 * Construye una ruta URL relativa hacia la raíz del proyecto sin depender
 * del dominio, subdominio ni del nombre de la carpeta donde fue publicado.
 */
function appRelativeUrl(string $target = ''): string
{
    $relativeScript = currentProjectRelativeScript();
    $currentDirectory = str_replace('\\', '/', dirname($relativeScript));
    $currentDirectory = $currentDirectory === '.' ? '' : trim($currentDirectory, '/');

    $levelsUp = $currentDirectory === '' ? 0 : count(explode('/', $currentDirectory));
    $prefix = str_repeat('../', $levelsUp);

    return $prefix . ltrim($target, '/');
}

/**
 * Limita la cookie de sesión a la carpeta real de esta instalación.
 * Así dos copias del proyecto en subcarpetas distintas no comparten sesión.
 */
function sessionCookiePathForProject(): string
{
    $scriptName = str_replace('\\', '/', (string) ($_SERVER['SCRIPT_NAME'] ?? '/index.php'));
    $relativeScript = currentProjectRelativeScript();

    if ($relativeScript !== '' && str_ends_with($scriptName, $relativeScript)) {
        $basePath = substr($scriptName, 0, -strlen($relativeScript));
        $basePath = '/' . trim((string) $basePath, '/');

        return $basePath === '/' ? '/' : $basePath . '/';
    }

    return '/';
}

session_name('livp_demo_session');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => sessionCookiePathForProject(),
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function firstChar(string $value): string
{
    return function_exists('mb_substr') ? mb_substr($value, 0, 1) : substr($value, 0, 1);
}

function sliceText(string $value, int $length): string
{
    return function_exists('mb_substr') ? mb_substr($value, 0, $length) : substr($value, 0, $length);
}

function isAuthenticated(): bool
{
    return isset($_SESSION['livp_user']) && is_array($_SESSION['livp_user']);
}

function currentUser(): ?array
{
    return isAuthenticated() ? $_SESSION['livp_user'] : null;
}

function requireAuth(): array
{
    if (!isAuthenticated()) {
        header('Location: ' . appRelativeUrl('index.php'));
        exit;
    }

    return $_SESSION['livp_user'];
}

function menuForRole(string $role): array
{
    $menus = [
        'cliente' => [
            ['id' => 'inicio', 'label' => 'Inicio', 'icon' => '⌂'],
            ['id' => 'mis-seguros', 'label' => 'Mis Seguros', 'icon' => '▣'],
            ['id' => 'mis-pagos', 'label' => 'Mis Pagos', 'icon' => '◉'],
            ['id' => 'mis-siniestros', 'label' => 'Mis Siniestros', 'icon' => '⚑'],
            ['id' => 'mi-perfil', 'label' => 'Mi Perfil', 'icon' => '◌'],
        ],
        'ejecutivo' => [
            ['id' => 'inicio', 'label' => 'Inicio', 'icon' => '⌂'],
            ['id' => 'clientes', 'label' => 'Clientes', 'icon' => '♙'],
            ['id' => 'seguros', 'label' => 'Seguros', 'icon' => '▣'],
            ['id' => 'cobranzas', 'label' => 'Cobranzas', 'icon' => '◉'],
            ['id' => 'siniestros', 'label' => 'Siniestros', 'icon' => '⚑'],
            ['id' => 'catalogos', 'label' => 'Catálogos', 'icon' => '▤'],
        ],
        'gerente' => [
            ['id' => 'inicio', 'label' => 'Inicio', 'icon' => '⌂'],
            ['id' => 'reportes', 'label' => 'Reportes', 'icon' => '▥'],
            ['id' => 'usuarios', 'label' => 'Usuarios', 'icon' => '♙'],
            ['id' => 'clientes', 'label' => 'Clientes', 'icon' => '♙'],
            ['id' => 'seguros', 'label' => 'Seguros', 'icon' => '▣'],
            ['id' => 'cobranzas', 'label' => 'Cobranzas', 'icon' => '◉'],
            ['id' => 'siniestros', 'label' => 'Siniestros', 'icon' => '⚑'],
            ['id' => 'catalogo', 'label' => 'Catálogo', 'icon' => '▤'],
        ],
    ];

    return $menus[$role] ?? [];
}
