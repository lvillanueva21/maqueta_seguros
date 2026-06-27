(() => {
  const body = document.body;
  const userId = body.dataset.user || 'anonymous';
  const localActionKey = `broker_seguros_demo_actions_${userId}`;

  function installNotificationStyles() {
    if (document.querySelector('link[data-broker-notification-styles]')) {
      return;
    }

    const scriptUrl = document.currentScript?.src;
    const href = scriptUrl
      ? new URL('../css/notifications.css', scriptUrl).href
      : 'assets/css/notifications.css';

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.brokerNotificationStyles = 'true';
    document.head.appendChild(link);
  }

  function createNotificationSystem() {
    installNotificationStyles();

    let host = null;

    function getHost() {
      if (host && document.body.contains(host)) {
        return host;
      }

      host = document.createElement('section');
      host.className = 'broker-notification-host';
      host.setAttribute('aria-live', 'polite');
      host.setAttribute('aria-label', 'Mensajes del sistema');
      document.body.appendChild(host);

      return host;
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
      const notification = document.createElement('article');

      notification.className = `broker-notification broker-notification-${safeType}`;
      notification.setAttribute('role', safeType === 'error' ? 'alert' : 'status');
      notification.innerHTML = `
        <span class="broker-notification-icon" aria-hidden="true">${escapeHtml(settings.icon)}</span>
        <div>
          <p class="broker-notification-title">${escapeHtml(settings.title)}</p>
          <p class="broker-notification-message">${escapeHtml(message)}</p>
        </div>
        <button class="broker-notification-close" type="button" aria-label="Cerrar mensaje">×</button>
      `;

      notification.querySelector('.broker-notification-close')?.addEventListener('click', () => {
        removeNotification(notification);
      });

      getHost().appendChild(notification);

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

  function safeStorageValue(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      notifications.error(
        'El navegador no permitió leer el almacenamiento temporal. Tus cambios podrían no mantenerse al recargar.',
        { title: 'Almacenamiento no disponible', duration: 0 }
      );
      return null;
    }
  }

  function parseStorageValue(value, fallback) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function notifyIfStorageChanged({ key, before, successMessage, fallbackMessage }) {
    window.setTimeout(() => {
      const after = safeStorageValue(key);

      if (after === before) {
        return;
      }

      notifications.success(successMessage, {
        title: 'Guardado temporalmente',
      });

      if (fallbackMessage) {
        notifications.info(fallbackMessage, {
          title: 'Recordatorio de maqueta',
          duration: 7200,
        });
      }
    }, 0);
  }

  function installFeedbackHooks() {
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

    document.addEventListener('submit', (event) => {
      const form = event.target;

      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      if (form.id === 'catalog-item-form') {
        const inputId = form.querySelector('#catalog-item-id');
        const inputName = form.querySelector('#catalog-item-name');
        const isEditing = Boolean(inputId?.value?.trim());
        const itemName = inputName?.value?.trim() || 'el elemento';
        const before = safeStorageValue('broker_seguros_demo_catalogs_v1');

        notifyIfStorageChanged({
          key: 'broker_seguros_demo_catalogs_v1',
          before,
          successMessage: isEditing
            ? `Se actualizó ${itemName}. El cambio quedó guardado temporalmente en este navegador.`
            : `Se agregó ${itemName}. El cambio quedó guardado temporalmente en este navegador.`,
          fallbackMessage: 'Los catálogos demo aún no usan base de datos ni se comparten con otros equipos.',
        });
      }

      if (form.id === 'expedient-form') {
        const before = safeStorageValue('broker_seguros_demo_expedients_v1');

        window.setTimeout(() => {
          const after = safeStorageValue('broker_seguros_demo_expedients_v1');

          if (after === before) {
            return;
          }

          const previousItems = parseStorageValue(before, []);
          const currentItems = parseStorageValue(after, []);
          const previousIds = new Set(Array.isArray(previousItems) ? previousItems.map((item) => item.id) : []);
          const created = Array.isArray(currentItems)
            ? currentItems.find((item) => !previousIds.has(item.id))
            : null;

          const code = created?.code ? ` ${created.code}` : '';
          notifications.success(
            `El expediente${code} fue creado y guardado temporalmente en este navegador.`,
            { title: 'Expediente creado' }
          );
          notifications.info(
            'Aún no se ha registrado en una base de datos ni se comparte con otros usuarios.',
            { title: 'Recordatorio de maqueta', duration: 7200 }
          );
        }, 0);
      }
    }, true);

    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target.closest('button, a') : null;

      if (!target) {
        return;
      }

      if (target.matches('[data-action="toggle"][data-item-id]')) {
        const before = safeStorageValue('broker_seguros_demo_catalogs_v1');
        const row = target.closest('tr');
        const itemName = row?.children?.[1]?.textContent?.trim() || 'el elemento';
        const actionText = target.textContent?.trim().toLocaleLowerCase('es-PE') === 'activar'
          ? 'activó'
          : 'desactivó';

        notifyIfStorageChanged({
          key: 'broker_seguros_demo_catalogs_v1',
          before,
          successMessage: `Se ${actionText} ${itemName}. El cambio quedó guardado temporalmente en este navegador.`,
          fallbackMessage: 'Este cambio solo existe en la maqueta local de este navegador.',
        });
      }

      if (target.id === 'restore-catalogs') {
        const before = safeStorageValue('broker_seguros_demo_catalogs_v1');

        notifyIfStorageChanged({
          key: 'broker_seguros_demo_catalogs_v1',
          before,
          successMessage: 'Los catálogos demo fueron restaurados correctamente.',
          fallbackMessage: 'Se eliminaron únicamente los cambios guardados en este navegador.',
        });
      }

      if (target.id === 'save-expedient-state') {
        const before = safeStorageValue('broker_seguros_demo_expedients_v1');
        const selectedState = document.getElementById('detail-expedient-state')?.value || 'el nuevo estado';
        const code = target.closest('.expedient-dialog-content')
          ?.querySelector('.expedient-detail-code')
          ?.textContent
          ?.trim() || 'el expediente';

        notifyIfStorageChanged({
          key: 'broker_seguros_demo_expedients_v1',
          before,
          successMessage: `Se actualizó ${code} a “${selectedState}”. El cambio quedó guardado temporalmente en este navegador.`,
          fallbackMessage: 'El estado todavía no se guarda en una base de datos.',
        });
      }
    }, true);

    window.addEventListener('error', (event) => {
      const message = String(event.message || '');

      if (message.includes('QuotaExceededError') || message.includes('localStorage')) {
        notifications.error(
          'No se pudo guardar el cambio en este navegador. Libera espacio del sitio o intenta nuevamente.',
          { title: 'Error de almacenamiento', duration: 0 }
        );
      }
    });
  }

  installFeedbackHooks();

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
