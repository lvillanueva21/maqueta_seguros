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
  const storageKey = 'broker_seguros_demo_expedients_v1';

  const summaryTotal = document.getElementById('summary-total');
  const summaryTotalNote = document.getElementById('summary-total-note');
  const summaryDocuments = document.getElementById('summary-documents');
  const summaryRenewals = document.getElementById('summary-renewals');
  const summaryClosed = document.getElementById('summary-closed');
  const contextText = document.getElementById('expedients-context-text');

  const searchInput = document.getElementById('filter-search');
  const stateFilter = document.getElementById('filter-state');
  const insuranceFilter = document.getElementById('filter-insurance');
  const insurerFilter = document.getElementById('filter-insurer');
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
  const managementSelect = document.getElementById('expedient-management-type');
  const insuranceSelect = document.getElementById('expedient-insurance-type');
  const insurerSelect = document.getElementById('expedient-insurer');
  const currencySelect = document.getElementById('expedient-currency');
  const stateSelect = document.getElementById('expedient-state');
  const responsibleSelect = document.getElementById('expedient-responsible');
  const descriptionInput = document.getElementById('expedient-description');

  const detailDialog = document.getElementById('expedient-detail-dialog');
  const detailContent = document.getElementById('expedient-detail-content');
  const detailClose = document.getElementById('expedient-detail-close');

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const readJson = (node) => {
    try {
      return JSON.parse(node.textContent || '{}');
    } catch (error) {
      return {};
    }
  };

  const defaultData = readJson(rawExpedientData);
  const catalogData = readJson(rawCatalogData);

  function getExpedients() {
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      // Se usarán los datos demo iniciales.
    }

    return clone(Array.isArray(defaultData.items) ? defaultData.items : []);
  }

  let expedients = getExpedients();

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

  function toDate(value) {
    if (!value) return null;
    const normalized = String(value).replace(' ', 'T');
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function formatDate(value, includeTime = false) {
    const date = toDate(value);
    if (!date) return 'No registrado';

    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    }).format(date);
  }

  function currentDateTime() {
    const now = new Date();
    const pad = (number) => String(number).padStart(2, '0');

    return [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate()),
    ].join('-') + ' ' + [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join(':');
  }

  function activeCatalogItems(catalogId) {
    const items = catalogData?.[catalogId]?.items;
    return Array.isArray(items)
      ? items.filter((item) => String(item.status).toLowerCase() === 'activo')
      : [];
  }

  function saveExpedients() {
    localStorage.setItem(storageKey, JSON.stringify(expedients));
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
    const insurance = insuranceFilter?.value || '';
    const insurer = insurerFilter?.value || '';
    const responsible = responsibleFilter?.value || '';

    return visibleExpedients()
      .filter((item) => {
        const searchable = [
          item.code,
          item.client_name,
          item.client_document,
          item.description,
          item.insurance_type,
          item.insurer,
          item.responsible_name,
        ].map(normalized).join(' ');

        return !search || searchable.includes(search);
      })
      .filter((item) => !state || item.state === state)
      .filter((item) => !insurance || item.insurance_type === insurance)
      .filter((item) => !insurer || item.insurer === insurer)
      .filter((item) => !responsible || String(item.responsible_user_id) === responsible)
      .sort((first, second) => String(second.updated_at).localeCompare(String(first.updated_at)));
  }

  function stateMarkup(state) {
    return `<span class="expedient-state state-${escapeHtml(slugify(state))}">${escapeHtml(state)}</span>`;
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
    const visible = visibleExpedients();
    const states = activeCatalogItems('estados_expediente').map((item) => item.name);
    const insurances = activeCatalogItems('tipos_seguro').map((item) => item.name);
    const insurers = activeCatalogItems('aseguradoras').map((item) => item.name);
    const responsibles = canViewAll
      ? (Array.isArray(defaultData.executives) ? defaultData.executives : [])
      : [];

    populateSelect(stateFilter, states, 'Todos');
    populateSelect(insuranceFilter, insurances, 'Todos');
    populateSelect(insurerFilter, insurers, 'Todas');
    populateSelect(responsibleFilter, responsibles, 'Todos', 'user_id', 'name');

    contextText.textContent = canViewAll
      ? 'Como gerente puedes consultar todos los expedientes y asignar responsables.'
      : `Como ejecutivo solo se muestran los expedientes asignados a ${currentUserName}.`;

    if (visible.length === 0 && !canViewAll) {
      contextText.textContent = `Aún no tienes expedientes asignados. Al crear uno quedará asociado a ${currentUserName}.`;
    }
  }

  function renderSummary() {
    const visible = visibleExpedients();
    const activeRenewals = visible.filter((item) => (
      item.management_type === 'Renovación'
      && ['Borrador', 'En gestión', 'Pendiente de documentos'].includes(item.state)
    ));
    const pendingDocuments = visible.filter((item) => item.state === 'Pendiente de documentos');
    const closed = visible.filter((item) => item.state === 'Cerrado');

    summaryTotal.textContent = String(visible.length);
    summaryTotalNote.textContent = canViewAll ? 'Vista global de gerencia' : 'Asignados a tu usuario';
    summaryDocuments.textContent = String(pendingDocuments.length);
    summaryRenewals.textContent = String(activeRenewals.length);
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
        <td>${escapeHtml(item.management_type)}</td>
        <td>
          <span class="expedient-insurance">${escapeHtml(item.insurance_type)}</span>
          <span class="expedient-insurer">${escapeHtml(item.insurer)} · ${escapeHtml(item.currency)}</span>
        </td>
        <td>${escapeHtml(item.responsible_name)}</td>
        <td>${stateMarkup(item.state)}</td>
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
    const managementTypes = Array.isArray(defaultData.management_types) ? defaultData.management_types : [];
    const insuranceTypes = activeCatalogItems('tipos_seguro').map((item) => item.name);
    const insurers = activeCatalogItems('aseguradoras').map((item) => item.name);
    const currencies = activeCatalogItems('monedas').map((item) => item.code);
    const states = activeCatalogItems('estados_expediente').map((item) => item.name);
    const executives = Array.isArray(defaultData.executives) ? defaultData.executives.filter((item) => item.active) : [];

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
    populateSelect(managementSelect, managementTypes, 'Selecciona una gestión');
    populateSelect(insuranceSelect, insuranceTypes, 'Selecciona un tipo de seguro');
    populateSelect(insurerSelect, insurers, 'Selecciona una aseguradora');
    populateSelect(currencySelect, currencies, 'Selecciona una moneda');
    populateSelect(stateSelect, states, 'Selecciona un estado');

    if (responsibleSelect?.tagName === 'SELECT') {
      populateSelect(responsibleSelect, executives, 'Selecciona un responsable', 'user_id', 'name');
    }
  }

  function openCreateDialog() {
    if (!formDialog || !form) return;

    form.reset();
    createOptionsForForm();

    if (!canViewAll && responsibleSelect) {
      responsibleSelect.value = currentUserId;
    }

    if (stateSelect) {
      stateSelect.value = 'Borrador';
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
    const year = new Date().getFullYear();
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
    const managementType = managementSelect?.value || '';
    const insuranceType = insuranceSelect?.value || '';
    const insurer = insurerSelect?.value || '';
    const currency = currencySelect?.value || '';
    const state = stateSelect?.value || '';
    const description = descriptionInput?.value.trim() || '';

    if (!client || !managementType || !insuranceType || !insurer || !currency || !state || !description) {
      window.alert('Completa todos los campos requeridos para crear el expediente.');
      return;
    }

    const created = {
      id: `exp-local-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      code: generateCode(),
      client_id: client.id,
      client_name: client.name,
      client_document: `${client.document_type} ${client.document}`,
      entity_type: client.entity_type,
      management_type: managementType,
      insurance_type: insuranceType,
      insurer,
      currency,
      state,
      responsible_user_id: String(responsible.user_id),
      responsible_name: responsible.name,
      opened_at: currentDateTime().slice(0, 10),
      updated_at: currentDateTime(),
      description,
    };

    expedients.push(created);
    saveExpedients();
    logAction(`Creó expediente ${created.code}`);
    closeFormDialog();
    renderSummary();
    renderTable();
    openDetail(created.id);
  }

  function findVisibleExpedient(expedientId) {
    return visibleExpedients().find((item) => item.id === expedientId) || null;
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
          <p class="eyebrow">EXPEDIENTE ${escapeHtml(item.management_type).toUpperCase()}</p>
        </div>
        ${stateMarkup(item.state)}
      </div>

      <div class="expedient-detail-grid">
        <div><dt>Cliente o entidad</dt><dd>${escapeHtml(item.client_name)}</dd></div>
        <div><dt>Documento</dt><dd>${escapeHtml(item.client_document)}</dd></div>
        <div><dt>Tipo de entidad</dt><dd>${escapeHtml(item.entity_type)}</dd></div>
        <div><dt>Tipo de seguro</dt><dd>${escapeHtml(item.insurance_type)}</dd></div>
        <div><dt>Aseguradora</dt><dd>${escapeHtml(item.insurer)}</dd></div>
        <div><dt>Moneda</dt><dd>${escapeHtml(item.currency)}</dd></div>
        <div><dt>Responsable</dt><dd>${escapeHtml(item.responsible_name)}</dd></div>
        <div><dt>Fecha de apertura</dt><dd>${escapeHtml(formatDate(item.opened_at))}</dd></div>
        <div><dt>Última actualización</dt><dd>${escapeHtml(formatDate(item.updated_at, true))}</dd></div>
      </div>

      <p class="expedient-detail-description">${escapeHtml(item.description)}</p>

      <section class="expedient-detail-state">
        <h3>Actualizar estado</h3>
        <p>El cambio se guarda temporalmente en este navegador y queda registrado en las acciones de la sesión.</p>
        <select id="detail-expedient-state" aria-label="Nuevo estado del expediente">
          ${stateOptions}
        </select>
        <div class="expedient-detail-state-actions">
          <button id="save-expedient-state" class="expedient-primary-button" type="button" data-expedient-id="${escapeHtml(item.id)}">Guardar estado</button>
        </div>
      </section>
    `;

    detailContent.querySelector('#save-expedient-state')?.addEventListener('click', () => {
      const newState = detailContent.querySelector('#detail-expedient-state')?.value || '';
      updateState(item.id, newState);
    });

    detailDialog.showModal();
  }

  function updateState(expedientId, newState) {
    const item = visibleExpedients().find((candidate) => candidate.id === expedientId);
    if (!item || !newState || item.state === newState) {
      return;
    }

    const previousState = item.state;
    item.state = newState;
    item.updated_at = currentDateTime();
    saveExpedients();
    logAction(`Actualizó ${item.code}: ${previousState} → ${newState}`);
    render();
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
    if (insuranceFilter) insuranceFilter.value = '';
    if (insurerFilter) insurerFilter.value = '';
    if (responsibleFilter) responsibleFilter.value = '';
    renderTable();
  }

  [searchInput, stateFilter, insuranceFilter, insurerFilter, responsibleFilter]
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
