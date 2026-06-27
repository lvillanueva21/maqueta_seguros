(() => {
  const app = document.getElementById('expedients-app');
  const rawExpedientData = document.getElementById('expedient-default-data');
  const rawCatalogData = document.getElementById('expedient-catalog-data');

  if (!app || !rawExpedientData || !rawCatalogData) {
    return;
  }

  const currentUserId = String(document.body.dataset.user || '');
  const currentUserName = String(document.body.dataset.userName || 'Ejecutivo');
  const canViewAll = document.body.dataset.viewAllExpedients === '1';
  const storageKey = window.BrokerDemo?.keys?.expedients || 'broker_seguros_demo_expedients_v2';

  const summaryTotal = document.getElementById('summary-total');
  const summaryTotalNote = document.getElementById('summary-total-note');
  const summaryWithoutQuotes = document.getElementById('summary-without-quotes');
  const summaryWithQuotes = document.getElementById('summary-with-quotes');
  const summaryClosed = document.getElementById('summary-closed');
  const contextText = document.getElementById('expedients-context-text');

  const searchInput = document.getElementById('filter-search');
  const stateFilter = document.getElementById('filter-state');
  const responsibleFilter = document.getElementById('filter-responsible');
  const clearFiltersButton = document.getElementById('clear-expedient-filters');

  const tableBody = document.getElementById('expedient-table-body');
  const emptyMessage = document.getElementById('expedient-empty');
  const addButton = document.getElementById('add-expedient');

  const formDialog = document.getElementById('expedient-form-dialog');
  const form = document.getElementById('expedient-form');
  const formClose = document.getElementById('expedient-form-close');
  const formCancel = document.getElementById('expedient-form-cancel');
  const clientSelect = document.getElementById('expedient-client');
  const stateSelect = document.getElementById('expedient-state');
  const responsibleSelect = document.getElementById('expedient-responsible');
  const titleInput = document.getElementById('expedient-title');
  const descriptionInput = document.getElementById('expedient-description');

  const detailDialog = document.getElementById('expedient-detail-dialog');
  const detailContent = document.getElementById('expedient-detail-content');
  const detailClose = document.getElementById('expedient-detail-close');

  const clone = (value) => JSON.parse(JSON.stringify(value));

  function notify(type, message, options = {}) {
    window.BrokerNotify?.[type]?.(message, options);
  }

  function readJson(node, fallback = {}) {
    try {
      return JSON.parse(node.textContent || '');
    } catch (error) {
      return fallback;
    }
  }

  function readStorage(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  const defaultData = readJson(rawExpedientData, {});
  const defaultCatalogData = readJson(rawCatalogData, {});
  const catalogData = window.BrokerDemo?.loadCatalogs
    ? window.BrokerDemo.loadCatalogs(defaultCatalogData).catalogs
    : defaultCatalogData;

  function currentDateTime() {
    return window.BrokerDemo?.limaDateTime?.() || new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  function loadExpedients() {
    if (window.BrokerDemo?.loadExpedients) {
      return window.BrokerDemo.loadExpedients(defaultData);
    }

    return {
      items: clone(Array.isArray(defaultData.items) ? defaultData.items : []),
      migrated: false,
    };
  }

  const loaded = loadExpedients();
  let expedients = loaded.items;

  function escapeHtml(value) {
    const element = document.createElement('div');
    element.textContent = String(value ?? '');
    return element.innerHTML;
  }

  function slugify(value) {
    return String(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function formatDate(value, includeTime = false) {
    return window.BrokerDemo?.formatPeruDate?.(value, includeTime) || String(value || 'No registrado');
  }

  function activeCatalogItems(catalogId) {
    const items = catalogData?.[catalogId]?.items;
    return Array.isArray(items)
      ? items.filter((item) => String(item.status).toLowerCase() === 'activo')
      : [];
  }

  function saveExpedients() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(expedients));
      return true;
    } catch (error) {
      notify('error', 'No se pudo guardar el cambio en este navegador. Libera espacio del sitio o intenta nuevamente.', {
        title: 'Error de almacenamiento',
        duration: 0,
      });
      return false;
    }
  }

  function logAction(action) {
    const data = new URLSearchParams({ action, section: 'expedientes' }).toString();

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          'api/cache_action.php',
          new Blob([data], { type: 'application/x-www-form-urlencoded;charset=UTF-8' })
        );
        return;
      }

      fetch('api/cache_action.php', {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Accept: 'application/json',
        },
        body: data,
      });
    } catch (error) {
      // El módulo funciona aun si no se registra la acción temporal.
    }
  }

  function visibleExpedients() {
    if (canViewAll) {
      return [...expedients];
    }

    return expedients.filter((item) => String(item.responsible_user_id) === currentUserId);
  }

  function normalized(value) {
    return String(value || '').toLocaleLowerCase('es-PE');
  }

  function filteredExpedients() {
    const search = normalized(searchInput?.value);
    const state = stateFilter?.value || '';
    const responsible = responsibleFilter?.value || '';

    return visibleExpedients()
      .filter((item) => {
        const searchable = [
          item.code,
          item.client_name,
          item.client_document,
          item.title,
          item.description,
          item.responsible_name,
        ].map(normalized).join(' ');

        return !search || searchable.includes(search);
      })
      .filter((item) => !state || item.state === state)
      .filter((item) => !responsible || String(item.responsible_user_id) === responsible)
      .sort((first, second) => String(second.updated_at).localeCompare(String(first.updated_at)));
  }

  function stateMarkup(state) {
    return `<span class="expedient-state state-${escapeHtml(slugify(state))}">${escapeHtml(state)}</span>`;
  }

  function quoteCount(item) {
    return Array.isArray(item?.quotes) ? item.quotes.length : 0;
  }

  function quoteCountMarkup(item) {
    const count = quoteCount(item);
    const label = count === 1 ? '1 cotización' : `${count} cotizaciones`;
    return `<span class="expedient-quote-count ${count > 0 ? 'has-quotes' : ''}">${escapeHtml(label)}</span>`;
  }

  function populateSelect(select, values, placeholder, valueKey = null, labelKey = null) {
    if (!select) return;

    const options = [`<option value="">${escapeHtml(placeholder)}</option>`];

    values.forEach((item) => {
      const value = valueKey ? item?.[valueKey] : item;
      const label = labelKey ? item?.[labelKey] : item;
      options.push(`<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`);
    });

    select.innerHTML = options.join('');
  }

  function initializeFilters() {
    const states = activeCatalogItems('estados_expediente').map((item) => item.name);
    const responsibles = canViewAll
      ? (Array.isArray(defaultData.executives) ? defaultData.executives : []).filter((item) => item.active)
      : [];

    populateSelect(stateFilter, states, 'Todas');
    populateSelect(responsibleFilter, responsibles, 'Todos', 'user_id', 'name');

    contextText.textContent = canViewAll
      ? 'Como gerente puedes consultar todos los expedientes y asignar responsables. Un expediente puede continuar sin cotizaciones ni seguros.'
      : `Como ejecutivo solo se muestran los expedientes asignados a ${currentUserName}. No necesitas registrar una cotización para crear o mantener un expediente.`;
  }

  function renderSummary() {
    const visible = visibleExpedients();
    const withoutQuotes = visible.filter((item) => quoteCount(item) === 0);
    const withQuotes = visible.filter((item) => quoteCount(item) > 0);
    const closed = visible.filter((item) => item.state === 'Cerrado');

    summaryTotal.textContent = String(visible.length);
    summaryTotalNote.textContent = canViewAll ? 'Vista global de gerencia' : 'Asignados a tu usuario';
    summaryWithoutQuotes.textContent = String(withoutQuotes.length);
    summaryWithQuotes.textContent = String(withQuotes.length);
    summaryClosed.textContent = String(closed.length);
  }

  function renderTable() {
    const items = filteredExpedients();
    emptyMessage.hidden = items.length !== 0;

    if (items.length === 0) {
      tableBody.innerHTML = '';
      return;
    }

    tableBody.innerHTML = items.map((item) => `
      <tr>
        <td><span class="expedient-code">${escapeHtml(item.code)}</span></td>
        <td>
          <span class="expedient-client-name">${escapeHtml(item.client_name)}</span>
          <span class="expedient-client-document">${escapeHtml(item.entity_type)} · ${escapeHtml(item.client_document)}</span>
        </td>
        <td>
          <span class="expedient-title ${item.title === 'Sin asunto definido' ? 'expedient-title-empty' : ''}">${escapeHtml(item.title)}</span>
        </td>
        <td>${escapeHtml(item.responsible_name)}</td>
        <td>${stateMarkup(item.state)}</td>
        <td>${quoteCountMarkup(item)}</td>
        <td>${escapeHtml(formatDate(item.updated_at, true))}</td>
        <td><button class="expedient-row-button" type="button" data-expedient-id="${escapeHtml(item.id)}">Ver ficha</button></td>
      </tr>
    `).join('');

    tableBody.querySelectorAll('[data-expedient-id]').forEach((button) => {
      button.addEventListener('click', () => openDetail(button.dataset.expedientId || ''));
    });
  }

  function render() {
    renderSummary();
    renderTable();
  }

  function createOptionsForForm() {
    const clients = Array.isArray(defaultData.clients) ? defaultData.clients : [];
    const states = activeCatalogItems('estados_expediente').map((item) => item.name);
    const executives = Array.isArray(defaultData.executives)
      ? defaultData.executives.filter((item) => item.active)
      : [];

    populateSelect(
      clientSelect,
      clients.map((client) => ({
        value: client.id,
        label: `${client.name} — ${client.document_type} ${client.document}`,
      })),
      'Selecciona una entidad',
      'value',
      'label'
    );
    populateSelect(stateSelect, states, 'Abierto');
    populateSelect(responsibleSelect, executives, 'Selecciona un responsable', 'user_id', 'name');
  }

  function openCreateDialog() {
    if (!formDialog || !form) return;

    form.reset();
    createOptionsForForm();

    if (stateSelect) {
      stateSelect.value = 'Abierto';
    }

    if (!canViewAll && responsibleSelect) {
      responsibleSelect.value = currentUserId;
    }

    formDialog.showModal();
    clientSelect?.focus();
  }

  function closeFormDialog() {
    if (formDialog?.open) {
      formDialog.close();
    }
  }

  function generateCode() {
    const year = window.BrokerDemo?.limaYear?.() || new Date().getFullYear();
    const prefix = `EXP-${year}-`;
    const sequence = expedients
      .filter((item) => String(item.code || '').startsWith(prefix))
      .map((item) => Number.parseInt(String(item.code).slice(prefix.length), 10))
      .filter(Number.isFinite);

    const next = sequence.length ? Math.max(...sequence) + 1 : 1;
    return `${prefix}${String(next).padStart(4, '0')}`;
  }

  function selectedClient() {
    const clientId = clientSelect?.value || '';
    return (Array.isArray(defaultData.clients) ? defaultData.clients : [])
      .find((client) => client.id === clientId) || null;
  }

  function selectedResponsible() {
    const requestedId = responsibleSelect?.value || currentUserId;
    const executive = (Array.isArray(defaultData.executives) ? defaultData.executives : [])
      .find((item) => String(item.user_id) === String(requestedId));

    if (executive) {
      return executive;
    }

    return {
      user_id: currentUserId,
      name: currentUserName,
    };
  }

  function handleCreate(event) {
    event.preventDefault();

    const client = selectedClient();
    const responsible = selectedResponsible();
    const state = stateSelect?.value || 'Abierto';
    const title = titleInput?.value.trim() || 'Sin asunto definido';
    const description = descriptionInput?.value.trim() || '';

    if (!client || !responsible?.user_id) {
      notify('warning', 'Selecciona el cliente o entidad y el responsable antes de crear el expediente.', {
        title: 'Faltan datos esenciales',
      });
      return;
    }

    const latest = window.BrokerDemo?.loadExpedients?.(defaultData).items;
    if (Array.isArray(latest)) {
      const byId = new Map(expedients.map((item) => [item.id, item]));
      latest.forEach((item) => byId.set(item.id, item));
      expedients = [...byId.values()];
    }

    const code = generateCode();
    if (expedients.some((item) => item.code === code)) {
      notify('error', `No se pudo generar un código único para ${code}. Recarga la página e intenta nuevamente para evitar duplicados entre pestañas.`, {
        title: 'Código duplicado',
        duration: 0,
      });
      return;
    }

    const created = {
      id: `exp-local-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      code,
      client_id: client.id,
      client_name: client.name,
      client_document: `${client.document_type} ${client.document}`,
      entity_type: client.entity_type,
      title,
      state,
      responsible_user_id: String(responsible.user_id),
      responsible_name: responsible.name,
      opened_at: window.BrokerDemo?.limaDate?.() || currentDateTime().slice(0, 10),
      updated_at: currentDateTime(),
      description,
      quotes: [],
    };

    expedients.push(created);

    if (!saveExpedients()) {
      expedients = expedients.filter((item) => item.id !== created.id);
      return;
    }

    logAction(`Creó expediente ${created.code}`);
    closeFormDialog();
    render();
    notify('success', `El expediente ${created.code} fue creado y guardado temporalmente solo en este navegador mientras no exista MySQL. No requiere cotización ni seguro.`, {
      title: 'Expediente creado',
    });
    openDetail(created.id);
  }

  function findVisibleExpedient(expedientId) {
    return visibleExpedients().find((item) => item.id === expedientId) || null;
  }

  function quotePlaceholderMarkup(item) {
    const count = quoteCount(item);

    if (count === 0) {
      return `
        <section class="expedient-quotes-placeholder">
          <h3>Cotizaciones y seguros</h3>
          <p>Este expediente no tiene cotizaciones vinculadas. Esto es válido: puede continuar, quedar en espera, cerrarse o cancelarse sin que se registre seguro, póliza o pago.</p>
          <p class="expedient-quote-placeholder-status">Cuando se implemente Cotizaciones, podrás agregar una o varias mediante plantillas con ítems, alternativas, advertencias, mensajes y notas.</p>
        </section>
      `;
    }

    return `
      <section class="expedient-quotes-placeholder">
        <h3>Cotizaciones y seguros</h3>
        <p>Este expediente tiene ${count === 1 ? '1 cotización vinculada' : `${count} cotizaciones vinculadas`}. El detalle de alternativas se habilitará en el próximo módulo de plantillas y cotizaciones.</p>
      </section>
    `;
  }

  function openDetail(expedientId) {
    const item = findVisibleExpedient(expedientId);
    if (!detailDialog || !detailContent || !item) {
      return;
    }

    const states = activeCatalogItems('estados_expediente').map((catalogItem) => catalogItem.name);
    const stateOptions = states.map((state) => (
      `<option value="${escapeHtml(state)}" ${state === item.state ? 'selected' : ''}>${escapeHtml(state)}</option>`
    )).join('');

    detailContent.innerHTML = `
      <div class="expedient-detail-header">
        <div>
          <p class="expedient-detail-code">${escapeHtml(item.code)}</p>
          <h3 class="expedient-detail-title">${escapeHtml(item.title)}</h3>
        </div>
        ${stateMarkup(item.state)}
      </div>

      <div class="expedient-detail-grid">
        <div><dt>Cliente o entidad</dt><dd>${escapeHtml(item.client_name)}</dd></div>
        <div><dt>Documento</dt><dd>${escapeHtml(item.client_document)}</dd></div>
        <div><dt>Tipo de entidad</dt><dd>${escapeHtml(item.entity_type)}</dd></div>
        <div><dt>Responsable</dt><dd>${escapeHtml(item.responsible_name)}</dd></div>
        <div><dt>Fecha de apertura</dt><dd>${escapeHtml(formatDate(item.opened_at))}</dd></div>
        <div><dt>Última actualización</dt><dd>${escapeHtml(formatDate(item.updated_at, true))}</dd></div>
      </div>

      <p class="expedient-detail-description">${item.description ? escapeHtml(item.description) : 'Sin descripción inicial registrada.'}</p>

      ${quotePlaceholderMarkup(item)}

      <section class="expedient-detail-state">
        <h3>Actualizar situación</h3>
        <p>Las situaciones son flexibles y no obligan a seguir una secuencia. Puedes actualizar esta referencia cuando lo necesites.</p>
        <select id="detail-expedient-state" aria-label="Nueva situación del expediente">
          ${stateOptions}
        </select>
        <div class="expedient-detail-state-actions">
          <button id="save-expedient-state" class="expedient-primary-button" type="button" data-expedient-id="${escapeHtml(item.id)}">Guardar situación</button>
        </div>
      </section>
    `;

    detailContent.querySelector('#save-expedient-state')?.addEventListener('click', () => {
      const newState = detailContent.querySelector('#detail-expedient-state')?.value || '';
      updateState(item.id, newState);
    });

    if (!detailDialog.open) {
      detailDialog.showModal();
    }
  }

  function updateState(expedientId, newState) {
    const item = visibleExpedients().find((candidate) => candidate.id === expedientId);
    if (!item || !newState) {
      notify('error', 'No se encontró el expediente o la situación seleccionada no es válida.', {
        title: 'No se pudo actualizar',
      });
      return;
    }

    if (item.state === newState) {
      notify('info', `${item.code} ya tiene la situación “${newState}”. No se realizaron cambios.`, {
        title: 'Sin cambios',
      });
      return;
    }

    const previousState = item.state;
    item.state = newState;
    item.updated_at = currentDateTime();

    if (!saveExpedients()) {
      item.state = previousState;
      return;
    }

    logAction(`Actualizó ${item.code}: ${previousState} → ${newState}`);
    render();
    notify('success', `Se actualizó ${item.code} a “${newState}”. El cambio quedó guardado temporalmente solo en este navegador mientras no exista MySQL.`, {
      title: 'Situación actualizada',
    });
    openDetail(item.id);
  }

  function closeDetailDialog() {
    if (detailDialog?.open) {
      detailDialog.close();
    }
  }

  function clearFilters() {
    if (searchInput) searchInput.value = '';
    if (stateFilter) stateFilter.value = '';
    if (responsibleFilter) responsibleFilter.value = '';
    renderTable();
    notify('info', 'Se limpiaron los filtros del listado.', {
      title: 'Filtros restablecidos',
      duration: 3200,
    });
  }

  [searchInput, stateFilter, responsibleFilter]
    .filter(Boolean)
    .forEach((input) => input.addEventListener('input', renderTable));

  addButton?.addEventListener('click', openCreateDialog);
  form?.addEventListener('submit', handleCreate);
  formClose?.addEventListener('click', closeFormDialog);
  formCancel?.addEventListener('click', closeFormDialog);
  detailClose?.addEventListener('click', closeDetailDialog);
  clearFiltersButton?.addEventListener('click', clearFilters);

  initializeFilters();
  createOptionsForForm();
  render();

})();
