(() => {
  const body = document.body;
  const userId = body.dataset.user || 'anonymous';
  const localActionKey = `broker_seguros_demo_actions_${userId}`;

  const cacheList = document.getElementById('cache-list');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const menuToggle = document.getElementById('menu-toggle');
  const sidebarClose = document.getElementById('sidebar-close');
  const moduleLinks = document.querySelectorAll('[data-module-id]');

  function normalizeEntry(entry) {
    return {
      action: String(entry.action || 'Acción registrada'),
      section: String(entry.section || 'inicio'),
      at: String(entry.at || new Date().toLocaleString('es-PE')),
    };
  }

  function getLocalActions() {
    try {
      const raw = localStorage.getItem(localActionKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map(normalizeEntry) : [];
    } catch (error) {
      return [];
    }
  }

  function saveLocalAction(entry) {
    const actions = getLocalActions();
    actions.unshift(normalizeEntry(entry));
    localStorage.setItem(localActionKey, JSON.stringify(actions.slice(0, 8)));
  }

  function formatDate(value) {
    if (!value) return 'Ahora';

    const date = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }

  function renderActions(serverItems = []) {
    if (!cacheList) return;

    const combined = [...serverItems.map(normalizeEntry), ...getLocalActions()];
    const unique = [];
    const seen = new Set();

    combined.forEach((item) => {
      const key = `${item.action}|${item.section}|${item.at}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    });

    if (unique.length === 0) {
      cacheList.innerHTML = '<li>Sin acciones registradas todavía.</li>';
      return;
    }

    cacheList.innerHTML = unique.slice(0, 5).map((item) => (
      `<li><span>${escapeHtml(item.action)}</span><time>${escapeHtml(formatDate(item.at))}</time></li>`
    )).join('');
  }

  async function loadServerActions() {
    if (!cacheList) return;

    try {
      const response = await fetch('api/cache_actions.php', {
        headers: { Accept: 'application/json' },
      });
      const payload = await response.json();

      if (payload.ok) {
        renderActions(payload.items || []);
        return;
      }
    } catch (error) {
      // Se usa el historial local como respaldo.
    }

    renderActions();
  }

  function sendNavigationAction(action, section) {
    const entry = {
      action,
      section,
      at: new Date().toISOString(),
    };

    saveLocalAction(entry);

    const encodedData = new URLSearchParams({ action, section }).toString();

    try {
      if (navigator.sendBeacon) {
        const payload = new Blob([encodedData], {
          type: 'application/x-www-form-urlencoded;charset=UTF-8',
        });
        navigator.sendBeacon('api/cache_action.php', payload);
        return;
      }

      fetch('api/cache_action.php', {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Accept: 'application/json',
        },
        body: encodedData,
      });
    } catch (error) {
      // El historial local queda disponible aunque falle el registro de sesión.
    }
  }

  function closeMobileSidebar() {
    sidebar?.classList.remove('is-open');
    overlay?.classList.remove('is-visible');
  }

  moduleLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const moduleId = link.dataset.moduleId || 'inicio';
      const moduleLabel = link.dataset.moduleLabel || 'Módulo';
      sendNavigationAction(`Ingresó a ${moduleLabel}`, moduleId);
      closeMobileSidebar();
    });
  });

  menuToggle?.addEventListener('click', () => {
    sidebar?.classList.add('is-open');
    overlay?.classList.add('is-visible');
  });

  sidebarClose?.addEventListener('click', closeMobileSidebar);
  overlay?.addEventListener('click', closeMobileSidebar);

  loadServerActions();
})();
