import type { StoryEvent, EventDetails, GiftItem, PreGuest, ConfirmedGuest, TableData, CombinedGuest } from '../types';
export type { CombinedGuest, TableData };

export const COUPLE = {
  bride: 'Luz',
  groom: 'Manuel',
  date: '2026-07-18T19:00:00',
  dateCivil: '2026-07-18T20:00:00',
  hashtag: '#LuzYManuel2026',
};

export const STORY_EVENTS: StoryEvent[] = [
  { year: '2018', title: 'El primer encuentro', description: 'Fue en una cafetería del centro. Ella pidió un café con leche, él un expreso. Sus miradas se cruzaron entre los vapores y desde entonces no han dejado de sonreírse.' },
  { year: '2020', title: 'El año que nos quedamos', description: 'El mundo se detuvo, pero nosotros aprendimos a movernos juntos. Entre películas, llamadas de noche y cartas escritas a mano, supimos que el amor no entiende de distancias.' },
  { year: '2022', title: 'Nuestro lugar en el mundo', description: 'Viajamos a la montaña y en la cima, con el viento y el silencio, supimos que nuestro hogar no era un lugar, sino el otro.' },
  { year: '2024', title: 'La pregunta', description: 'Enero, doce de la noche, bajo las estrellas. Manuel sacó un anillo y sin soltar la mano de Luz le preguntó: ¿quieres caminar conmigo toda la vida?' },
  { year: '2026', title: 'El gran día', description: 'Después de ocho años, miles de tazas de café, canciones compartidas y un amor que creció con cada amanecer, llega el día en que todo comienza de nuevo.' },
];

export const EVENT_DETAILS: EventDetails[] = [
  { title: 'Llegada de Invitados', time: '7:00 PM', date: '18 de Julio, 2026', location: 'Holiday Inn Campeche', address: 'Av. Resurgimiento 116, Centro, 24000 Campeche, Camp.', dressCode: 'Formal elegante', icon: 'guests' },
  { title: 'Ceremonia Civil', time: '8:00 PM', date: '18 de Julio, 2026', location: 'Salón de Eventos - Holiday Inn Campeche', address: 'Av. Resurgimiento 116, Centro, 24000 Campeche, Camp.', dressCode: 'Formal elegante', icon: 'civil' },
  { title: 'Recepción & Banquete', time: '9:00 PM', date: '18 de Julio, 2026', location: 'Salón de Eventos - Holiday Inn Campeche', address: 'Av. Resurgimiento 116, Centro, 24000 Campeche, Camp.', dressCode: 'Formal elegante', icon: 'party' },
];

export const GIFT_REGISTRY: GiftItem[] = [
  { name: 'Liverpool', description: 'Tu presencia es el mejor regalo, pero si deseas obsequiarnos algo, aquí hay algunas ideas.', price: '', link: 'https://mesaderegalos.liverpool.com.mx/milistaderegalos/51956113' },
];

export const ADMIN_PASSWORD = 'luz2026';

const BASE = '';
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
  || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function api<T>(method: string, path: string, body?: unknown): Promise<T | null> {
  try {
    const opts: RequestInit = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${BASE}/api${path}`, opts);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (error) {
    console.warn(`API local no disponible para ${method} ${path}`, error);
    return null;
  }
}

async function supabase<T>(method: string, table: string, query = '', body?: unknown): Promise<T | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  try {
    const headers: Record<string, string> = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
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

    if (res.status === 204) return [] as T;
    const text = await res.text();
    return text ? JSON.parse(text) as T : null;
  } catch (error) {
    console.error(`No se pudo guardar/leer en Supabase (${table})`, error);
    return null;
  }
}

function idFilter(id: string) {
  return `id=eq.${encodeURIComponent(id)}`;
}

function ilikeFilter(value: string) {
  return encodeURIComponent(`*${value.trim()}*`);
}

function parseCompanionNames(value: unknown): string[] {
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

function toNumber(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function toBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === '1';
}

function normalizePreGuest(guest: PreGuest): PreGuest {
  const row = guest as Record<string, unknown>;
  return {
    id: String(row.id || ''),
    name: String(row.name || ''),
    guests: toNumber(row.guests),
    companionNames: parseCompanionNames(row.companionNames),
    tableNumber: toNumber(row.tableNumber),
    confirmed: toBoolean(row.confirmed),
  };
}

function normalizeConfirmedGuest(guest: ConfirmedGuest): ConfirmedGuest {
  const row = guest as Record<string, unknown>;
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

function normalizeTable(table: TableData): TableData {
  const row = table as Record<string, unknown>;
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
    type: row.type === 'novios' || row.type === 'aisle' || row.type === 'door' ? row.type : 'guest',
  };
}

function preGuestSupabasePayload(guest: Partial<PreGuest>): Record<string, unknown> {
  const payload: Record<string, unknown> = { ...guest };
  if ('companionNames' in payload) payload.companionNames = JSON.stringify(parseCompanionNames(payload.companionNames));
  if ('confirmed' in payload) payload.confirmed = toBoolean(payload.confirmed) ? 1 : 0;
  return payload;
}

function confirmedGuestSupabasePayload(guest: Partial<ConfirmedGuest>): Record<string, unknown> {
  const payload: Record<string, unknown> = { ...guest };
  if ('checkedIn' in payload) payload.checkedIn = toBoolean(payload.checkedIn) ? 1 : 0;
  return payload;
}

const IMPORTED_CONFIRMATION_MESSAGE = 'Importado desde pre-invitaciones confirmadas';

function currentConfirmations(confirmed: ConfirmedGuest[]): ConfirmedGuest[] {
  return confirmed.filter((guest) => guest.message !== IMPORTED_CONFIRMATION_MESSAGE);
}

function combineGuests(pre: PreGuest[], confirmed: ConfirmedGuest[]): CombinedGuest[] {
  const activeConfirmed = currentConfirmations(confirmed);
  const confirmedMap = new Map(activeConfirmed.map(c => [c.id, c]));
  const result: CombinedGuest[] = pre.map(p => ({
    id: p.id, name: p.name, guests: p.guests, companionNames: p.companionNames || [],
    tableNumber: p.tableNumber, confirmed: confirmedMap.has(p.id), checkedIn: confirmedMap.get(p.id)?.checkedIn || false,
    checkedInAt: confirmedMap.get(p.id)?.checkedInAt || '',
    email: confirmedMap.get(p.id)?.email || '', dietary: confirmedMap.get(p.id)?.dietary || '',
    message: confirmedMap.get(p.id)?.message || '', songs: confirmedMap.get(p.id)?.songs || '',
    confirmedAt: confirmedMap.get(p.id)?.confirmedAt || '',
  }));

  for (const c of activeConfirmed) {
    if (!pre.find(p => p.id === c.id)) {
      result.push({ id: c.id, name: c.name, guests: c.guests, companionNames: [], tableNumber: c.tableNumber, confirmed: true, checkedIn: !!c.checkedIn, checkedInAt: c.checkedInAt || '', email: c.email, dietary: c.dietary, message: c.message, songs: c.songs, confirmedAt: c.confirmedAt });
    }
  }

  return result;
}

const STORAGE_PRE = 'wedding-preguests';
const STORAGE_CONFIRMED = 'wedding-confirmed';
const STORAGE_TABLES = 'wedding-tables';

function lsGet<T>(key: string, fallback: T): T {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch { return fallback; }
}
function lsSet(key: string, val: any) { localStorage.setItem(key, JSON.stringify(val)); }

// ─── PreGuests ───

export async function getPreGuests(): Promise<PreGuest[]> {
  const d = await api<PreGuest[]>('GET', '/guests')
    ?? await supabase<PreGuest[]>('GET', 'guests', 'select=*&order=name.asc');
  if (d) {
    const normalized = d.map(normalizePreGuest);
    lsSet(STORAGE_PRE, normalized);
    return normalized;
  }
  return lsGet<PreGuest[]>(STORAGE_PRE, []);
}

export async function savePreGuest(guest: PreGuest): Promise<void> {
  const ok = await api('POST', '/guests', guest)
    ?? await supabase<PreGuest[]>('POST', 'guests', 'on_conflict=id', preGuestSupabasePayload(guest));
  if (ok) { lsSet(STORAGE_PRE, await getPreGuests()); return; }
  const list = lsGet<PreGuest[]>(STORAGE_PRE, []); list.push(guest); lsSet(STORAGE_PRE, list);
}

export async function updatePreGuest(id: string, updates: Partial<PreGuest>): Promise<void> {
  const ok = await api('PUT', `/guests/${id}`, updates)
    ?? await supabase<PreGuest[]>('PATCH', 'guests', idFilter(id), preGuestSupabasePayload(updates));
  if (ok) { lsSet(STORAGE_PRE, await getPreGuests()); return; }
  const list = lsGet<PreGuest[]>(STORAGE_PRE, []); const idx = list.findIndex((g) => g.id === id);
  if (idx !== -1) { list[idx] = { ...list[idx], ...updates }; lsSet(STORAGE_PRE, list); }
}

export async function deletePreGuest(id: string): Promise<void> {
  const ok = await api('DELETE', `/guests/${id}`)
    ?? await supabase<PreGuest[]>('DELETE', 'guests', idFilter(id));
  if (ok) { lsSet(STORAGE_PRE, await getPreGuests()); return; }
  lsSet(STORAGE_PRE, lsGet<PreGuest[]>(STORAGE_PRE, []).filter((g) => g.id !== id));
}

export async function searchPreGuest(name: string): Promise<PreGuest | null> {
  const d = await api<PreGuest[]>('GET', `/guests/search?q=${encodeURIComponent(name)}`)
    ?? await supabase<PreGuest[]>('GET', 'guests', `select=*&name=ilike.${ilikeFilter(name)}&order=name.asc`);
  if (d && d.length) return normalizePreGuest(d[0]);
  const list = lsGet<PreGuest[]>(STORAGE_PRE, []); const n = name.toLowerCase().trim();
  return list.find((g) => g.name.toLowerCase().includes(n)) ?? null;
}

// ─── ConfirmedGuests ───

export async function getConfirmedGuests(): Promise<ConfirmedGuest[]> {
  const d = await api<ConfirmedGuest[]>('GET', '/confirmed')
    ?? await supabase<ConfirmedGuest[]>('GET', 'confirmed', 'select=*&order=confirmedAt.desc');
  if (d) {
    const normalized = currentConfirmations(d.map(normalizeConfirmedGuest));
    lsSet(STORAGE_CONFIRMED, normalized);
    return normalized;
  }
  return currentConfirmations(lsGet<ConfirmedGuest[]>(STORAGE_CONFIRMED, []));
}

export async function saveConfirmedGuest(guest: ConfirmedGuest): Promise<void> {
  const ok = await api('POST', '/confirmed', guest)
    ?? await supabase<ConfirmedGuest[]>('POST', 'confirmed', 'on_conflict=id', confirmedGuestSupabasePayload(guest));
  if (ok) { lsSet(STORAGE_CONFIRMED, await getConfirmedGuests()); return; }
  const list = lsGet<ConfirmedGuest[]>(STORAGE_CONFIRMED, []); list.push(guest); lsSet(STORAGE_CONFIRMED, list);
}

export async function updateConfirmedGuest(id: string, updates: Partial<ConfirmedGuest>): Promise<void> {
  const ok = await api('PUT', `/confirmed/${id}`, updates)
    ?? await supabase<ConfirmedGuest[]>('PATCH', 'confirmed', idFilter(id), confirmedGuestSupabasePayload(updates));
  if (ok) { lsSet(STORAGE_CONFIRMED, await getConfirmedGuests()); return; }
  const list = lsGet<ConfirmedGuest[]>(STORAGE_CONFIRMED, []); const idx = list.findIndex((g) => g.id === id);
  if (idx !== -1) { list[idx] = { ...list[idx], ...updates }; lsSet(STORAGE_CONFIRMED, list); }
}

export async function deleteConfirmedGuest(id: string): Promise<void> {
  const ok = await api('DELETE', `/confirmed/${id}`)
    ?? await supabase<ConfirmedGuest[]>('DELETE', 'confirmed', idFilter(id));
  if (ok) { lsSet(STORAGE_CONFIRMED, await getConfirmedGuests()); return; }
  lsSet(STORAGE_CONFIRMED, lsGet<ConfirmedGuest[]>(STORAGE_CONFIRMED, []).filter((g) => g.id !== id));
}

// ─── Tables ───

export async function getTables(): Promise<TableData[]> {
  const d = await api<TableData[]>('GET', '/tables')
    ?? await supabase<TableData[]>('GET', 'tables_data', 'select=*&order=number.asc');
  if (d) {
    const normalized = d.map(normalizeTable);
    lsSet(STORAGE_TABLES, normalized);
    return normalized;
  }
  return lsGet<TableData[]>(STORAGE_TABLES, []);
}

export async function saveTable(table: TableData): Promise<void> {
  const ok = await api('POST', '/tables', table)
    ?? await supabase<TableData[]>('POST', 'tables_data', 'on_conflict=id', table);
  if (ok) { lsSet(STORAGE_TABLES, await getTables()); return; }
  const list = lsGet<TableData[]>(STORAGE_TABLES, []); list.push(table); lsSet(STORAGE_TABLES, list);
}

export async function updateTable(id: string, updates: Partial<TableData>): Promise<void> {
  const ok = await api('PUT', `/tables/${id}`, updates)
    ?? await supabase<TableData[]>('PATCH', 'tables_data', idFilter(id), updates);
  if (ok) { lsSet(STORAGE_TABLES, await getTables()); return; }
  const list = lsGet<TableData[]>(STORAGE_TABLES, []); const idx = list.findIndex((t) => t.id === id);
  if (idx !== -1) { list[idx] = { ...list[idx], ...updates }; lsSet(STORAGE_TABLES, list); }
}

export async function deleteTable(id: string): Promise<void> {
  const ok = await api('DELETE', `/tables/${id}`)
    ?? await supabase<TableData[]>('DELETE', 'tables_data', idFilter(id));
  if (ok) { lsSet(STORAGE_TABLES, await getTables()); return; }
  lsSet(STORAGE_TABLES, lsGet<TableData[]>(STORAGE_TABLES, []).filter((t) => t.id !== id));
}

// ─── Combined ───

export async function getAllGuests(): Promise<CombinedGuest[]> {
  const d = await api<CombinedGuest[]>('GET', '/combined');
  if (d) return d;
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    return combineGuests(await getPreGuests(), await getConfirmedGuests());
  }
  const pre = lsGet<PreGuest[]>(STORAGE_PRE, []);
  const confirmed = lsGet<ConfirmedGuest[]>(STORAGE_CONFIRMED, []);
  return combineGuests(pre, confirmed);
}
