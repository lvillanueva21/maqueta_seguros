(() => {
  const body = document.body;
  const userId = body.dataset.user || 'anonymous';
  const role = body.dataset.role || 'usuario';
  const storageKey = `livp_demo_last_section_${userId}`;
  const localActionKey = `livp_demo_actions_${userId}`;

  const navItems = document.querySelectorAll('.nav-item');
  const pageTitle = document.getElementById('page-title');
  const homeView = document.getElementById('home-view');
  const constructionView = document.getElementById('construction-view');
  const constructionTitle = document.getElementById('construction-title');
  const constructionText = document.getElementById('construction-text');
  const cacheList = document.getElementById('cache-list');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const menuToggle = document.getElementById('menu-toggle');
  const sidebarClose = document.getElementById('sidebar-close');

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

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }

  async function loadServerActions() {
    try {
      const response = await fetch('api/cache_actions.php', { headers: { Accept: 'application/json' } });
      const payload = await response.json();
      if (payload.ok) renderActions(payload.items || []);
    } catch (error) {
      renderActions();
    }
  }

  async function cacheAction(action, section) {
    const localEntry = {
      action,
      section,
      at: new Date().toISOString(),
    };

    saveLocalAction(localEntry);
    renderActions();

    try {
      const formData = new URLSearchParams({ action, section });
      const response = await fetch('api/cache_action.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', Accept: 'application/json' },
        body: formData.toString(),
      });
      const payload = await response.json();
      if (payload.ok) loadServerActions();
    } catch (error) {
      // La versión local sigue disponible aunque el guardado de sesión falle.
    }
  }

  function closeMobileSidebar() {
    sidebar?.classList.remove('is-open');
    overlay?.classList.remove('is-visible');
  }

  function openSection(sectionId, label, shouldCache = true) {
    pageTitle.textContent = label;
    navItems.forEach((item) => item.classList.toggle('is-active', item.dataset.sectionId === sectionId));

    if (sectionId === 'inicio') {
      homeView.hidden = false;
      constructionView.hidden = true;
    } else {
      homeView.hidden = true;
      constructionView.hidden = false;
      constructionTitle.textContent = label;
      constructionText.textContent = `${label} está en construcción para el perfil ${role}.`;
    }

    localStorage.setItem(storageKey, JSON.stringify({ sectionId, label }));
    if (shouldCache) cacheAction(`Ingresó a ${label}`, sectionId);
    closeMobileSidebar();
  }

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      openSection(item.dataset.sectionId || 'inicio', item.dataset.sectionLabel || 'Inicio');
    });
  });

  menuToggle?.addEventListener('click', () => {
    sidebar?.classList.add('is-open');
    overlay?.classList.add('is-visible');
  });
  sidebarClose?.addEventListener('click', closeMobileSidebar);
  overlay?.addEventListener('click', closeMobileSidebar);

  try {
    const cachedSection = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (cachedSection?.sectionId && cachedSection.sectionId !== 'inicio') {
      const matchingItem = [...navItems].find((item) => item.dataset.sectionId === cachedSection.sectionId);
      if (matchingItem) {
        openSection(matchingItem.dataset.sectionId, matchingItem.dataset.sectionLabel, false);
      }
    }
  } catch (error) {
    // Se mantiene Inicio cuando la caché del navegador no es válida.
  }

  loadServerActions();
})();
