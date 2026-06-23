const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_SECRET_KEY
  || process.env.SUPABASE_ANON_KEY
  || '';

function hasSupabase() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

function supabaseProject() {
  try {
    return new URL(SUPABASE_URL).hostname;
  } catch {
    return '';
  }
}

function getPath(req) {
  const path = req.query?.path;
  if (Array.isArray(path)) return path.join('/');
  if (typeof path === 'string') return path;

  const url = new URL(req.url, 'http://localhost');
  return url.pathname.replace(/^\/api\/?/, '');
}

function getQueryValue(req, key) {
  const value = req.query?.[key];
  if (Array.isArray(value)) return value[0] || '';
  if (typeof value === 'string') return value;

  const url = new URL(req.url, 'http://localhost');
  return url.searchParams.get(key) || '';
}

function idFilter(id) {
  return `id=eq.${encodeURIComponent(id)}`;
}

function ilikeFilter(value) {
  return encodeURIComponent(`*${String(value || '').trim()}*`);
}

function parseCompanionNames(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function toBoolean(value) {
  return value === true || value === 1 || value === '1';
}

function normalizeGuest(row) {
  return {
    id: String(row.id || ''),
    name: String(row.name || ''),
    guests: toNumber(row.guests),
    companionNames: parseCompanionNames(row.companionNames),
    tableNumber: toNumber(row.tableNumber),
    confirmed: toBoolean(row.confirmed),
  };
}

function normalizeConfirmed(row) {
  return {
    id: String(row.id || ''),
    name: String(row.name || ''),
    email: String(row.email || ''),
    guests: toNumber(row.guests),
    dietary: String(row.dietary || ''),
    message: String(row.message || ''),
    songs: String(row.songs || ''),
    confirmedAt: String(row.confirmedAt || ''),
    tableNumber: toNumber(row.tableNumber),
    checkedIn: toBoolean(row.checkedIn),
    checkedInAt: String(row.checkedInAt || ''),
  };
}

function normalizeTable(row) {
  return {
    id: String(row.id || ''),
    number: toNumber(row.number),
    capacity: toNumber(row.capacity),
    x: toNumber(row.x),
    y: toNumber(row.y),
    w: toNumber(row.w),
    h: toNumber(row.h),
    rotation: toNumber(row.rotation),
    shape: row.shape === 'rectangle' ? 'rectangle' : 'circle',
    type: ['guest', 'novios', 'aisle', 'door'].includes(row.type) ? row.type : 'guest',
  };
}

function serializeGuestPayload(body) {
  const payload = { ...body };
  if ('companionNames' in payload) payload.companionNames = JSON.stringify(parseCompanionNames(payload.companionNames));
  if ('confirmed' in payload) payload.confirmed = toBoolean(payload.confirmed) ? 1 : 0;
  return payload;
}

function serializeConfirmedPayload(body) {
  const payload = { ...body };
  if ('checkedIn' in payload) payload.checkedIn = toBoolean(payload.checkedIn) ? 1 : 0;
  return payload;
}

const IMPORTED_CONFIRMATION_MESSAGE = 'Importado desde pre-invitaciones confirmadas';
const CANCELED_CONFIRMATION_MESSAGE = 'Asistencia cancelada desde invitacion';

function isCanceledConfirmation(guest) {
  return guest.message === CANCELED_CONFIRMATION_MESSAGE;
}

function currentConfirmations(confirmed) {
  return confirmed.filter(guest => guest.message !== IMPORTED_CONFIRMATION_MESSAGE && !isCanceledConfirmation(guest));
}

function currentCancellations(confirmed) {
  return confirmed.filter(isCanceledConfirmation);
}

async function updateGuest(id, body) {
  const payload = serializeGuestPayload(body);

  try {
    await supabaseRequest('PATCH', 'guests', idFilter(id), payload);
  } catch (error) {
    if (isMissingTableError(error) || !payload.name) throw error;
    await supabaseRequest('POST', 'guests', 'on_conflict=id', { id, ...payload });
  }
}

function combineGuests(preGuests, confirmed) {
  const activeConfirmed = currentConfirmations(confirmed);
  const canceled = currentCancellations(confirmed);
  const confirmedMap = new Map(activeConfirmed.map(c => [c.id, c]));
  const canceledMap = new Map(canceled.map(c => [c.id, c]));
  const result = preGuests.map(g => {
    const c = confirmedMap.get(g.id);
    const isCanceled = canceledMap.has(g.id);
    const invitedCount = g.guests + 1;
    return {
      ...g,
      confirmed: !!c,
      canceled: isCanceled,
      invitedCount,
      attendingCount: c ? c.guests + 1 : 0,
      canceledCount: isCanceled ? invitedCount : 0,
      rsvpStatus: isCanceled ? 'cancelo' : c ? 'confirmo' : 'pendiente',
      checkedIn: c ? !!c.checkedIn : false,
      checkedInAt: c?.checkedInAt || '',
      email: c?.email || '',
      dietary: c?.dietary || '',
      message: c?.message || '',
      songs: c?.songs || '',
      confirmedAt: c?.confirmedAt || '',
    };
  });

  for (const c of activeConfirmed) {
    if (!preGuests.find(p => p.id === c.id)) {
      const attendingCount = c.guests + 1;
      result.push({
        id: c.id,
        name: c.name,
        guests: c.guests,
        companionNames: [],
        tableNumber: c.tableNumber,
        confirmed: true,
        canceled: false,
        invitedCount: attendingCount,
        attendingCount,
        canceledCount: 0,
        rsvpStatus: 'confirmo',
        checkedIn: !!c.checkedIn,
        checkedInAt: c.checkedInAt || '',
        email: c.email,
        dietary: c.dietary,
        message: c.message,
        songs: c.songs,
        confirmedAt: c.confirmedAt,
      });
    }
  }

  for (const c of canceled) {
    if (!preGuests.find(p => p.id === c.id)) {
      const canceledCount = c.guests + 1;
      result.push({
        id: c.id,
        name: c.name,
        guests: c.guests,
        companionNames: [],
        tableNumber: c.tableNumber,
        confirmed: false,
        canceled: true,
        invitedCount: canceledCount,
        attendingCount: 0,
        canceledCount,
        rsvpStatus: 'cancelo',
        checkedIn: false,
        checkedInAt: '',
        email: c.email,
        dietary: c.dietary,
        message: c.message,
        songs: c.songs,
        confirmedAt: c.confirmedAt,
      });
    }
  }

  return result;
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

async function supabaseRequest(method, table, query = '', body) {
  if (!hasSupabase()) {
    throw new Error('Supabase no esta configurado en Vercel');
  }

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };

  if (method !== 'GET') {
    headers.Prefer = method === 'POST'
      ? 'resolution=merge-duplicates,return=representation'
      : 'return=representation';
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ''}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    const error = new Error(`Supabase ${response.status}: ${message}`);
    error.statusCode = response.status;
    error.supabaseTable = table;
    error.supabaseMessage = message;
    try {
      error.supabaseDetails = JSON.parse(message);
    } catch {
      error.supabaseDetails = null;
    }
    throw error;
  }

  if (response.status === 204) return [];
  const text = await response.text();
  return text ? JSON.parse(text) : [];
}

function isMissingTableError(error) {
  const details = error.supabaseDetails || {};
  const message = `${error.message || ''} ${error.supabaseMessage || ''}`;
  return Boolean(error.supabaseTable)
    && (error.statusCode === 404
    || details.code === '42P01'
    || details.code === 'PGRST205'
    || message.includes('does not exist')
    || message.includes('Could not find the table')
    || message.includes('relation'));
}

async function selectRows(table, query, normalize) {
  return (await supabaseRequest('GET', table, query)).map(normalize);
}

async function tableHealth(table) {
  try {
    await supabaseRequest('GET', table, 'select=id&limit=1');
    return { table, ok: true };
  } catch (error) {
    return {
      table,
      ok: false,
      status: error.statusCode || 500,
      message: error.supabaseDetails?.message || error.message,
      code: error.supabaseDetails?.code || null,
    };
  }
}

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

async function handle(req) {
  const method = req.method.toUpperCase();
  const segments = getPath(req).split('/').filter(Boolean);
  const [resource, idOrAction] = segments;

  if (!resource || resource === 'health') {
    const tables = hasSupabase()
      ? await Promise.all([
        tableHealth('guests'),
        tableHealth('confirmed'),
        tableHealth('tables_data'),
      ])
      : [];

    return {
      ok: hasSupabase() && tables.every(table => table.ok),
      database: hasSupabase() ? 'supabase' : 'missing-env',
      project: supabaseProject(),
      tables,
    };
  }

  if (resource === 'guests' && idOrAction === 'search' && method === 'GET') {
    const q = getQueryValue(req, 'q');
    const rows = await selectRows('guests', `select=*&name=ilike.${ilikeFilter(q)}`, normalizeGuest);
    return rows.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }

  if (resource === 'guests') {
    if (method === 'GET') {
      const rows = await selectRows('guests', 'select=*', normalizeGuest);
      return rows.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    }
    if (method === 'POST') {
      await supabaseRequest('POST', 'guests', 'on_conflict=id', serializeGuestPayload(await readBody(req)));
      return { ok: true };
    }
    if (idOrAction && method === 'PUT') {
      await updateGuest(idOrAction, await readBody(req));
      return { ok: true };
    }
    if (idOrAction && method === 'DELETE') {
      await supabaseRequest('DELETE', 'guests', idFilter(idOrAction));
      return { ok: true };
    }
  }

  if (resource === 'confirmed') {
    if (method === 'GET') {
      const rows = await selectRows('confirmed', 'select=*', normalizeConfirmed);
      return currentConfirmations(rows).sort((a, b) => b.confirmedAt.localeCompare(a.confirmedAt));
    }
    if (method === 'POST') {
      await supabaseRequest('POST', 'confirmed', 'on_conflict=id', serializeConfirmedPayload(await readBody(req)));
      return { ok: true };
    }
    if (idOrAction && method === 'PUT') {
      await supabaseRequest('PATCH', 'confirmed', idFilter(idOrAction), serializeConfirmedPayload(await readBody(req)));
      return { ok: true };
    }
    if (idOrAction && method === 'DELETE') {
      await supabaseRequest('DELETE', 'confirmed', idFilter(idOrAction));
      return { ok: true };
    }
  }

  if (resource === 'tables') {
    if (method === 'GET') {
      const rows = await selectRows('tables_data', 'select=*', normalizeTable);
      return rows.sort((a, b) => a.number - b.number);
    }
    if (method === 'POST') {
      await supabaseRequest('POST', 'tables_data', 'on_conflict=id', await readBody(req));
      return { ok: true };
    }
    if (idOrAction && method === 'PUT') {
      await supabaseRequest('PATCH', 'tables_data', idFilter(idOrAction), await readBody(req));
      return { ok: true };
    }
    if (idOrAction && method === 'DELETE') {
      await supabaseRequest('DELETE', 'tables_data', idFilter(idOrAction));
      return { ok: true };
    }
  }

  if (resource === 'combined' && method === 'GET') {
    const [preGuests, confirmed] = await Promise.all([
      selectRows('guests', 'select=*', normalizeGuest),
      selectRows('confirmed', 'select=*', normalizeConfirmed),
    ]);
    return combineGuests(preGuests, confirmed);
  }

  const error = new Error('Ruta no encontrada');
  error.statusCode = 404;
  throw error;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    send(res, 200, await handle(req));
  } catch (error) {
    console.error(error);
    const missingTable = isMissingTableError(error);
    send(res, error.statusCode || 500, {
      ok: false,
      error: missingTable
        ? `No se encontro la tabla ${error.supabaseTable} en el proyecto Supabase conectado`
        : error.statusCode === 404 ? 'Ruta no encontrada' : 'No se pudo conectar con Supabase',
      table: error.supabaseTable || null,
      status: error.statusCode || 500,
      details: error.supabaseDetails || error.supabaseMessage || null,
    });
  }
}
