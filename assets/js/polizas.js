(() => {
  const POLICY_ASSET_VERSION = 'BS-20260627-183503-PET';
  const EXPEDIENTS_KEY = 'broker_seguros_demo_expedients_v3';
  const POLICY_DIALOG_ID = 'policy-form-dialog';
  const DEACTIVATE_DIALOG_ID = 'policy-deactivate-dialog';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => {
    const node = document.createElement('span');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  };
  const notify = (type, message, options = {}) => window.BrokerNotify?.[type]?.(message, options);

  function installStyles() {
    if (document.querySelector('link[data-policy-styles]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `assets/css/polizas.css?v=${POLICY_ASSET_VERSION}`;
    link.dataset.policyStyles = 'true';
    document.head.appendChild(link);
  }

  function safeJson(value, fallback) {
    try { return JSON.parse(value); } catch { return fallback; }
  }

  function limaNow() {
    return window.BrokerDemo?.limaDateTime?.() || new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  function limaInputNow() {
    return limaNow().slice(0, 16).replace(' ', 'T');
  }

  function formatDate(value, includeTime = false) {
    return window.BrokerDemo?.formatPeruDate?.(value, includeTime) || String(value || 'No registrado');
  }

  function toStorageDate(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    return `${text.replace('T', ' ')}:00`;
  }

  function toInputDate(value) {
    const text = String(value || '').trim();
    return text ? text.slice(0, 16).replace(' ', 'T') : '';
  }

  function installExpedientStorageGuard() {
    if (window.__brokerPolicyStorageGuardInstalled) return;
    window.__brokerPolicyStorageGuardInstalled = true;

    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      const targetKey = window.BrokerDemo?.keys?.expedients || EXPEDIENTS_KEY;

      if (this !== localStorage || key !== targetKey) {
        return originalSetItem.call(this, key, value);
      }

      const incoming = safeJson(value, null);
      const current = safeJson(localStorage.getItem(targetKey) || '[]', []);

      if (Array.isArray(incoming) && Array.isArray(current)) {
        incoming.forEach((expedient) => {
          const saved = current.find((item) => String(item.id) === String(expedient?.id));
          const incomingPolicies = Array.isArray(expedient?.policies) ? expedient.policies : [];
          const savedPolicies = Array.isArray(saved?.policies) ? saved.policies : [];

          if (!savedPolicies.length) return;

          const merged = new Map(incomingPolicies.map((policy) => [String(policy.id), policy]));
          savedPolicies.forEach((policy) => {
            const existing = merged.get(String(policy.id));
            if (!existing || String(policy.updated_at || '') > String(existing.updated_at || '')) {
              merged.set(String(policy.id), policy);
            }
          });

          expedient.policies = [...merged.values()];
        });

        value = JSON.stringify(incoming);
      }

      return originalSetItem.call(this, key, value);
    };
  }

  function readExpedients() {
    const raw = localStorage.getItem(window.BrokerDemo?.keys?.expedients || EXPEDIENTS_KEY);
    const records = safeJson(raw, []);
    return Array.isArray(records) ? records : [];
  }

  function writeExpedients(records) {
    try {
      localStorage.setItem(window.BrokerDemo?.keys?.expedients || EXPEDIENTS_KEY, JSON.stringify(records));
      return true;
    } catch {
      notify('error', 'No se pudo guardar la póliza en este navegador. Libera espacio del sitio e intenta nuevamente.', {
        title: 'Error de almacenamiento',
        duration: 0,
      });
      return false;
    }
  }

  function activeItems(catalogId) {
    const data = safeJson($('#expedient-catalog-data')?.textContent || '{}', {});
    const catalogs = window.BrokerDemo?.loadCatalogs ? window.BrokerDemo.loadCatalogs(data).catalogs : data;
    const items = catalogs?.[catalogId]?.items;
    return Array.isArray(items) ? items.filter((item) => String(item.status) === 'Activo') : [];
  }

  function entityFromCurrent(expedient) {
    const data = safeJson($('#expedient-default-data')?.textContent || '{}', {});
    const entities = window.BrokerDemo?.loadEntities
      ? window.BrokerDemo.loadEntities(data.entity_defaults || {}).entities
      : data.entity_defaults || {};
    const records = window.BrokerDemo?.entityRecords
      ? window.BrokerDemo.entityRecords(entities)
      : [...(entities.companies || []), ...(entities.consortia || [])];
    return records.find((item) => String(item.id) === String(expedient.client_id)) || null;
  }

  function policyList(expedient) {
    return Array.isArray(expedient?.policies) ? expedient.policies : [];
  }

  function nextPolicyCode(records) {
    const year = window.BrokerDemo?.limaYear?.() || new Date().getFullYear();
    const prefix = `POL-${year}-`;
    const numbers = records
      .flatMap((expedient) => policyList(expedient))
      .filter((policy) => String(policy.code).startsWith(prefix))
      .map((policy) => Number(String(policy.code).slice(prefix.length)))
      .filter(Number.isFinite);

    return `${prefix}${String((numbers.length ? Math.max(...numbers) : 0) + 1).padStart(4, '0')}`;
  }

  function displaySize(value) {
    const bytes = Number(value || 0);
    if (!bytes) return 'Tamaño no disponible';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function statusMarkup(status, active) {
    const mode = active === false ? 'policy-status-inactive' : `policy-status-${String(status || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return `<span class="policy-status ${esc(mode)}">${esc(active === false ? 'Desactivada' : status || 'En emisión')}</span>`;
  }

  function findCurrentExpedient() {
    const code = $('#expedient-detail-content .expedient-detail-code')?.textContent?.trim();
    if (!code) return null;
    return readExpedients().find((item) => String(item.code) === code) || null;
  }

  function renderPolicySection() {
    const container = $('#expedient-detail-content');
    if (!container) return;

    container.querySelector('#policy-section')?.remove();

    const expedient = findCurrentExpedient();
    if (!expedient) return;

    const policies = policyList(expedient);
    const canRegister = Boolean(expedient.client_id);
    const section = document.createElement('section');
    section.id = 'policy-section';
    section.className = 'policy-section';

    const rows = policies.length
      ? policies.map((policy) => {
          const documentHtml = policy.file?.relative_path
            ? `<a class="policy-file-link" href="api/view_policy_pdf.php?path=${encodeURIComponent(policy.file.relative_path)}" target="_blank" rel="noopener">PDF: ${esc(policy.file.original_name || 'Abrir documento')}</a>`
            : '<span class="policy-document-missing">Falta PDF de póliza</span>';

          return `<article class="policy-card ${policy.active === false ? 'is-inactive' : ''}">
            <div class="policy-card-heading">
              <div>
                <p class="policy-code">${esc(policy.code)}</p>
                <h4>${esc(policy.title)}</h4>
              </div>
              ${statusMarkup(policy.status, policy.active)}
            </div>
            <dl class="policy-card-grid">
              <div><dt>Tipo de seguro</dt><dd>${esc(policy.insurance_type_name || 'No registrado')}</dd></div>
              <div><dt>Aseguradora</dt><dd>${esc(policy.insurer_name || 'No registrada')}</dd></div>
              <div><dt>Vigencia</dt><dd>${esc(formatDate(policy.starts_at, true))} — ${esc(formatDate(policy.ends_at, true))}</dd></div>
              <div><dt>Suma asegurada</dt><dd>${esc(policy.insured_amount ? `${policy.currency_name ? `${policy.currency_name} ` : ''}${policy.insured_amount}` : 'No registrada')}</dd></div>
            </dl>
            <div class="policy-card-file">${documentHtml}</div>
            ${policy.active === false && policy.deactivation_reason ? `<p class="policy-inactive-note">Motivo de desactivación: ${esc(policy.deactivation_reason)}</p>` : ''}
            <div class="policy-card-actions">
              <button type="button" class="policy-secondary-button" data-policy-action="edit" data-policy-id="${esc(policy.id)}">Ver / editar</button>
              ${policy.active === false
                ? `<button type="button" class="policy-secondary-button" data-policy-action="activate" data-policy-id="${esc(policy.id)}">Reactivar</button>`
                : `<button type="button" class="policy-danger-button" data-policy-action="deactivate" data-policy-id="${esc(policy.id)}">Desactivar</button>`}
            </div>
          </article>`;
        }).join('')
      : '<p class="policy-empty">Aún no existen pólizas registradas. El expediente puede continuar sin póliza, pero ya tiene cliente definido para registrar una cuando corresponda.</p>';

    section.innerHTML = `
      <div class="policy-section-heading">
        <div>
          <p class="eyebrow">PÓLIZAS</p>
          <h3>Pólizas del expediente</h3>
          <p>Las pólizas se registran sin exigir cotización previa. El cliente se conserva como referencia histórica al momento del registro.</p>
        </div>
        <button id="add-policy" class="policy-primary-button" type="button" ${canRegister ? '' : 'disabled'}>+ Registrar póliza</button>
      </div>
      ${canRegister ? '' : '<div class="policy-warning">Define primero el Cliente o entidad en el expediente. Sin cliente no se puede registrar una póliza.</div>'}
      <div class="policy-list">${rows}</div>
    `;

    const editAnchor = container.querySelector('.expedient-detail-edit');
    if (editAnchor) {
      editAnchor.insertAdjacentElement('beforebegin', section);
    } else {
      container.appendChild(section);
    }

    $('#add-policy', section)?.addEventListener('click', () => openPolicyDialog(expedient.id));
    $$('[data-policy-action]', section).forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.policyAction;
        const policy = policyList(findCurrentExpedient()).find((item) => String(item.id) === String(button.dataset.policyId));
        if (!policy) return;
        if (action === 'edit') openPolicyDialog(expedient.id, policy.id);
        if (action === 'deactivate') openDeactivateDialog(expedient.id, policy.id);
        if (action === 'activate') activatePolicy(expedient.id, policy.id);
      });
    });
  }

  function createDialogs() {
    if (!document.getElementById(POLICY_DIALOG_ID)) {
      const dialog = document.createElement('dialog');
      dialog.id = POLICY_DIALOG_ID;
      dialog.className = 'policy-dialog';
      dialog.innerHTML = `
        <form id="policy-form" method="dialog" novalidate>
          <div class="policy-dialog-heading">
            <div>
              <p class="eyebrow">PÓLIZA</p>
              <h2 id="policy-dialog-title">Registrar póliza</h2>
            </div>
            <button id="policy-dialog-close" class="policy-dialog-close" type="button" aria-label="Cerrar">×</button>
          </div>
          <div id="policy-form-content"></div>
          <div class="policy-dialog-actions">
            <button id="policy-dialog-cancel" class="policy-secondary-button" type="button">Cancelar</button>
            <button id="policy-submit" class="policy-primary-button" type="submit">Guardar póliza</button>
          </div>
        </form>`;
      document.body.appendChild(dialog);
    }

    if (!document.getElementById(DEACTIVATE_DIALOG_ID)) {
      const dialog = document.createElement('dialog');
      dialog.id = DEACTIVATE_DIALOG_ID;
      dialog.className = 'policy-dialog policy-danger-dialog';
      dialog.innerHTML = `
        <form id="policy-deactivate-form" method="dialog" novalidate>
          <div class="policy-dialog-heading">
            <div>
              <p class="eyebrow">DESACTIVAR PÓLIZA</p>
              <h2>Conservar antecedente</h2>
            </div>
            <button id="policy-deactivate-close" class="policy-dialog-close" type="button" aria-label="Cerrar">×</button>
          </div>
          <p id="policy-deactivate-message" class="policy-danger-message"></p>
          <label class="policy-field">
            <span>Motivo <b aria-hidden="true">*</b></span>
            <textarea id="policy-deactivate-reason" rows="4" maxlength="400" placeholder="Explica el motivo de la desactivación." required></textarea>
          </label>
          <div class="policy-dialog-actions">
            <button id="policy-deactivate-cancel" class="policy-secondary-button" type="button">Cancelar</button>
            <button class="policy-danger-button" type="submit">Desactivar póliza</button>
          </div>
        </form>`;
      document.body.appendChild(dialog);
    }
  }

  function policyFormMarkup(expedient, policy = null) {
    const insuranceTypes = activeItems('tipos_seguro');
    const insurers = activeItems('aseguradoras');
    const currencies = activeItems('monedas');
    const statuses = activeItems('estados_poliza');
    const currentClient = policy?.client_snapshot || {
      id: expedient.client_id,
      name: expedient.client_name,
      document: expedient.client_document,
      entity_type: expedient.entity_type,
    };

    const options = (items, selected = '', placeholder = 'Selecciona') =>
      [`<option value="">${esc(placeholder)}</option>`, ...items.map((item) =>
        `<option value="${esc(item.id)}" ${String(item.id) === String(selected) ? 'selected' : ''}>${esc(item.name)}</option>`
      )].join('');

    return `
      <input id="policy-expedient-id" type="hidden" value="${esc(expedient.id)}">
      <input id="policy-id" type="hidden" value="${esc(policy?.id || '')}">
      <div class="policy-info-box">
        <strong>Cliente de la póliza</strong>
        <span>${esc(currentClient.name || 'No definido')}</span>
        <small>${esc([currentClient.entity_type, currentClient.document].filter(Boolean).join(' · ') || 'Se conserva desde el expediente')}</small>
      </div>
      <div class="policy-form-grid">
        <label class="policy-field-wide">
          <span>Título <b aria-hidden="true">*</b></span>
          <input id="policy-title" maxlength="160" value="${esc(policy?.title || '')}" placeholder="Ejemplo: SCTR personal de obra" required>
        </label>
        <label>
          <span>Tipo de seguro <b aria-hidden="true">*</b></span>
          <select id="policy-insurance-type" required>${options(insuranceTypes, policy?.insurance_type_id || '', 'Selecciona un tipo')}</select>
        </label>
        <label>
          <span>Aseguradora <b aria-hidden="true">*</b></span>
          <select id="policy-insurer" required>${options(insurers, policy?.insurer_id || '', 'Selecciona una aseguradora')}</select>
        </label>
        <label>
          <span>Estado</span>
          <select id="policy-status">${options(statuses, policy?.status || 'En emisión', 'En emisión')}</select>
        </label>
        <label>
          <span>Fecha y hora de emisión</span>
          <input id="policy-issued-at" type="datetime-local" value="${esc(toInputDate(policy?.issued_at || limaNow()))}">
        </label>
        <label>
          <span>Inicio de vigencia <b aria-hidden="true">*</b></span>
          <input id="policy-starts-at" type="datetime-local" value="${esc(toInputDate(policy?.starts_at || ''))}" required>
        </label>
        <label>
          <span>Fin de vigencia <b aria-hidden="true">*</b></span>
          <input id="policy-ends-at" type="datetime-local" value="${esc(toInputDate(policy?.ends_at || ''))}" required>
        </label>
        <label>
          <span>Suma asegurada</span>
          <input id="policy-insured-amount" inputmode="decimal" maxlength="40" value="${esc(policy?.insured_amount || '')}" placeholder="Ejemplo: 250000.00">
        </label>
        <label>
          <span>Moneda</span>
          <select id="policy-currency">${options(currencies, policy?.currency_id || '', 'Sin moneda definida')}</select>
        </label>
        <label class="policy-field-wide">
          <span>Descripción</span>
          <textarea id="policy-description" rows="3" maxlength="800" placeholder="Descripción complementaria">${esc(policy?.description || '')}</textarea>
        </label>
        <label class="policy-field-wide">
          <span>Observaciones</span>
          <textarea id="policy-observations" rows="3" maxlength="800" placeholder="Información adicional opcional">${esc(policy?.observations || '')}</textarea>
        </label>
      </div>
      <section class="policy-file-box">
        <div>
          <h3>PDF principal de póliza</h3>
          <p>Opcional. La póliza se puede registrar sin PDF, pero quedará advertida como documento pendiente.</p>
        </div>
        ${policy?.file?.relative_path
          ? `<p class="policy-current-file">Actual: <a href="api/view_policy_pdf.php?path=${encodeURIComponent(policy.file.relative_path)}" target="_blank" rel="noopener">${esc(policy.file.original_name || 'Abrir PDF')}</a> · ${esc(displaySize(policy.file.size_bytes))}</p>`
          : '<p class="policy-document-missing">Falta el documento PDF de la póliza.</p>'}
        <label class="policy-file-input">
          <span>Seleccionar PDF ${policy?.file?.relative_path ? 'para reemplazar' : ''}</span>
          <input id="policy-file" type="file" accept="application/pdf,.pdf">
        </label>
        <p id="policy-file-preview" class="policy-file-preview">No se seleccionó un archivo nuevo.</p>
        <div id="policy-upload-progress-wrap" class="policy-upload-progress" hidden>
          <progress id="policy-upload-progress" max="100" value="0"></progress>
          <span id="policy-upload-status">Preparando carga…</span>
        </div>
      </section>
      <p class="policy-lima-note">Las fechas y horas se registran como America/Lima. El sistema valida que el fin de vigencia sea posterior al inicio.</p>
    `;
  }

  function selectedItem(catalogId, id) {
    return activeItems(catalogId).find((item) => String(item.id) === String(id)) || null;
  }

  function openPolicyDialog(expedientId, policyId = '') {
    const expedient = readExpedients().find((item) => String(item.id) === String(expedientId));
    if (!expedient) return;
    if (!expedient.client_id) {
      notify('warning', 'Define primero el Cliente o entidad del expediente antes de registrar una póliza.', {
        title: 'Cliente pendiente',
      });
      return;
    }

    const policy = policyList(expedient).find((item) => String(item.id) === String(policyId)) || null;
    const dialog = document.getElementById(POLICY_DIALOG_ID);
    $('#policy-dialog-title', dialog).textContent = policy ? `Editar ${policy.code}` : 'Registrar póliza';
    $('#policy-form-content', dialog).innerHTML = policyFormMarkup(expedient, policy);
    $('#policy-file', dialog)?.addEventListener('change', () => {
      const file = $('#policy-file', dialog).files?.[0];
      $('#policy-file-preview', dialog).textContent = file
        ? `Seleccionado: ${file.name} · ${displaySize(file.size)}`
        : 'No se seleccionó un archivo nuevo.';
    });
    dialog.showModal();
    $('#policy-title', dialog)?.focus();
  }

  function uploadFile(file, policyCode, insuranceTypeName, previousPath = '') {
    return new Promise((resolve, reject) => {
      const dialog = document.getElementById(POLICY_DIALOG_ID);
      const progressWrap = $('#policy-upload-progress-wrap', dialog);
      const progress = $('#policy-upload-progress', dialog);
      const status = $('#policy-upload-status', dialog);
      const xhr = new XMLHttpRequest();
      const data = new FormData();
      data.append('pdf', file);
      data.append('policy_code', policyCode);
      data.append('insurance_type', insuranceTypeName);
      data.append('previous_path', previousPath);

      progressWrap.hidden = false;
      progress.value = 0;
      status.textContent = 'Iniciando carga del PDF…';

      xhr.open('POST', 'api/upload_policy_pdf.php', true);
      xhr.responseType = 'json';
      xhr.timeout = 0;

      xhr.upload.addEventListener('progress', (event) => {
        if (!event.lengthComputable) {
          status.textContent = 'Subiendo PDF… el servidor aún no informó porcentaje.';
          return;
        }
        const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
        progress.value = percent;
        status.textContent = `Subiendo PDF: ${percent}%`;
      });

      xhr.addEventListener('load', () => {
        const response = xhr.response || safeJson(xhr.responseText || '{}', {});
        if (xhr.status >= 200 && xhr.status < 300 && response.ok) {
          progress.value = 100;
          status.textContent = 'PDF guardado correctamente.';
          resolve(response.file);
          return;
        }
        reject(new Error(response.message || 'El servidor no pudo guardar el PDF.'));
      });

      xhr.addEventListener('error', () => reject(new Error('No se pudo conectar con el servidor durante la carga del PDF.')));
      xhr.addEventListener('timeout', () => reject(new Error('La carga tardó demasiado y fue cancelada por el navegador o servidor.')));
      xhr.send(data);
    });
  }

  function requestDelete(path) {
    return fetch('api/delete_policy_pdf.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', Accept: 'application/json' },
      body: new URLSearchParams({ path }).toString(),
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.ok) throw new Error(payload.message || 'No se pudo eliminar el archivo anterior.');
        return payload;
      });
  }

  function hideUploadProgress() {
    const dialog = document.getElementById(POLICY_DIALOG_ID);
    const box = $('#policy-upload-progress-wrap', dialog);
    if (box) box.hidden = true;
  }

  async function submitPolicy(event) {
    event.preventDefault();
    const dialog = document.getElementById(POLICY_DIALOG_ID);
    const expedientId = $('#policy-expedient-id', dialog).value;
    const policyId = $('#policy-id', dialog).value;
    const records = readExpedients();
    const expedient = records.find((item) => String(item.id) === String(expedientId));
    const policies = policyList(expedient);
    const existing = policies.find((item) => String(item.id) === String(policyId)) || null;
    const title = $('#policy-title', dialog).value.trim();
    const insuranceType = selectedItem('tipos_seguro', $('#policy-insurance-type', dialog).value);
    const insurer = selectedItem('aseguradoras', $('#policy-insurer', dialog).value);
    const startsAt = toStorageDate($('#policy-starts-at', dialog).value);
    const endsAt = toStorageDate($('#policy-ends-at', dialog).value);
    const issuedAt = toStorageDate($('#policy-issued-at', dialog).value);
    const newFile = $('#policy-file', dialog).files?.[0] || null;

    if (!expedient || !expedient.client_id) {
      return notify('warning', 'El expediente ya no tiene cliente definido. Registra o selecciona el cliente antes de guardar la póliza.', {
        title: 'Cliente pendiente',
      });
    }
    if (!title || !insuranceType || !insurer || !startsAt || !endsAt) {
      return notify('warning', 'Completa título, tipo de seguro, aseguradora, inicio y fin de vigencia.', {
        title: 'Faltan datos obligatorios',
      });
    }
    if (endsAt <= startsAt) {
      return notify('error', 'La fecha y hora de fin de vigencia debe ser posterior al inicio.', {
        title: 'Vigencia no válida',
      });
    }
    if (newFile && !/\.pdf$/i.test(newFile.name)) {
      return notify('error', 'Selecciona un archivo PDF válido para la póliza.', {
        title: 'Archivo no válido',
      });
    }

    const submitButton = $('#policy-submit', dialog);
    submitButton.disabled = true;
    submitButton.textContent = newFile ? 'Subiendo PDF…' : 'Guardando póliza…';

    const code = existing?.code || nextPolicyCode(records);
    let file = existing?.file || null;

    try {
      if (newFile) {
        const uploaded = await uploadFile(newFile, code, insuranceType.name, existing?.file?.relative_path || '');
        if (existing?.file?.relative_path) {
          try {
            await requestDelete(existing.file.relative_path);
          } catch (error) {
            try { await requestDelete(uploaded.relative_path); } catch {}
            throw new Error('No se pudo reemplazar el PDF de manera segura. Se mantuvo el archivo anterior. Intenta nuevamente.');
          }
        }
        file = uploaded;
      }

      const currency = selectedItem('monedas', $('#policy-currency', dialog).value);
      const state = selectedItem('estados_poliza', $('#policy-status', dialog).value);
      const client = entityFromCurrent(expedient) || {};
      const item = {
        id: existing?.id || `policy-local-${Date.now()}`,
        code,
        title,
        description: $('#policy-description', dialog).value.trim(),
        insurance_type_id: insuranceType.id,
        insurance_type_name: insuranceType.name,
        insurer_id: insurer.id,
        insurer_name: insurer.name,
        client_snapshot: {
          id: String(expedient.client_id || ''),
          name: String(expedient.client_name || client.name || ''),
          document: String(expedient.client_document || client.ruc_principal || client.ruc || ''),
          entity_type: String(expedient.entity_type || client.entity_type || ''),
        },
        insured_amount: $('#policy-insured-amount', dialog).value.trim(),
        currency_id: currency?.id || '',
        currency_name: currency?.name || '',
        issued_at: issuedAt,
        starts_at: startsAt,
        ends_at: endsAt,
        status: state?.name || 'En emisión',
        observations: $('#policy-observations', dialog).value.trim(),
        file,
        active: existing?.active !== false,
        deactivation_reason: existing?.deactivation_reason || '',
        deactivated_at: existing?.deactivated_at || '',
        created_at: existing?.created_at || limaNow(),
        updated_at: limaNow(),
      };

      if (existing) {
        Object.assign(existing, item);
      } else {
        expedient.policies = policies;
        policies.push(item);
      }
      expedient.updated_at = limaNow();

      if (!writeExpedients(records)) return;
      dialog.close();
      hideUploadProgress();
      renderPolicySection();
      notify('success', `${item.code} fue guardada. ${item.file ? 'El PDF principal quedó asociado.' : 'Queda pendiente adjuntar el PDF de póliza.'}`, {
        title: existing ? 'Póliza actualizada' : 'Póliza registrada',
        placement: 'global',
      });
    } catch (error) {
      notify('error', error.message || 'No se pudo guardar la póliza.', {
        title: 'Error al registrar póliza',
        duration: 0,
      });
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Guardar póliza';
    }
  }

  function openDeactivateDialog(expedientId, policyId) {
    const records = readExpedients();
    const expedient = records.find((item) => String(item.id) === String(expedientId));
    const policy = policyList(expedient).find((item) => String(item.id) === String(policyId));
    if (!policy) return;

    const dialog = document.getElementById(DEACTIVATE_DIALOG_ID);
    dialog.dataset.expedientId = expedientId;
    dialog.dataset.policyId = policyId;
    $('#policy-deactivate-message', dialog).textContent = `Desactivarás ${policy.code} — ${policy.title}. Se conservará como antecedente para gerente y ejecutivo, pero se excluirá de la futura vista del cliente.`;
    $('#policy-deactivate-reason', dialog).value = '';
    dialog.showModal();
    $('#policy-deactivate-reason', dialog).focus();
  }

  function submitDeactivate(event) {
    event.preventDefault();
    const dialog = document.getElementById(DEACTIVATE_DIALOG_ID);
    const reason = $('#policy-deactivate-reason', dialog).value.trim();
    if (!reason) {
      return notify('warning', 'Indica el motivo de la desactivación antes de continuar.', {
        title: 'Motivo obligatorio',
      });
    }

    const records = readExpedients();
    const expedient = records.find((item) => String(item.id) === String(dialog.dataset.expedientId));
    const policy = policyList(expedient).find((item) => String(item.id) === String(dialog.dataset.policyId));
    if (!policy) return;

    policy.active = false;
    policy.deactivation_reason = reason;
    policy.deactivated_at = limaNow();
    policy.updated_at = limaNow();
    expedient.updated_at = limaNow();

    if (!writeExpedients(records)) return;
    dialog.close();
    renderPolicySection();
    notify('success', `${policy.code} fue desactivada y se conserva como antecedente interno.`, {
      title: 'Póliza desactivada',
      placement: 'global',
    });
  }

  function activatePolicy(expedientId, policyId) {
    const records = readExpedients();
    const expedient = records.find((item) => String(item.id) === String(expedientId));
    const policy = policyList(expedient).find((item) => String(item.id) === String(policyId));
    if (!policy) return;

    policy.active = true;
    policy.deactivation_reason = '';
    policy.deactivated_at = '';
    policy.updated_at = limaNow();
    expedient.updated_at = limaNow();

    if (!writeExpedients(records)) return;
    renderPolicySection();
    notify('success', `${policy.code} volvió a estar activa.`, {
      title: 'Póliza reactivada',
    });
  }

  function bindDialogs() {
    const policyDialog = document.getElementById(POLICY_DIALOG_ID);
    const deactivateDialog = document.getElementById(DEACTIVATE_DIALOG_ID);
    $('#policy-form', policyDialog).addEventListener('submit', submitPolicy);
    $('#policy-dialog-close', policyDialog).addEventListener('click', () => policyDialog.close());
    $('#policy-dialog-cancel', policyDialog).addEventListener('click', () => policyDialog.close());
    $('#policy-deactivate-form', deactivateDialog).addEventListener('submit', submitDeactivate);
    $('#policy-deactivate-close', deactivateDialog).addEventListener('click', () => deactivateDialog.close());
    $('#policy-deactivate-cancel', deactivateDialog).addEventListener('click', () => deactivateDialog.close());
  }

  function observeDetail() {
    const detail = $('#expedient-detail-content');
    if (!detail) return;

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(renderPolicySection);
    });
    observer.observe(detail, { childList: true, subtree: false });
  }

  function initialize() {
    installStyles();
    installExpedientStorageGuard();
    createDialogs();
    bindDialogs();
    observeDetail();
    window.setTimeout(renderPolicySection, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
