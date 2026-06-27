(() => {
  const app = document.getElementById('expedients-app');
  const rawData = document.getElementById('expedient-default-data');
  const rawCatalogs = document.getElementById('expedient-catalog-data');
  if (!app || !rawData || !rawCatalogs) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const parse = (node, fallback) => { try { return JSON.parse(node.textContent || ''); } catch { return fallback; } };
  const esc = (value) => { const el = document.createElement('span'); el.textContent = String(value ?? ''); return el.innerHTML; };
  const notice = (type, message, options = {}) => window.BrokerNotify?.[type]?.(message, options);
  const data = parse(rawData, {});
  const catalogs = window.BrokerDemo?.loadCatalogs ? window.BrokerDemo.loadCatalogs(parse(rawCatalogs, {})).catalogs : parse(rawCatalogs, {});

  let entityStore = window.BrokerDemo?.loadEntities ? window.BrokerDemo.loadEntities(data.entity_defaults || {}) : { entities: data.entity_defaults || { companies: [], consortia: [] } };
  let entities = entityStore.entities || { companies: [], consortia: [] };
  let contacts = window.BrokerDemo?.loadContacts ? window.BrokerDemo.loadContacts(data.contacts || data.entity_defaults?.contacts || []).items : (data.contacts || data.entity_defaults?.contacts || []);
  let expedients = window.BrokerDemo?.loadExpedients ? window.BrokerDemo.loadExpedients(data).items : (data.items || []);

  const summary = {
    total: $('#summary-total'), pending: $('#summary-pending-client'), withoutQuotes: $('#summary-without-quotes'), closed: $('#summary-closed'),
  };
  const search = $('#filter-search'), filterState = $('#filter-state'), filterClient = $('#filter-client'), clear = $('#clear-expedient-filters');
  const body = $('#expedient-table-body'), empty = $('#expedient-empty'), add = $('#add-expedient');
  const formDialog = $('#expedient-form-dialog'), form = $('#expedient-form'), closeForm = $('#expedient-form-close'), cancelForm = $('#expedient-form-cancel');
  const contactSelect = $('#expedient-contact'), clientSelect = $('#expedient-client'), stateSelect = $('#expedient-state'), titleInput = $('#expedient-title'), descriptionInput = $('#expedient-description');
  const quickPanel = $('#quick-contact-panel'), showQuick = $('#show-quick-contact'), cancelQuick = $('#cancel-quick-contact'), saveQuick = $('#save-quick-contact');
  const quickName = $('#quick-contact-name'), quickMobile = $('#quick-contact-mobile'), quickEmail = $('#quick-contact-email'), quickLabel = $('#quick-contact-label'), quickEntity = $('#quick-contact-entity');
  const detailDialog = $('#expedient-detail-dialog'), detail = $('#expedient-detail-content'), closeDetail = $('#expedient-detail-close');

  const now = () => window.BrokerDemo?.limaDateTime?.() || new Date().toISOString().slice(0, 19).replace('T', ' ');
  const today = () => window.BrokerDemo?.limaDate?.() || now().slice(0, 10);
  const dateLabel = (value, time = false) => window.BrokerDemo?.formatPeruDate?.(value, time) || String(value || 'No registrado');
  const active = (items) => (items || []).filter((item) => item?.active !== false);
  const states = () => active(catalogs?.estados_expediente?.items).map((item) => item.name);
  const entityRecords = () => window.BrokerDemo?.entityRecords ? window.BrokerDemo.entityRecords(entities) : [...(entities.companies || []), ...(entities.consortia || [])];
  const entity = (id) => entityRecords().find((item) => String(item.id) === String(id)) || null;
  const contact = (id) => contacts.find((item) => String(item.id) === String(id)) || null;
  const selectedEntityName = (item) => item?.client_name || 'Pendiente de definir';
  const principalRuc = (record) => record?.ruc_principal || record?.principal_ruc || record?.ruc || '';
  const entityInfo = (item) => {
    if (!item?.client_id) return 'Se solicitará antes de registrar una póliza.';
    const found = entity(item.client_id);
    return [found?.entity_type || item.entity_type, principalRuc(found) ? `RUC ${principalRuc(found)}` : item.client_document].filter(Boolean).join(' · ');
  };
  const countQuotes = (item) => Array.isArray(item?.quotes) ? item.quotes.length : 0;
  const slug = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const stateBadge = (state) => `<span class="expedient-state state-${esc(slug(state))}">${esc(state)}</span>`;

  function saveEntities() {
    try { window.BrokerDemo?.writeStorage?.(window.BrokerDemo.keys.entities, entities) || localStorage.setItem('broker_seguros_demo_entities_v1', JSON.stringify(entities)); return true; }
    catch { notice('error', 'No se pudieron recuperar las entidades actualizadas. Recarga la página.', { title: 'Error de almacenamiento', duration: 0 }); return false; }
  }
  function saveContacts() {
    try { localStorage.setItem(window.BrokerDemo?.keys?.contacts || 'broker_seguros_demo_contacts_v1', JSON.stringify(contacts)); return true; }
    catch { notice('error', 'No se pudo guardar el contacto en este navegador.', { title: 'Error de almacenamiento', duration: 0 }); return false; }
  }
  function saveExpedients() {
    try { localStorage.setItem(window.BrokerDemo?.keys?.expedients || 'broker_seguros_demo_expedients_v3', JSON.stringify(expedients)); return true; }
    catch { notice('error', 'No se pudo guardar el expediente en este navegador.', { title: 'Error de almacenamiento', duration: 0 }); return false; }
  }

  function opt(items, placeholder, value = 'id', label = 'name', selected = '') {
    return [`<option value="">${esc(placeholder)}</option>`, ...items.map((item) => `<option value="${esc(item[value])}" ${String(item[value]) === String(selected) ? 'selected' : ''}>${esc(item[label])}</option>`)].join('');
  }
  function contactLabel(item) {
    const links = active(item?.relationships || []);
    const primary = links.find((link) => link.is_primary) || links[0];
    return [item?.full_name, item?.mobile ? `Cel. ${item.mobile}` : '', primary ? entity(primary.entity_id)?.name : '', item?.label].filter(Boolean).join(' · ');
  }
  function activeEntities() { return active(entityRecords()); }
  function contactSuggestions(contactId) {
    const selected = contact(contactId);
    const links = active(selected?.relationships || []).filter((link) => entity(link.entity_id)?.active !== false);
    return links.length === 1 ? links[0].entity_id : '';
  }

  function renderFilters() {
    const previousState = filterState.value, previousClient = filterClient.value;
    filterState.innerHTML = opt(states().map((name) => ({ id: name, name })), 'Todas');
    filterClient.innerHTML = opt([{ id: '__pending__', name: 'Pendiente de definir' }, ...activeEntities()], 'Todos');
    filterState.value = states().includes(previousState) ? previousState : '';
    filterClient.value = activeEntities().some((item) => item.id === previousClient) || previousClient === '__pending__' ? previousClient : '';
  }
  function filtered() {
    const q = String(search.value || '').trim().toLocaleLowerCase('es-PE'), currentState = filterState.value, currentClient = filterClient.value;
    return [...expedients].filter((item) => {
      const haystack = [item.code, item.title, item.description, item.contact_name, item.contact_mobile, item.client_name, item.client_document].join(' ').toLocaleLowerCase('es-PE');
      return !q || haystack.includes(q);
    }).filter((item) => !currentState || item.state === currentState).filter((item) => !currentClient || (currentClient === '__pending__' ? !item.client_id : String(item.client_id) === currentClient)).sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
  }
  function renderTable() {
    const rows = filtered(); empty.hidden = rows.length !== 0;
    body.innerHTML = rows.map((item) => {
      const c = contact(item.contact_id);
      const person = item.contact_name || c?.full_name || 'Contacto pendiente de regularizar';
      const mobile = item.contact_mobile || c?.mobile || 'Sin celular registrado';
      const quotes = countQuotes(item);
      return `<tr><td><span class="expedient-code">${esc(item.code)}</span></td><td><span class="expedient-contact-name">${esc(person)}</span><span class="expedient-contact-meta">${esc(mobile)}</span></td><td><span class="expedient-client-name ${item.client_id ? '' : 'is-pending'}">${esc(selectedEntityName(item))}</span><span class="expedient-client-document">${esc(entityInfo(item))}</span></td><td><span class="expedient-title">${esc(item.title)}</span></td><td>${stateBadge(item.state)}</td><td><span class="expedient-quote-count ${quotes ? 'has-quotes' : ''}">${quotes === 1 ? '1 cotización' : `${quotes} cotizaciones`}</span></td><td>${esc(dateLabel(item.updated_at, true))}</td><td><button class="expedient-row-button" type="button" data-id="${esc(item.id)}">Ver ficha</button></td></tr>`;
    }).join('');
    $$('[data-id]', body).forEach((button) => button.onclick = () => openDetail(button.dataset.id));
  }
  function render() {
    summary.total.textContent = expedients.length;
    summary.pending.textContent = expedients.filter((item) => !item.client_id).length;
    summary.withoutQuotes.textContent = expedients.filter((item) => !countQuotes(item)).length;
    summary.closed.textContent = expedients.filter((item) => item.state === 'Cerrado').length;
    renderFilters(); renderTable();
  }

  function formOptions(selectedContact = '', selectedClient = '') {
    contactSelect.innerHTML = opt(active(contacts).map((item) => ({ id: item.id, name: contactLabel(item) })), 'Selecciona un contacto de gestión', 'id', 'name', selectedContact);
    clientSelect.innerHTML = opt(activeEntities(), 'Pendiente de definir', 'id', 'name', selectedClient);
    stateSelect.innerHTML = opt(states().map((name) => ({ id: name, name })), 'Abierto', 'id', 'name', 'Abierto');
    quickEntity.innerHTML = opt(activeEntities(), 'Sin entidad vinculada');
  }
  function resetQuick() { [quickName, quickMobile, quickEmail, quickLabel].forEach((input) => input.value = ''); quickEntity.value = ''; }
  function toggleQuick(show) { quickPanel.hidden = !show; if (show) quickName.focus(); else resetQuick(); }
  function openCreate() { form.reset(); formOptions(); stateSelect.value = 'Abierto'; toggleQuick(false); formDialog.showModal(); contactSelect.focus(); }
  function closeCreate() { toggleQuick(false); formDialog.close(); }

  function createQuickContact() {
    const fullName = quickName.value.trim(), mobile = quickMobile.value.trim();
    if (!fullName || !mobile) return notice('warning', 'Para crear el contacto rápido completa nombre y celular.', { title: 'Faltan datos obligatorios' });
    const related = entity(quickEntity.value), label = quickLabel.value.trim();
    const item = { id: `contact-local-${Date.now()}`, full_name: fullName, mobile, email: quickEmail.value.trim(), document_type: '', document: '', label, observations: '', active: true, relationships: related ? [{ id: `rel-${Date.now()}`, entity_id: related.id, label, is_primary: true, active: true }] : [] };
    contacts.push(item);
    if (!saveContacts()) { contacts.pop(); return; }
    formOptions(item.id); contactSelect.value = item.id;
    if (related) clientSelect.value = related.id;
    toggleQuick(false);
    notice('success', `${item.full_name} quedó registrado y seleccionado. El cambio se guarda temporalmente en este navegador.`, { title: 'Contacto registrado' });
  }

  function suggestedClient() { const id = contactSuggestions(contactSelect.value); if (id && !clientSelect.value) clientSelect.value = id; }
  function nextCode() { const year = window.BrokerDemo?.limaYear?.() || new Date().getFullYear(), p = `EXP-${year}-`; const numbers = expedients.filter((item) => String(item.code).startsWith(p)).map((item) => Number(String(item.code).slice(p.length))).filter(Number.isFinite); return `${p}${String((numbers.length ? Math.max(...numbers) : 0) + 1).padStart(4, '0')}`; }
  function submitCreate(event) {
    event.preventDefault();
    const c = contact(contactSelect.value), e = entity(clientSelect.value), title = titleInput.value.trim(), description = descriptionInput.value.trim();
    if (!c || !title || !description) return notice('warning', 'Completa contacto de gestión, nombre y descripción.', { title: 'Faltan datos esenciales' });
    const item = { id: `exp-local-${Date.now()}`, code: nextCode(), title, description, contact_id: c.id, contact_name: c.full_name, contact_mobile: c.mobile, client_id: e?.id || '', client_name: e?.name || '', client_document: principalRuc(e) ? `RUC ${principalRuc(e)}` : '', entity_type: e?.entity_type || '', state: stateSelect.value || 'Abierto', opened_at: today(), updated_at: now(), quotes: [], legacy_assigned_executive_user_id: '', legacy_assigned_executive_name: '' };
    expedients.push(item); if (!saveExpedients()) { expedients.pop(); return; }
    closeCreate(); render(); notice('success', `${item.code} fue creado. Puede continuar con cliente pendiente y sin cotización o póliza.`, { title: 'Expediente creado' }); openDetail(item.id);
  }

  function detailsOptions(selected, list, placeholder, kind = 'entity') {
    return opt(list, placeholder, 'id', kind === 'contact' ? 'label' : 'name', selected);
  }
  function openDetail(id) {
    const item = expedients.find((record) => record.id === id); if (!item) return;
    const c = contact(item.contact_id), quotes = countQuotes(item), contactChoices = active(contacts).map((record) => ({ id: record.id, label: contactLabel(record) }));
    detail.innerHTML = `<div class="expedient-detail-header"><div><p class="expedient-detail-code">${esc(item.code)}</p><h3 class="expedient-detail-title">${esc(item.title)}</h3></div>${stateBadge(item.state)}</div><div class="expedient-detail-grid"><div><dt>Contacto de gestión</dt><dd>${esc(item.contact_name || c?.full_name || 'Pendiente')}</dd></div><div><dt>Celular</dt><dd>${esc(item.contact_mobile || c?.mobile || 'No registrado')}</dd></div><div><dt>Cliente o entidad</dt><dd>${esc(selectedEntityName(item))}</dd></div><div><dt>Referencia</dt><dd>${esc(entityInfo(item))}</dd></div><div><dt>Apertura</dt><dd>${esc(dateLabel(item.opened_at))}</dd></div><div><dt>Última actualización</dt><dd>${esc(dateLabel(item.updated_at, true))}</dd></div></div><p class="expedient-detail-description">${esc(item.description)}</p><section class="expedient-quotes-placeholder"><h3>Cotizaciones y pólizas</h3><p>${quotes ? `Tiene ${quotes} cotización(es) vinculada(s).` : 'No tiene cotizaciones. Es válido: puede continuar o cerrarse sin cotización, seguro, póliza, pago o documento.'}</p></section><section class="expedient-detail-edit"><h3>Actualizar información</h3><p>El contacto, nombre y descripción se mantienen como datos esenciales. El cliente puede quedar pendiente.</p><div class="expedient-form-grid"><label>Contacto de gestión *<select id="d-contact">${detailsOptions(item.contact_id, contactChoices, 'Selecciona un contacto', 'contact')}</select></label><label>Cliente o entidad<select id="d-client">${detailsOptions(item.client_id, activeEntities(), 'Pendiente de definir')}</select></label><label>Situación<select id="d-state">${detailsOptions(item.state, states().map((name) => ({ id: name, name })), 'Abierto')}</select></label><label>Nombre del expediente *<input id="d-title" maxlength="140" value="${esc(item.title)}"></label></div><label class="expedient-description-field">Descripción o detalle *<textarea id="d-description" rows="4" maxlength="800">${esc(item.description)}</textarea></label><div class="expedient-detail-state-actions"><button id="save-detail" class="expedient-primary-button" type="button">Guardar cambios</button></div></section>`;
    $('#save-detail', detail).onclick = () => updateDetail(item.id);
    if (!detailDialog.open) detailDialog.showModal();
  }
  function updateDetail(id) {
    const item = expedients.find((record) => record.id === id), c = contact($('#d-contact', detail).value), e = entity($('#d-client', detail).value), title = $('#d-title', detail).value.trim(), description = $('#d-description', detail).value.trim();
    if (!item || !c || !title || !description) return notice('warning', 'Completa contacto de gestión, nombre y descripción antes de guardar.', { title: 'Faltan datos esenciales' });
    Object.assign(item, { contact_id: c.id, contact_name: c.full_name, contact_mobile: c.mobile, client_id: e?.id || '', client_name: e?.name || '', client_document: principalRuc(e) ? `RUC ${principalRuc(e)}` : '', entity_type: e?.entity_type || '', state: $('#d-state', detail).value || 'Abierto', title, description, updated_at: now() });
    if (!saveExpedients()) return; render(); notice('success', `${item.code} fue actualizado temporalmente en este navegador.`, { title: 'Expediente actualizado' }); openDetail(item.id);
  }

  search.oninput = renderTable; filterState.onchange = renderTable; filterClient.onchange = renderTable;
  clear.onclick = () => { search.value = ''; filterState.value = ''; filterClient.value = ''; renderTable(); notice('info', 'Se limpiaron los filtros.', { title: 'Filtros restablecidos' }); };
  add.onclick = openCreate; form.onsubmit = submitCreate; closeForm.onclick = closeCreate; cancelForm.onclick = closeCreate; closeDetail.onclick = () => detailDialog.close();
  showQuick.onclick = () => toggleQuick(true); cancelQuick.onclick = () => toggleQuick(false); saveQuick.onclick = createQuickContact; contactSelect.onchange = suggestedClient;
  render();
})();
