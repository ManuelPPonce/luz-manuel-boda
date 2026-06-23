import db from './db.js';

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_SERVICE_KEY
  || process.env.SUPABASE_ANON_KEY
  || process.env.VITE_SUPABASE_ANON_KEY
  || '';

const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

function idFilter(id) {
  return `id=eq.${encodeURIComponent(id)}`;
}

function ilikeFilter(value) {
  return encodeURIComponent(`*${String(value || '').trim()}*`);
}

async function supabaseRequest(method, table, query = '', body) {
  if (!hasSupabase) return null;

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

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ''}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Supabase ${res.status}: ${message}`);
  }

  if (res.status === 204) return [];
  const text = await res.text();
  return text ? JSON.parse(text) : null;
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

function serializeGuestPayload(guest) {
  const payload = { ...guest };
  if ('companionNames' in payload) payload.companionNames = JSON.stringify(parseCompanionNames(payload.companionNames));
  if ('confirmed' in payload) payload.confirmed = toBoolean(payload.confirmed) ? 1 : 0;
  return payload;
}

function serializeConfirmedPayload(guest) {
  const payload = { ...guest };
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
      id: g.id,
      name: g.name,
      guests: g.guests,
      companionNames: g.companionNames || [],
      tableNumber: g.tableNumber,
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

function updateSqlite(table, id, updates, allowedFields, transforms = {}) {
  const fields = [];
  const values = [];

  for (const key of allowedFields) {
    if (updates[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(transforms[key] ? transforms[key](updates[key]) : updates[key]);
    }
  }

  if (!fields.length) return;
  values.push(id);
  db.prepare(`UPDATE ${table} SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function isSupabaseEnabled() {
  return hasSupabase;
}

export async function getGuests() {
  if (hasSupabase) {
    return (await supabaseRequest('GET', 'guests', 'select=*&order=name.asc')).map(normalizeGuest);
  }

  return db.prepare('SELECT * FROM guests ORDER BY name').all().map(normalizeGuest);
}

export async function saveGuest(guest) {
  if (hasSupabase) {
    await supabaseRequest('POST', 'guests', 'on_conflict=id', serializeGuestPayload(guest));
    return;
  }

  db.prepare('INSERT OR REPLACE INTO guests (id, name, guests, companionNames, tableNumber, confirmed) VALUES (?, ?, ?, ?, ?, ?)')
    .run(guest.id, guest.name, guest.guests, JSON.stringify(parseCompanionNames(guest.companionNames)), guest.tableNumber, toBoolean(guest.confirmed) ? 1 : 0);
}

export async function updateGuest(id, updates) {
  if (hasSupabase) {
    await supabaseRequest('PATCH', 'guests', idFilter(id), serializeGuestPayload(updates));
    return;
  }

  updateSqlite('guests', id, updates, ['name', 'guests', 'tableNumber', 'confirmed', 'companionNames'], {
    confirmed: value => value ? 1 : 0,
    companionNames: value => JSON.stringify(value || []),
  });
}

export async function deleteGuest(id) {
  if (hasSupabase) {
    await supabaseRequest('DELETE', 'guests', idFilter(id));
    return;
  }

  db.prepare('DELETE FROM guests WHERE id = ?').run(id);
}

export async function searchGuests(query) {
  if (hasSupabase) {
    return (await supabaseRequest('GET', 'guests', `select=*&name=ilike.${ilikeFilter(query)}&order=name.asc`)).map(normalizeGuest);
  }

  return db.prepare('SELECT * FROM guests WHERE LOWER(name) LIKE ? ORDER BY name')
    .all(`%${String(query || '').toLowerCase()}%`)
    .map(normalizeGuest);
}

export async function getConfirmed() {
  if (hasSupabase) {
    return currentConfirmations((await supabaseRequest('GET', 'confirmed', 'select=*&order=confirmedAt.desc')).map(normalizeConfirmed));
  }

  return currentConfirmations(db.prepare('SELECT * FROM confirmed ORDER BY confirmedAt DESC').all().map(normalizeConfirmed));
}

export async function saveConfirmed(guest) {
  if (hasSupabase) {
    await supabaseRequest('POST', 'confirmed', 'on_conflict=id', serializeConfirmedPayload(guest));
    return;
  }

  db.prepare('INSERT OR REPLACE INTO confirmed (id, name, email, guests, dietary, message, songs, confirmedAt, tableNumber, checkedIn, checkedInAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(guest.id, guest.name, guest.email || '', guest.guests || 0, guest.dietary || '', guest.message || '', guest.songs || '', guest.confirmedAt || '', guest.tableNumber || 0, guest.checkedIn ? 1 : 0, guest.checkedInAt || '');
}

export async function updateConfirmed(id, updates) {
  if (hasSupabase) {
    await supabaseRequest('PATCH', 'confirmed', idFilter(id), serializeConfirmedPayload(updates));
    return;
  }

  updateSqlite('confirmed', id, updates, ['name', 'email', 'guests', 'dietary', 'message', 'songs', 'confirmedAt', 'tableNumber', 'checkedIn', 'checkedInAt'], {
    checkedIn: value => value ? 1 : 0,
  });
}

export async function deleteConfirmed(id) {
  if (hasSupabase) {
    await supabaseRequest('DELETE', 'confirmed', idFilter(id));
    return;
  }

  db.prepare('DELETE FROM confirmed WHERE id = ?').run(id);
}

export async function getTables() {
  if (hasSupabase) {
    return (await supabaseRequest('GET', 'tables_data', 'select=*&order=number.asc')).map(normalizeTable);
  }

  return db.prepare('SELECT * FROM tables_data ORDER BY number').all().map(normalizeTable);
}

export async function saveTable(table) {
  if (hasSupabase) {
    await supabaseRequest('POST', 'tables_data', 'on_conflict=id', table);
    return;
  }

  db.prepare('INSERT OR REPLACE INTO tables_data (id, number, capacity, x, y, w, h, rotation, shape, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(table.id, table.number, table.capacity, table.x ?? 0, table.y ?? 0, table.w ?? 100, table.h ?? 100, table.rotation ?? 0, table.shape || 'circle', table.type || 'guest');
}

export async function updateTable(id, updates) {
  if (hasSupabase) {
    await supabaseRequest('PATCH', 'tables_data', idFilter(id), updates);
    return;
  }

  updateSqlite('tables_data', id, updates, ['number', 'capacity', 'x', 'y', 'w', 'h', 'rotation', 'shape', 'type']);
}

export async function deleteTable(id) {
  if (hasSupabase) {
    await supabaseRequest('DELETE', 'tables_data', idFilter(id));
    return;
  }

  db.prepare('DELETE FROM tables_data WHERE id = ?').run(id);
}

export async function getCombined() {
  return combineGuests(await getGuests(), await getConfirmed());
}
