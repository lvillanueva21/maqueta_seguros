<?php
declare(strict_types=1);

const APP_NAME = 'BROKER SEGUROS';
const APP_SHORT_NAME = 'BROKER';

date_default_timezone_set('America/Lima');

function currentProjectRelativeScript(): string
{
    $projectRoot = realpath(__DIR__ . '/..') ?: dirname(__DIR__);
    $scriptFile = realpath((string) ($_SERVER['SCRIPT_FILENAME'] ?? ''));

    if ($scriptFile !== false && str_starts_with($scriptFile, $projectRoot)) {
        return ltrim(str_replace('\\', '/', substr($scriptFile, strlen($projectRoot))), '/');
    }

    return basename((string) ($_SERVER['SCRIPT_NAME'] ?? 'index.php'));
}

function appRelativeUrl(string $target = ''): string
{
    $relativeScript = currentProjectRelativeScript();
    $currentDirectory = str_replace('\\', '/', dirname($relativeScript));
    $currentDirectory = $currentDirectory === '.' ? '' : trim($currentDirectory, '/');

    $levelsUp = $currentDirectory === '' ? 0 : count(explode('/', $currentDirectory));
    $prefix = str_repeat('../', $levelsUp);

    return $prefix . ltrim($target, '/');
}

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

session_name('broker_seguros_demo_session');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => sessionCookiePathForProject(),
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

function sendNoCacheHeaders(): void
{
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: 0');
}

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
    if (!isset($_SESSION['livp_user']) || !is_array($_SESSION['livp_user'])) {
        return false;
    }

    foreach (['id', 'role', 'role_label', 'name', 'document_type', 'document'] as $requiredKey) {
        if (!array_key_exists($requiredKey, $_SESSION['livp_user'])) {
            return false;
        }
    }

    return true;
}

function currentUser(): ?array
{
    return isAuthenticated() ? $_SESSION['livp_user'] : null;
}

function createUserSession(array $user): void
{
    unset($user['password_hash']);

    $accountType = (string) ($user['account_type'] ?? 'persona');
    $accountLabels = [
        'persona' => 'Persona',
        'empresa' => 'Empresa',
        'consorcio' => 'Consorcio',
    ];

    $user['account_type'] = array_key_exists($accountType, $accountLabels) ? $accountType : 'persona';
    $user['account_type_label'] = $accountLabels[$user['account_type']];
    $user['session_started_at'] = date('Y-m-d H:i:s');

    session_regenerate_id(true);
    $_SESSION['livp_user'] = $user;
    $_SESSION['action_cache'] = [
        [
            'action' => 'Inicio de sesión',
            'section' => 'inicio',
            'at' => $user['session_started_at'],
        ],
    ];
}

function destroyCurrentSession(): void
{
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }

    session_destroy();
}

function formatSessionStartedAt(?string $dateTime): string
{
    if ($dateTime === null || trim($dateTime) === '') {
        return 'No registrado';
    }

    $date = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $dateTime, new DateTimeZone('America/Lima'));

    return $date instanceof DateTimeImmutable ? $date->format('d/m/Y · H:i') : 'No registrado';
}

function requireAuth(): array
{
    if (!isAuthenticated()) {
        sendNoCacheHeaders();
        header('Location: ' . appRelativeUrl('index.php'));
        exit;
    }

    sendNoCacheHeaders();

    return $_SESSION['livp_user'];
}

function modulesCatalog(): array
{
    static $modules = null;

    if ($modules === null) {
        $loadedModules = require __DIR__ . '/modules.php';
        $modules = is_array($loadedModules) ? $loadedModules : [];
    }

    return $modules;
}

function moduleForId(string $moduleId): ?array
{
    $modules = modulesCatalog();

    return isset($modules[$moduleId]) && is_array($modules[$moduleId]) ? $modules[$moduleId] : null;
}

function canAccessModule(string $role, string $moduleId): bool
{
    $module = moduleForId($moduleId);
    $roles = is_array($module['roles'] ?? null) ? $module['roles'] : [];

    return in_array($role, $roles, true);
}

function modulesForRole(string $role): array
{
    $allowedModules = [];

    foreach (modulesCatalog() as $module) {
        if (!is_array($module) || !isset($module['id'])) {
            continue;
        }

        if (canAccessModule($role, (string) $module['id'])) {
            $allowedModules[] = $module;
        }
    }

    return $allowedModules;
}

function moduleUrl(string $moduleId): string
{
    if ($moduleId === 'inicio') {
        return appRelativeUrl('dashboard.php');
    }

    if ($moduleId === 'catalogos') {
        return appRelativeUrl('catalogos.php');
    }

    return appRelativeUrl('modulo.php?modulo=' . rawurlencode($moduleId));
}

function requireModuleAccess(string $moduleId): array
{
    $user = requireAuth();
    $module = moduleForId($moduleId);

    if ($module === null || $moduleId === 'inicio') {
        header('Location: ' . appRelativeUrl('acceso_denegado.php?modulo=' . rawurlencode($moduleId) . '&motivo=modulo'));
        exit;
    }

    if (!canAccessModule((string) $user['role'], $moduleId)) {
        header('Location: ' . appRelativeUrl('acceso_denegado.php?modulo=' . rawurlencode($moduleId) . '&motivo=permiso'));
        exit;
    }

    return [
        'user' => $user,
        'module' => $module,
    ];
}

function menuForRole(string $role): array
{
    return modulesForRole($role);
}
