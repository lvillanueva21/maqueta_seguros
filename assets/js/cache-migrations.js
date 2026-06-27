(() => {
  const CATALOG_STORAGE_KEY = 'broker_seguros_demo_catalogs_v1';
  const EXPEDIENT_STORAGE_KEY = 'broker_seguros_demo_expedients_v2';
  const LEGACY_EXPEDIENT_STORAGE_KEY = 'broker_seguros_demo_expedients_v1';
  const MIGRATION_NOTICE_KEY = 'broker_seguros_demo_migration_notices_v1';
  const LIMA_TIME_ZONE = 'America/Lima';

  const legacySituationMap = {
    Borrador: { code: 'ABI', name: 'Abierto', detail: 'Caso registrado y disponible para continuar cuando corresponda' },
    'En gestión': { code: 'SEG', name: 'En seguimiento', detail: 'Existe una acción o coordinación en curso' },
    'En gestiÃ³n': { code: 'SEG', name: 'En seguimiento', detail: 'Existe una acción o coordinación en curso' },
    'Pendiente de documentos': { code: 'ESP', name: 'En espera', detail: 'A la espera de información, respuesta o decisión' },
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function notify(type, message, options = {}) {
    window.BrokerNotify?.[type]?.(message, options);
  }

  function readStorage(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function noticeOnce(id, callback) {
    const shown = readStorage(MIGRATION_NOTICE_KEY) || {};
    if (shown[id]) return;

    callback();

    try {
      shown[id] = limaDateTime();
      writeStorage(MIGRATION_NOTICE_KEY, shown);
    } catch (error) {
      // La notificación no debe bloquear la migración.
    }
  }

  function limaParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: LIMA_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(date);

    return Object.fromEntries(parts.map((part) => [part.type, part.value]));
  }

  function limaDateTime(date = new Date()) {
    const parts = limaParts(date);
    return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
  }

  function limaDate(date = new Date()) {
    return limaDateTime(date).slice(0, 10);
  }

  function limaYear(date = new Date()) {
    return limaDate(date).slice(0, 4);
  }

  function formatPeruDate(value, includeTime = false) {
    if (!value) return 'No registrado';

    const text = String(value).trim();
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if (!match) return text;

    const [, year, month, day, hour = '00', minute = '00'] = match;
    if (!includeTime) return `${day}/${month}/${year}`;

    return `${day}/${month}/${year}, ${hour}:${minute}`;
  }

  function normalizeSituation(value) {
    const raw = String(value || '').trim();
    return legacySituationMap[raw]?.name || raw || 'Abierto';
  }

  function migrateCatalogs(source) {
    const catalogs = source && typeof source === 'object' && !Array.isArray(source) ? source : {};
    const catalog = catalogs.estados_expediente;

    if (!catalog || !Array.isArray(catalog.items)) {
      return { catalogs, changed: false };
    }

    let changed = false;
    const names = new Set();

    catalog.items = catalog.items.reduce((items, item) => {
      const replacement = legacySituationMap[String(item?.name || '').trim()];
      const nextItem = replacement ? { ...item, ...replacement } : { ...item };
      const key = String(nextItem.name || '').toLocaleLowerCase('es-PE');

      if (replacement) changed = true;
      if (names.has(key)) {
        changed = true;
        return items;
      }

      names.add(key);
      items.push(nextItem);
      return items;
    }, []);

    catalog.label = 'Situaciones de expediente';
    catalog.description = 'Situaciones generales y flexibles de un expediente. No representan pasos obligatorios ni un flujo forzado.';

    return { catalogs, changed };
  }

  function loadCatalogs(defaults = {}) {
    const fallback = clone(defaults || {});

    try {
      const cached = readStorage(CATALOG_STORAGE_KEY);
      if (cached && typeof cached === 'object' && !Array.isArray(cached)) {
        const result = migrateCatalogs(cached);
        if (result.changed) {
          writeStorage(CATALOG_STORAGE_KEY, result.catalogs);
          noticeOnce('catalog-situations', () => {
            notify('info', 'Se actualizaron situaciones antiguas de expediente en la caché local. Tus datos siguen guardados en este navegador.', {
              title: 'Caché local actualizada',
              duration: 8500,
            });
          });
        }
        return { catalogs: result.catalogs, migrated: result.changed };
      }
    } catch (error) {
      notify('warning', 'No se pudieron recuperar cambios anteriores. Se cargaron los datos demo base.', {
        title: 'Caché local no disponible',
      });
    }

    return { catalogs: migrateCatalogs(fallback).catalogs, migrated: false };
  }

  function normalizeExpedient(item, index) {
    const fallbackDate = limaDateTime();
    const title = String(item?.title || '').trim() || 'Sin asunto definido';

    return {
      id: String(item?.id || `exp-migrated-${index + 1}`),
      code: String(item?.code || `EXP-${limaYear()}-${String(index + 1).padStart(4, '0')}`),
      client_id: String(item?.client_id || ''),
      client_name: String(item?.client_name || 'Entidad no definida'),
      client_document: String(item?.client_document || ''),
      entity_type: String(item?.entity_type || 'Entidad'),
      title,
      state: normalizeSituation(item?.state),
      responsible_user_id: String(item?.responsible_user_id || ''),
      responsible_name: String(item?.responsible_name || 'No asignado'),
      opened_at: String(item?.opened_at || fallbackDate.slice(0, 10)),
      updated_at: String(item?.updated_at || fallbackDate),
      description: String(item?.description || ''),
      quotes: Array.isArray(item?.quotes) ? item.quotes : [],
    };
  }

  function loadExpedients(defaultData = {}) {
    try {
      const versionTwo = readStorage(EXPEDIENT_STORAGE_KEY);
      if (Array.isArray(versionTwo)) {
        const items = versionTwo.map(normalizeExpedient);
        writeStorage(EXPEDIENT_STORAGE_KEY, items);
        return { items, migrated: false };
      }

      const legacy = readStorage(LEGACY_EXPEDIENT_STORAGE_KEY);
      if (Array.isArray(legacy)) {
        const items = legacy.map(normalizeExpedient);
        writeStorage(EXPEDIENT_STORAGE_KEY, items);
        noticeOnce('expedients-v1-v2', () => {
          notify('info', 'Tus expedientes anteriores fueron adaptados al modelo flexible. Se conservaron como casos sin cotización obligatoria.', {
            title: 'Expedientes actualizados',
            duration: 9000,
          });
        });
        return { items, migrated: true };
      }
    } catch (error) {
      notify('error', 'No se pudo completar la migración local de expedientes. Los datos demo base siguen disponibles, pero revisa el almacenamiento del navegador.', {
        title: 'Error de almacenamiento local',
        duration: 0,
      });
    }

    return {
      items: clone(Array.isArray(defaultData.items) ? defaultData.items : []).map(normalizeExpedient),
      migrated: false,
    };
  }

  window.BrokerDemo = {
    keys: {
      catalogs: CATALOG_STORAGE_KEY,
      expedients: EXPEDIENT_STORAGE_KEY,
      legacyExpedients: LEGACY_EXPEDIENT_STORAGE_KEY,
    },
    clone,
    readStorage,
    writeStorage,
    loadCatalogs,
    loadExpedients,
    normalizeSituation,
    limaDate,
    limaDateTime,
    limaYear,
    formatPeruDate,
  };
})();
