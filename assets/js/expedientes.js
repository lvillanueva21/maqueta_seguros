(() => {
  const app = document.getElementById('expedients-app');
  const rawExpedientData = document.getElementById('expedient-default-data');
  const rawCatalogData = document.getElementById('expedient-catalog-data');

  if (!app || !rawExpedientData || !rawCatalogData) return;

  const summaryTotal = document.getElementById('summary-total');
  const summaryPendingClient = document.getElementById('summary-pending-client');
  const summaryWithoutQuotes = document.getElementById('summary-without-quotes');
  const summaryClosed = document.getElementById('summary-closed');
  const contextText = document.getElementById('expedients-context-text');

  const searchInput = document.getElementById('filter-search');
  const stateFilter = document.getElementById('filter-state');
  const clientFilter = document.getElementById('filter-client');
  const clearFiltersButton = document.getElementById('clear-expedient-filters');
  const tableBody = document.getElementById('expedient-table-body');
  const emptyMessage = document.getElementById('expedient-empty');
  const addButton = document.getElementById('add-expedient');

  const formDialog = document.getElementById('expedient-form-dialog');
  const form = document.getElementById('expedient-form');
  const formClose = document.getElementById('expedient-form-close');
  const formCancel = document.getElementById('expedient-form-cancel');
  const contactSelect = document.getElementById('expedient-contact');
  const clientSelect = document.getElementById('expedient-client');
  const stateSelect = document.getElementById('expedient-state');
  const titleInput = document.getElementById('expedient-title');
  const descriptionInput = document.getElementById('expedient-description');

  const quickContactPanel = document.getElementById('quick-contact-panel');
  const showQuickContactButton = document.getElementById('show-quick-contact');
  const cancelQuickContactButton = document.getElementById('cancel-quick-contact');
  const saveQuickContactButton = document.getElementById('save-quick-contact');
  const quickContactName = document.getElementById('quick-contact-name');
  const quickContactMobile = document.getElementById('quick-contact-mobile');
  const quickContactEmail = document.getElementById('quick-contact-email');
  const quickContactLabel = document.getElementById('quick-contact-label');
  const quickContactEntity = document.getElementById('quick-contact-entity');

  const detailDialog = document.getElementById('expedient-detail-dialog');
  const detailContent = document.getElementById('expedient-detail-content');
  const detailClose = document.getElementById('expedient-detail-close');

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

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  const defaultData = readJson(rawExpedientData, {});
  const defaultCatalogData = readJson(rawCatalogData, {});
  const catalogData = window.BrokerDemo?.loadCatalogs
    ? window.BrokerDemo.loadCatalogs(defaultCatalogData).catalogs
    : defaultCatalogData;

  let contacts = window.BrokerDemo?.loadContacts
    ? window.BrokerDemo.loadContacts(defaultData.contacts || []).items
    : clone(Array.isArray(defaultData.contacts) ? defaultData.contacts : []);

  let expedients = window.BrokerDemo?.loadExpedients
    ? window.BrokerDemo.loadExpedients(defaultData).items
    : clone(Array.isArray(defaultData.items) ? defaultData.items : []);

  function currentDateTime() {
    return window.BrokerDemo?.limaDateTime?.() || new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  function formatDate(value, includeTime = false) {
    return window.BrokerDemo?.formatPeruDate?.(value, includeTime) || String(value || 'No registrado');
  }

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

  function activeCatalogItems(catalogId) {
    const items = catalogData?.[catalogId]?.items;
    return Array.isArray(items)
      ? items.filter((item) => String(item.status).toLowerCase() === 'activo')
      : [];
  }

  function activeContacts() {
    return contacts
      .filter((contact) => contact?.active !== false)
      .sort((first, second) => String(first.full_name).localeCompare(String(second.full_name), 'es-PE'));
  }

  function findContact(contactId) {
    return contacts.find((contact) => String(contact.id) === String(contactId)) || null;
  }

  function findClient(clientId) {
    return (Array.isArray(defaultData.clients) ? defaultData.clients : [])
      .find((client) => String(client.id) === String(clientId)) || null;
  }

  function contactLabel(contact) {
    if (!contact) return 'Contacto pendiente de registrar';
    const relationship = Array.isArray(contact.relationships) ? contact.relationships[0] : null;
    return [
      contact.full_name,
      contact.mobile ? `Cel. ${contact.mobile}` : '',
      contact.label || relationship?.label || '',
    ].filter(Boolean).join(' · ');
  }

  function clientLabel(item) {
    return item?.client_name || 'Pendiente de definir';
  }

  function clientSecondary(item) {
    if (!item?.client_name) return 'Se solicitará antes de registrar una póliza.';
    return [item.entity_type, item.client_document].filter(Boolean).join(' · ');
  }

  function quoteCount(item) {
    return Array.isArray(item?.quotes) ? item.quotes.length : 0;
  }

  function saveContacts() {
    try {
      const key = window.BrokerDemo?.keys?.contacts || 'broker_seguros_demo_contacts_v1';
      localStorage.setItem(key, JSON.stringify(contacts));
      return true;
    } catch (error) {
      notify('error', 'No se pudo guardar el contacto en este navegador. Libera espacio del sitio o intenta nuevamente.', {
        title: 'Error de almacenamiento',
        duration: 0,
      });
      return false;
    }
  }

  function saveExpedients() {
    try {
      const key = window.BrokerDemo?.keys?.expedients || 'broker_seguros_demo_expedients_v3';
      localStorage.setItem(key, JSON.stringify(expedients));
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
      // El módulo sigue funcionando aunque falle el registro temporal.
    }
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

  function stateMarkup(state) {
    return `<span class="expedient-state state-${escapeHtml(slugify(state))}">${escapeHtml(state)}</span>`;
  }

  function quoteCountMarkup(item) {
    const count = quoteCount(item);
    const label = count === 1 ? '1 cotización' : `${count} cotizaciones`;
    return `<span class="expedient-quote-count ${count > 0 ? 'has-quotes' : ''}">${escapeHtml(label)}</span>`;
  }

  function visibleExpedients() {
    return [...expedients];
  }

  function normalized(value) {
    return String(value || '').toLocaleLowerCase('es-PE');
  }

  function filteredExpedients() {
    const search = normalized(searchInput?.value);
    const state = stateFilter?.value || '';
    const client = clientFilter?.value || '';

    return visibleExpedients()
      .filter((item) => {
        const searchable = [
          item.code,
          item.title,
          item.description,
          item.contact_name,
          item.contact_mobile,
          item.client_name,
          item.client_document,
        ].map(normalized).join(' ');

        return !search || searchable.includes(search);
      })
      .filter((item) => !state || item.state === state)
      .filter((item) => {
        if (!client) return true;
        if (client === '__pending__') return !item.client_id;
        return String(item.client_id) === client;
      })
      .sort((first, second) => String(second.updated_at).localeCompare(String(first.updated_at)));
  }

  function renderSummary() {
    const visible = visibleExpedients();
    summaryTotal.textContent = String(visible.length);
    summaryPendingClient.textContent = String(visible.filter((item) => !item.client_id).length);
    summaryWithoutQuotes.textContent = String(visible.filter((item) => quoteCount(item) === 0).length);
    summaryClosed.textContent = String(visible.filter((item) => item.state === 'Cerrado').length);
    contextText.textContent = 'Gerentes y ejecutivos pueden consultar y trabajar sobre todos los expedientes. Los datos demo se guardan únicamente en este navegador.';
  }

  function renderTable() {
    const items = filteredExpedients();
    emptyMessage.hidden = items.length !== 0;

    if (items.length === 0) {
      tableBody.innerHTML = '';
      return;
    }

    tableBody.innerHTML = items.map((item) => {
      const contact = findContact(item.contact_id);
      const contactName = item.contact_name || contact?.full_name || 'Pendiente de registrar';
      const contactMobile = item.contact_mobile || contact?.mobile || 'Contacto pendiente de regularizar';
      const clientPendingClass = item.client_name ? '' : 'is-pending';

      return `
        <tr>
          <td><span class="expedient-code">${escapeHtml(item.code)}</span></td>
          <td>
            <span class="expedient-contact-name">${escapeHtml(contactName)}</span>
            <span class="expedient-contact-meta">${escapeHtml(contactMobile)}</span>
          </td>
          <td>
            <span class="expedient-client-name ${clientPendingClass}">${escapeHtml(clientLabel(item))}</span>
            <span class="expedient-client-document">${escapeHtml(clientSecondary(item))}</span>
          </td>
          <td><span class="expedient-title">${escapeHtml(item.title)}</span></td>
          <td>${stateMarkup(item.state)}</td>
          <td>${quoteCountMarkup(item)}</td>
          <td>${escapeHtml(formatDate(item.updated_at, true))}</td>
          <td><button class="expedient-row-button" type="button" data-expedient-id="${escapeHtml(item.id)}">Ver ficha</button></td>
        </tr>
      `;
    }).join('');

    tableBody.querySelectorAll('[data-expedient-id]').forEach((button) => {
      button.addEventListener('click', () => openDetail(button.dataset.expedientId || ''));
    });
  }

  function render() {
    renderSummary();
    renderTable();
  }

  function initializeFilters() {
    const states = activeCatalogItems('estados_expediente').map((item) => item.name);
    const clients = Array.isArray(defaultData.clients) ? defaultData.clients : [];

    populateSelect(stateFilter, states, 'Todas');
    populateSelect(clientFilter, [{ id: '__pending__', name: 'Pendiente de definir' }, ...clients], 'Todos', 'id', 'name');
  }

  function createOptionsForForm() {
    const contactsForSelect = activeContacts().map((contact) => ({ id: contact.id, label: contactLabel(contact) }));
    const clients = Array.isArray(defaultData.clients) ? defaultData.clients : [];
    const states = activeCatalogItems('estados_expediente').map((item) => item.name);

    populateSelect(contactSelect, contactsForSelect, 'Selecciona un contacto de gestión', 'id', 'label');
    populateSelect(clientSelect, clients, 'Pendiente de definir', 'id', 'name');
    populateSelect(stateSelect, states, 'Abierto');
    populateSelect(quickContactEntity, clients, 'Sin entidad vinculada', 'id', 'name');
  }

  function clearQuickContact() {
    [quickContactName, quickContactMobile, quickContactEmail, quickContactLabel].forEach((input) => {
      if (input) input.value = '';
    });
    if (quickContactEntity) quickContactEntity.value = '';
  }

  function setQuickContactVisible(isVisible) {
    if (!quickContactPanel) return;
    quickContactPanel.hidden = !isVisible;
    if (isVisible) quickContactName?.focus();
    else clearQuickContact();
  }

  function openCreateDialog() {
    if (!formDialog || !form) return;
    form.reset();
    createOptionsForForm();
    if (stateSelect) stateSelect.value = 'Abierto';
    setQuickContactVisible(false);
    formDialog.showModal();
    contactSelect?.focus();
  }

  function closeFormDialog() {
    setQuickContactVisible(false);
    if (formDialog?.open) formDialog.close();
  }

  function createContactId() {
    return `contact-local-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
  }

  function handleQuickContact() {
    const fullName = String(quickContactName?.value || '').trim();
    const mobile = String(quickContactMobile?.value || '').trim();
    const email = String(quickContactEmail?.value || '').trim();
    const label = String(quickContactLabel?.value || '').trim();
    const linkedEntity = findClient(quickContactEntity?.value || '');

    if (!fullName || !mobile) {
      notify('warning', 'Para registrar el contacto necesitas como mínimo nombre completo y celular.', {
        title: 'Faltan datos del contacto',
      });
      return;
    }

    const contact = {
      id: createContactId(),
      full_name: fullName,
      mobile,
      email,
      document_type: '',
      document: '',
      label,
      relationships: linkedEntity
        ? [{ entity_id: linkedEntity.id, entity_name: linkedEntity.name, entity_type: linkedEntity.entity_type, label }]
        : [],
      active: true,
    };

    contacts.push(contact);

    if (!saveContacts()) {
      contacts = contacts.filter((candidate) => candidate.id !== contact.id);
      return;
    }

    createOptionsForForm();
    if (contactSelect) contactSelect.value = contact.id;
    setQuickContactVisible(false);
    notify('success', `${contact.full_name} fue registrado y seleccionado como contacto de gestión. El cambio quedó guardado temporalmente solo en este navegador mientras no exista MySQL.`, {
      title: 'Contacto registrado',
    });
  }

  function selectedContact() {
    return findContact(contactSelect?.value || '');
  }

  function selectedClient() {
    return findClient(clientSelect?.value || '');
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

  function refreshExpedientsFromStorage() {
    const latest = window.BrokerDemo?.loadExpedients?.(defaultData).items;
    if (!Array.isArray(latest)) return;

    const byId = new Map(expedients.map((item) => [item.id, item]));
    latest.forEach((item) => byId.set(item.id, item));
    expedients = [...byId.values()];
  }

  function handleCreate(event) {
    event.preventDefault();

    const contact = selectedContact();
    const client = selectedClient();
    const state = stateSelect?.value || 'Abierto';
    const title = String(titleInput?.value || '').trim();
    const description = String(descriptionInput?.value || '').trim();

    if (!contact || !title || !description) {
      notify('warning', 'Completa el contacto de gestión, nombre y descripción antes de crear el expediente.', {
        title: 'Faltan datos esenciales',
      });
      return;
    }

    refreshExpedientsFromStorage();

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
      title,
      description,
      contact_id: contact.id,
      contact_name: contact.full_name,
      contact_mobile: contact.mobile,
      client_id: client?.id || '',
      client_name: client?.name || '',
      client_document: client ? `${client.document_type} ${client.document}` : '',
      entity_type: client?.entity_type || '',
      state,
      opened_at: window.BrokerDemo?.limaDate?.() || currentDateTime().slice(0, 10),
      updated_at: currentDateTime(),
      quotes: [],
      legacy_assigned_executive_user_id: '',
      legacy_assigned_executive_name: '',
    };

    expedients.push(created);

    if (!saveExpedients()) {
      expedients = expedients.filter((item) => item.id !== created.id);
      return;
    }

    logAction(`Creó expediente ${created.code}`);
    closeFormDialog();
    render();
    notify('success', `El expediente ${created.code} fue creado y guardado temporalmente solo en este navegador mientras no exista MySQL. Puede continuar sin cliente, cotización, seguro o póliza.`, {
      title: 'Expediente creado',
    });
    openDetail(created.id);
  }

  function quotePlaceholderMarkup(item) {
    const count = quoteCount(item);
    if (count === 0) {
      return `
        <section class="expedient-quotes-placeholder">
          <h3>Cotizaciones y pólizas</h3>
          <p>Este expediente no tiene cotizaciones vinculadas. Es válido: puede continuar o cerrarse sin cotización, seguro, póliza, pago o documento.</p>
          <p class="expedient-quote-placeholder-status">Las cotizaciones, pólizas, requisitos, documentos y otros datos se agregarán en módulos posteriores sin obligar un flujo rígido.</p>
        </section>
      `;
    }

    return `
      <section class="expedient-quotes-placeholder">
        <h3>Cotizaciones y pólizas</h3>
        <p>Este expediente tiene ${count === 1 ? '1 cotización vinculada' : `${count} cotizaciones vinculadas`}. El detalle se habilitará en un módulo posterior.</p>
      </section>
    `;
  }

  function detailContactOptions(selectedId) {
    return activeContacts().map((contact) => (
      `<option value="${escapeHtml(contact.id)}" ${String(contact.id) === String(selectedId) ? 'selected' : ''}>${escapeHtml(contactLabel(contact))}</option>`
    )).join('');
  }

  function detailClientOptions(selectedId) {
    const clients = Array.isArray(defaultData.clients) ? defaultData.clients : [];
    return [
      '<option value="">Pendiente de definir</option>',
      ...clients.map((client) => (
        `<option value="${escapeHtml(client.id)}" ${String(client.id) === String(selectedId) ? 'selected' : ''}>${escapeHtml(client.name)}</option>`
      )),
    ].join('');
  }

  function detailStateOptions(selectedState) {
    return activeCatalogItems('estados_expediente').map((item) => (
      `<option value="${escapeHtml(item.name)}" ${item.name === selectedState ? 'selected' : ''}>${escapeHtml(item.name)}</option>`
    )).join('');
  }

  function openDetail(expedientId) {
    const item = expedients.find((candidate) => candidate.id === expedientId);
    if (!detailDialog || !detailContent || !item) return;

    const contact = findContact(item.contact_id);
    const contactName = item.contact_name || contact?.full_name || 'Pendiente de registrar';
    const contactMobile = item.contact_mobile || contact?.mobile || 'No registrado';

    detailContent.innerHTML = `
      <div class="expedient-detail-header">
        <div>
          <p class="expedient-detail-code">${escapeHtml(item.code)}</p>
          <h3 class="expedient-detail-title">${escapeHtml(item.title)}</h3>
        </div>
        ${stateMarkup(item.state)}
      </div>

      <div class="expedient-detail-grid">
        <div><dt>Contacto de gestión</dt><dd>${escapeHtml(contactName)}</dd></div>
        <div><dt>Celular de contacto</dt><dd>${escapeHtml(contactMobile)}</dd></div>
        <div><dt>Cliente o entidad</dt><dd>${escapeHtml(clientLabel(item))}</dd></div>
        <div><dt>Referencia de entidad</dt><dd>${escapeHtml(clientSecondary(item))}</dd></div>
        <div><dt>Fecha de apertura</dt><dd>${escapeHtml(formatDate(item.opened_at))}</dd></div>
        <div><dt>Última actualización</dt><dd>${escapeHtml(formatDate(item.updated_at, true))}</dd></div>
      </div>

      <p class="expedient-detail-description">${escapeHtml(item.description)}</p>
      ${quotePlaceholderMarkup(item)}

      <section class="expedient-detail-edit">
        <h3>Actualizar información</h3>
        <p>Completa o corrige los datos cuando corresponda. El cliente puede seguir pendiente, pero el contacto, nombre y detalle deben mantenerse definidos.</p>

        <div class="expedient-form-grid">
          <label>
            <span>Contacto de gestión <b aria-hidden="true">*</b></span>
            <select id="detail-expedient-contact">
              <option value="">Selecciona un contacto de gestión</option>
              ${detailContactOptions(item.contact_id)}
            </select>
          </label>
          <label>
            <span>Cliente o entidad</span>
            <select id="detail-expedient-client">${detailClientOptions(item.client_id)}</select>
          </label>
          <label>
            <span>Situación</span>
            <select id="detail-expedient-state">${detailStateOptions(item.state)}</select>
          </label>
          <label>
            <span>Nombre del expediente <b aria-hidden="true">*</b></span>
            <input id="detail-expedient-title" type="text" maxlength="140" value="${escapeHtml(item.title)}">
          </label>
        </div>

        <label class="expedient-description-field">
          <span>Descripción o detalle <b aria-hidden="true">*</b></span>
          <textarea id="detail-expedient-description" rows="4" maxlength="800">${escapeHtml(item.description)}</textarea>
        </label>

        <div class="expedient-detail-state-actions">
          <button id="save-expedient-details" class="expedient-primary-button" type="button" data-expedient-id="${escapeHtml(item.id)}">Guardar cambios</button>
        </div>
      </section>
    `;

    detailContent.querySelector('#save-expedient-details')?.addEventListener('click', () => updateExpedient(item.id));
    if (!detailDialog.open) detailDialog.showModal();
  }

  function updateExpedient(expedientId) {
    const item = expedients.find((candidate) => candidate.id === expedientId);
    if (!item || !detailContent) return;

    const contactId = detailContent.querySelector('#detail-expedient-contact')?.value || '';
    const clientId = detailContent.querySelector('#detail-expedient-client')?.value || '';
    const state = detailContent.querySelector('#detail-expedient-state')?.value || 'Abierto';
    const title = String(detailContent.querySelector('#detail-expedient-title')?.value || '').trim();
    const description = String(detailContent.querySelector('#detail-expedient-description')?.value || '').trim();
    const contact = findContact(contactId);
    const client = findClient(clientId);

    if (!contact || !title || !description) {
      notify('warning', 'Completa contacto de gestión, nombre y descripción antes de guardar.', {
        title: 'Faltan datos esenciales',
      });
      return;
    }

    const next = {
      contact_id: contact.id,
      contact_name: contact.full_name,
      contact_mobile: contact.mobile,
      client_id: client?.id || '',
      client_name: client?.name || '',
      client_document: client ? `${client.document_type} ${client.document}` : '',
      entity_type: client?.entity_type || '',
      state,
      title,
      description,
    };

    const changed = Object.entries(next).some(([key, value]) => String(item[key] || '') !== String(value || ''));
    if (!changed) {
      notify('info', `${item.code} no tiene cambios por guardar.`, { title: 'Sin cambios' });
      return;
    }

    const backup = { ...item };
    Object.assign(item, next, { updated_at: currentDateTime() });

    if (!saveExpedients()) {
      Object.assign(item, backup);
      return;
    }

    logAction(`Actualizó expediente ${item.code}`);
    render();
    notify('success', `Los cambios de ${item.code} quedaron guardados temporalmente solo en este navegador mientras no exista MySQL.`, {
      title: 'Expediente actualizado',
    });
    openDetail(item.id);
  }

  function closeDetailDialog() {
    if (detailDialog?.open) detailDialog.close();
  }

  function clearFilters() {
    if (searchInput) searchInput.value = '';
    if (stateFilter) stateFilter.value = '';
    if (clientFilter) clientFilter.value = '';
    renderTable();
    notify('info', 'Se limpiaron los filtros del listado.', {
      title: 'Filtros restablecidos',
      duration: 3200,
    });
  }

  [searchInput, stateFilter, clientFilter]
    .filter(Boolean)
    .forEach((input) => input.addEventListener('input', renderTable));

  addButton?.addEventListener('click', openCreateDialog);
  form?.addEventListener('submit', handleCreate);
  formClose?.addEventListener('click', closeFormDialog);
  formCancel?.addEventListener('click', closeFormDialog);
  detailClose?.addEventListener('click', closeDetailDialog);
  clearFiltersButton?.addEventListener('click', clearFilters);
  showQuickContactButton?.addEventListener('click', () => setQuickContactVisible(true));
  cancelQuickContactButton?.addEventListener('click', () => setQuickContactVisible(false));
  saveQuickContactButton?.addEventListener('click', handleQuickContact);

  initializeFilters();
  createOptionsForForm();
  render();
})();
