(() => {
  const body = document.body;
  const userId = body.dataset.user || 'anonymous';
  const localActionKey = `broker_seguros_demo_actions_${userId}`;
  const assetVersion = 'BS-20260627-180106-PET';

  function installStyleFile(relativePath, marker) {
    if (document.querySelector(`link[${marker}]`)) {
      return;
    }

    const scriptUrl = document.currentScript?.src;
    const source = scriptUrl
      ? new URL(relativePath, scriptUrl)
      : new URL(`assets/${relativePath.replace('../', '')}`, window.location.href);

    source.searchParams.set('v', assetVersion);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = source.href;
    link.setAttribute(marker, 'true');
    document.head.appendChild(link);
  }

  function installSharedStyles() {
    installStyleFile('../css/notifications.css', 'data-broker-notification-styles');
    installStyleFile('../css/modal-ui.css', 'data-broker-modal-ui-styles');
  }

  function createNotificationSystem() {
    installSharedStyles();

    let globalHost = null;
    let lastNotificationKey = '';
    let lastNotificationAt = 0;

    function getGlobalHost() {
      if (globalHost && document.body.contains(globalHost)) {
        return globalHost;
      }

      globalHost = document.createElement('section');
      globalHost.className = 'broker-notification-host';
      globalHost.setAttribute('aria-live', 'polite');
      globalHost.setAttribute('aria-label', 'Mensajes del sistema');
      document.body.appendChild(globalHost);

      return globalHost;
    }

    function getActiveDialog() {
      const dialogs = Array.from(document.querySelectorAll('dialog[open]'))
        .filter((dialog) => dialog.open && document.body.contains(dialog));

      return dialogs.length ? dialogs[dialogs.length - 1] : null;
    }

    function getDialogHost(dialog) {
      const content = dialog.querySelector(':scope > form')
        || dialog.querySelector(':scope > .expedient-dialog-content')
        || dialog;

      let host = content.querySelector(':scope > .broker-dialog-notification-host');
      if (host) {
        return host;
      }

      host = document.createElement('section');
      host.className = 'broker-notification-host broker-dialog-notification-host';
      host.setAttribute('aria-live', 'polite');
      host.setAttribute('aria-label', 'Mensajes del formulario');

      const heading = content.querySelector(':scope > .dialog-head')
        || content.querySelector(':scope > .catalog-dialog-heading')
        || content.querySelector(':scope > .expedient-dialog-heading');

      if (heading) {
        heading.insertAdjacentElement('afterend', host);
      } else {
        content.prepend(host);
      }

      dialog.addEventListener('close', () => {
        host?.remove();
      }, { once: true });

      return host;
    }

    function getHost(options = {}) {
      if (options.placement === 'global') {
        return getGlobalHost();
      }

      const dialog = getActiveDialog();
      return dialog ? getDialogHost(dialog) : getGlobalHost();
    }

    function escapeHtml(value) {
      const element = document.createElement('div');
      element.textContent = String(value ?? '');
      return element.innerHTML;
    }

    function removeNotification(notification) {
      if (!notification || notification.dataset.removing === 'true') {
        return;
      }

      notification.dataset.removing = 'true';
      notification.classList.add('is-leaving');
      window.setTimeout(() => notification.remove(), 180);
    }

    function show(type, message, options = {}) {
      const safeType = ['success', 'error', 'warning', 'info'].includes(type) ? type : 'info';
      const defaults = {
        success: { title: 'Acción realizada', icon: '✓', duration: 5200 },
        error: { title: 'No se pudo completar', icon: '!', duration: 9000 },
        warning: { title: 'Revisa esta información', icon: '!', duration: 7500 },
        info: { title: 'Información', icon: 'i', duration: 5200 },
      };
      const settings = { ...defaults[safeType], ...options };
      const notificationKey = `${safeType}|${settings.title}|${message}`;
      const now = Date.now();

      if (notificationKey === lastNotificationKey && now - lastNotificationAt < 900) {
        return null;
      }

      lastNotificationKey = notificationKey;
      lastNotificationAt = now;

      const notification = document.createElement('article');
      notification.className = `broker-notification broker-notification-${safeType}`;
      notification.setAttribute('role', safeType === 'error' ? 'alert' : 'status');

      const actions = Array.isArray(settings.actions) && settings.actions.length
        ? `<div class="broker-notification-actions">${settings.actions.map((action, index) => (
          `<button class="broker-notification-action ${action.kind === 'danger' ? 'is-danger' : ''}" type="button" data-action-index="${index}">${escapeHtml(action.label)}</button>`
        )).join('')}</div>`
        : '';

      notification.innerHTML = `
        <span class="broker-notification-icon" aria-hidden="true">${escapeHtml(settings.icon)}</span>
        <div>
          <p class="broker-notification-title">${escapeHtml(settings.title)}</p>
          <p class="broker-notification-message">${escapeHtml(message)}</p>
          ${actions}
        </div>
        <button class="broker-notification-close" type="button" aria-label="Cerrar mensaje">×</button>
      `;

      notification.querySelector('.broker-notification-close')?.addEventListener('click', () => {
        removeNotification(notification);
      });

      notification.querySelectorAll('[data-action-index]').forEach((button) => {
        button.addEventListener('click', () => {
          const action = settings.actions?.[Number(button.dataset.actionIndex)];
          action?.callback?.();
          removeNotification(notification);
        });
      });

      getHost(settings).appendChild(notification);

      if (settings.duration > 0) {
        window.setTimeout(() => removeNotification(notification), settings.duration);
      }

      return notification;
    }

    return {
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

        if (!notification) {
          finish(false);
          return;
        }

        notification.querySelector('.broker-notification-close')
          ?.addEventListener('click', () => finish(false), { once: true });
      }),
    };
  }

  const notifications = createNotificationSystem();
  window.BrokerNotify = notifications;

  const nativeAlert = window.alert.bind(window);
  window.alert = (message) => {
    if (window.BrokerNotify) {
      window.BrokerNotify.error(String(message), {
        title: 'Revisa la información',
        duration: 9000,
      });
      return;
    }

    nativeAlert(message);
  };

  let lastInvalidNotificationAt = 0;
  document.addEventListener('invalid', (event) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) {
      return;
    }

    const now = Date.now();
    if (now - lastInvalidNotificationAt < 900) {
      return;
    }

    lastInvalidNotificationAt = now;
    notifications.warning('Completa los campos obligatorios marcados antes de guardar.', {
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

    const formatted = window.BrokerDemo?.formatPeruDate?.(value, true);
    if (formatted && formatted !== 'No registrado') {
      return formatted.replace(/\/\d{4},/, '');
    }

    return value;
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

      if (response.status === 401) {
        notifications.warning('Tu sesión ya no es válida. Vuelve a iniciar sesión para continuar.', {
          title: 'Sesión vencida',
          duration: 0,
        });
      }
    } catch (error) {
      notifications.info('No se pudieron cargar las acciones recientes. La navegación del módulo sigue disponible.', {
        title: 'Acciones en caché no disponibles',
      });
    }

    renderActions();
  }

  function sendNavigationAction(action, section) {
    const entry = {
      action,
      section,
      at: window.BrokerDemo?.limaDateTime?.() || new Date().toISOString(),
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
