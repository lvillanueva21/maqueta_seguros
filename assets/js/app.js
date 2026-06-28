(() => {
  const body = document.body;
  const userId = body.dataset.user || 'anonymous';
  const localActionKey = `broker_seguros_demo_actions_${userId}`;
  const assetVersion = 'BS-20260627-191718-PET';

  function installStyleFile(relativePath, marker) {
    if (document.querySelector(`link[${marker}]`)) return;
    const current = document.currentScript?.src;
    const url = current
      ? new URL(relativePath, current)
      : new URL(`assets/${relativePath.replace('../', '')}`, window.location.href);
    url.searchParams.set('v', assetVersion);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url.href;
    link.setAttribute(marker, 'true');
    document.head.appendChild(link);
  }

  installStyleFile('../css/notifications.css', 'data-broker-notification-styles');
  installStyleFile('../css/modal-ui.css', 'data-broker-modal-ui-styles');

  let globalHost = null;
  let lastKey = '';
  let lastAt = 0;

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function activeDialog() {
    const dialogs = Array.from(document.querySelectorAll('dialog'))
      .filter((dialog) => dialog.open && document.body.contains(dialog));
    return dialogs.length ? dialogs[dialogs.length - 1] : null;
  }

  function globalNotificationHost() {
    if (globalHost && document.body.contains(globalHost)) return globalHost;
    globalHost = document.createElement('section');
    globalHost.className = 'broker-notification-host broker-notification-host-global';
    globalHost.setAttribute('aria-live', 'polite');
    globalHost.setAttribute('aria-label', 'Mensajes del sistema');
    document.body.appendChild(globalHost);
    return globalHost;
  }

  function dialogNotificationHost(dialog) {
    const content = dialog.querySelector(':scope > form')
      || dialog.querySelector(':scope > .expedient-dialog-content')
      || dialog;

    const existing = Array.from(content.children)
      .find((child) => child.classList?.contains('broker-dialog-notification-host'));
    if (existing) return existing;

    const host = document.createElement('section');
    host.className = 'broker-notification-host broker-dialog-notification-host';
    host.setAttribute('aria-live', 'polite');
    host.setAttribute('aria-label', 'Mensajes del formulario');

    const heading = content.querySelector('.policy-editor-heading, .expedient-dialog-heading, .catalog-dialog-heading, .dialog-head');
    if (heading) heading.insertAdjacentElement('afterend', host);
    else content.prepend(host);

    dialog.addEventListener('close', () => host.remove(), { once: true });
    return host;
  }

  function notificationHost(options = {}) {
    if (options.placement === 'global') return globalNotificationHost();
    const dialog = activeDialog();
    return dialog ? dialogNotificationHost(dialog) : globalNotificationHost();
  }

  function removeNotification(notification) {
    if (!notification || notification.dataset.removing === 'true') return;
    notification.dataset.removing = 'true';
    notification.classList.add('is-leaving');
    window.setTimeout(() => notification.remove(), 180);
  }

  function show(type, message, options = {}) {
    const kind = ['success', 'error', 'warning', 'info'].includes(type) ? type : 'info';
    const defaults = {
      success: { title: 'Acción realizada', icon: '✓', duration: 5200 },
      error: { title: 'No se pudo completar', icon: '!', duration: 9000 },
      warning: { title: 'Revisa esta información', icon: '!', duration: 7500 },
      info: { title: 'Información', icon: 'i', duration: 5200 },
    };
    const settings = { ...defaults[kind], ...options };
    const key = `${kind}|${settings.title}|${message}`;
    const current = Date.now();

    if (key === lastKey && current - lastAt < 850) return null;
    lastKey = key;
    lastAt = current;

    const notification = document.createElement('article');
    notification.className = `broker-notification broker-notification-${kind}`;
    notification.setAttribute('role', kind === 'error' ? 'alert' : 'status');

    const actions = Array.isArray(settings.actions) && settings.actions.length
      ? `<div class="broker-notification-actions">${settings.actions.map((action, index) =>
          `<button class="broker-notification-action ${action.kind === 'danger' ? 'is-danger' : ''}" type="button" data-notification-action="${index}">${escapeHtml(action.label)}</button>`
        ).join('')}</div>`
      : '';

    notification.innerHTML = `
      <span class="broker-notification-icon" aria-hidden="true">${escapeHtml(settings.icon)}</span>
      <div class="broker-notification-copy">
        <p class="broker-notification-title">${escapeHtml(settings.title)}</p>
        <p class="broker-notification-message">${escapeHtml(message)}</p>
        ${actions}
      </div>
      <button class="broker-notification-close" type="button" aria-label="Cerrar mensaje">×</button>
    `;

    notification.querySelector('.broker-notification-close')?.addEventListener('click', () => removeNotification(notification));
    notification.querySelectorAll('[data-notification-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = settings.actions?.[Number(button.dataset.notificationAction)];
        action?.callback?.();
        removeNotification(notification);
      });
    });

    notificationHost(settings).appendChild(notification);
    if (settings.duration > 0) window.setTimeout(() => removeNotification(notification), settings.duration);
    return notification;
  }

  window.BrokerNotify = {
    show,
    success: (message, options = {}) => show('success', message, options),
    error: (message, options = {}) => show('error', message, options),
    warning: (message, options = {}) => show('warning', message, options),
    info: (message, options = {}) => show('info', message, options),
    confirm: (message, options = {}) => new Promise((resolve) => {
      let resolved = false;
      const finish = (value) => {
        if (resolved) return;
        resolved = true;
        resolve(value);
      };
      const notification = show('warning', message, {
        title: options.title || 'Confirma la acción',
        duration: 0,
        placement: options.placement,
        actions: [
          { label: options.confirmLabel || 'Confirmar', kind: options.kind || 'danger', callback: () => finish(true) },
          { label: options.cancelLabel || 'Cancelar', callback: () => finish(false) },
        ],
      });
      if (!notification) { finish(false); return; }
      notification.querySelector('.broker-notification-close')
        ?.addEventListener('click', () => finish(false), { once: true });
    }),
  };

  const nativeAlert = window.alert.bind(window);
  window.alert = (message) => {
    if (window.BrokerNotify) {
      window.BrokerNotify.error(String(message), { title: 'Revisa la información', duration: 9000 });
      return;
    }
    nativeAlert(message);
  };

  let lastInvalidAt = 0;
  document.addEventListener('invalid', (event) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
    const current = Date.now();
    if (current - lastInvalidAt < 850) return;
    lastInvalidAt = current;
    window.BrokerNotify.warning('Completa los campos obligatorios marcados antes de guardar.', {
      title: 'Faltan datos por completar',
    });
  }, true);

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
      at: String(entry.at || window.BrokerDemo?.limaDateTime?.() || new Date().toLocaleString('es-PE')),
    };
  }

  function localActions() {
    try {
      const raw = localStorage.getItem(localActionKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map(normalizeEntry) : [];
    } catch { return []; }
  }

  function saveAction(entry) {
    const items = localActions();
    items.unshift(normalizeEntry(entry));
    localStorage.setItem(localActionKey, JSON.stringify(items.slice(0, 8)));
  }

  function formatDate(value) {
    if (!value) return 'Ahora';
    const formatted = window.BrokerDemo?.formatPeruDate?.(value, true);
    return formatted && formatted !== 'No registrado' ? formatted.replace(/\/\d{4},/, '') : value;
  }

  function renderActions(serverItems = []) {
    if (!cacheList) return;
    const combined = [...serverItems.map(normalizeEntry), ...localActions()];
    const unique = [];
    const seen = new Set();
    combined.forEach((item) => {
      const key = `${item.action}|${item.section}|${item.at}`;
      if (!seen.has(key)) { seen.add(key); unique.push(item); }
    });
    cacheList.innerHTML = unique.length
      ? unique.slice(0, 5).map((item) => `<li><span>${escapeHtml(item.action)}</span><time>${escapeHtml(formatDate(item.at))}</time></li>`).join('')
      : '<li>Sin acciones registradas todavía.</li>';
  }

  async function loadServerActions() {
    if (!cacheList) return;
    try {
      const response = await fetch('api/cache_actions.php', { headers: { Accept: 'application/json' } });
      const payload = await response.json();
      if (payload.ok) { renderActions(payload.items || []); return; }
      if (response.status === 401) window.BrokerNotify.warning('Tu sesión ya no es válida. Vuelve a iniciar sesión para continuar.', { title: 'Sesión vencida', duration: 0 });
    } catch {}
    renderActions();
  }

  function sendNavigationAction(action, section) {
    const entry = { action, section, at: window.BrokerDemo?.limaDateTime?.() || new Date().toISOString() };
    saveAction(entry);
    const bodyData = new URLSearchParams({ action, section }).toString();
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('api/cache_action.php', new Blob([bodyData], { type: 'application/x-www-form-urlencoded;charset=UTF-8' }));
        return;
      }
      fetch('api/cache_action.php', {
        method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', Accept: 'application/json' },
        body: bodyData,
      });
    } catch {}
  }

  function closeMobileSidebar() {
    sidebar?.classList.remove('is-open');
    overlay?.classList.remove('is-visible');
  }

  moduleLinks.forEach((link) => link.addEventListener('click', () => {
    sendNavigationAction(`Ingresó a ${link.dataset.moduleLabel || 'Módulo'}`, link.dataset.moduleId || 'inicio');
    closeMobileSidebar();
  }));

  menuToggle?.addEventListener('click', () => {
    sidebar?.classList.add('is-open');
    overlay?.classList.add('is-visible');
  });
  sidebarClose?.addEventListener('click', closeMobileSidebar);
  overlay?.addEventListener('click', closeMobileSidebar);
  loadServerActions();
})();