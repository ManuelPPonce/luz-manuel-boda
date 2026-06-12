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
  { name: 'Liverpool', description: 'Tu presencia es el mejor regalo, pero si deseas obsequiarnos algo, aquí está nuestra lista.', price: '', link: 'https://mesaderegalos.liverpool.com.mx/milistaderegalos/51956113' },
];

export const ADMIN_PASSWORD = 'luz2026';

const BASE = '';

async function api<T>(method: string, path: string, body?: any): Promise<T | null> {
  try {
    const opts: RequestInit = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${BASE}/api${path}`, opts);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch { return null; }
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
  const d = await api<PreGuest[]>('GET', '/guests');
  if (d) lsSet(STORAGE_PRE, d);
  return d ?? lsGet<PreGuest[]>(STORAGE_PRE, []);
}

export async function savePreGuest(guest: PreGuest): Promise<void> {
  const ok = await api('POST', '/guests', guest);
  if (ok) { lsSet(STORAGE_PRE, await getPreGuests()); return; }
  const list = lsGet<PreGuest[]>(STORAGE_PRE, []); list.push(guest); lsSet(STORAGE_PRE, list);
}

export async function updatePreGuest(id: string, updates: Partial<PreGuest>): Promise<void> {
  const ok = await api('PUT', `/guests/${id}`, updates);
  if (ok) { lsSet(STORAGE_PRE, await getPreGuests()); return; }
  const list = lsGet<PreGuest[]>(STORAGE_PRE, []); const idx = list.findIndex((g) => g.id === id);
  if (idx !== -1) { list[idx] = { ...list[idx], ...updates }; lsSet(STORAGE_PRE, list); }
}

export async function deletePreGuest(id: string): Promise<void> {
  const ok = await api('DELETE', `/guests/${id}`);
  if (ok) { lsSet(STORAGE_PRE, await getPreGuests()); return; }
  lsSet(STORAGE_PRE, lsGet<PreGuest[]>(STORAGE_PRE, []).filter((g) => g.id !== id));
}

export async function searchPreGuest(name: string): Promise<PreGuest | null> {
  const d = await api<PreGuest[]>('GET', `/guests/search?q=${encodeURIComponent(name)}`);
  if (d && d.length) return d[0];
  const list = lsGet<PreGuest[]>(STORAGE_PRE, []); const n = name.toLowerCase().trim();
  return list.find((g) => g.name.toLowerCase().includes(n)) ?? null;
}

// ─── ConfirmedGuests ───

export async function getConfirmedGuests(): Promise<ConfirmedGuest[]> {
  const d = await api<ConfirmedGuest[]>('GET', '/confirmed');
  if (d) lsSet(STORAGE_CONFIRMED, d);
  return d ?? lsGet<ConfirmedGuest[]>(STORAGE_CONFIRMED, []);
}

export async function saveConfirmedGuest(guest: ConfirmedGuest): Promise<void> {
  const ok = await api('POST', '/confirmed', guest);
  if (ok) { lsSet(STORAGE_CONFIRMED, await getConfirmedGuests()); return; }
  const list = lsGet<ConfirmedGuest[]>(STORAGE_CONFIRMED, []); list.push(guest); lsSet(STORAGE_CONFIRMED, list);
}

export async function updateConfirmedGuest(id: string, updates: Partial<ConfirmedGuest>): Promise<void> {
  const ok = await api('PUT', `/confirmed/${id}`, updates);
  if (ok) { lsSet(STORAGE_CONFIRMED, await getConfirmedGuests()); return; }
  const list = lsGet<ConfirmedGuest[]>(STORAGE_CONFIRMED, []); const idx = list.findIndex((g) => g.id === id);
  if (idx !== -1) { list[idx] = { ...list[idx], ...updates }; lsSet(STORAGE_CONFIRMED, list); }
}

export async function deleteConfirmedGuest(id: string): Promise<void> {
  const ok = await api('DELETE', `/confirmed/${id}`);
  if (ok) { lsSet(STORAGE_CONFIRMED, await getConfirmedGuests()); return; }
  lsSet(STORAGE_CONFIRMED, lsGet<ConfirmedGuest[]>(STORAGE_CONFIRMED, []).filter((g) => g.id !== id));
}

// ─── Tables ───

export async function getTables(): Promise<TableData[]> {
  const d = await api<TableData[]>('GET', '/tables');
  if (d) lsSet(STORAGE_TABLES, d);
  return d ?? lsGet<TableData[]>(STORAGE_TABLES, []);
}

export async function saveTable(table: TableData): Promise<void> {
  const ok = await api('POST', '/tables', table);
  if (ok) { lsSet(STORAGE_TABLES, await getTables()); return; }
  const list = lsGet<TableData[]>(STORAGE_TABLES, []); list.push(table); lsSet(STORAGE_TABLES, list);
}

export async function updateTable(id: string, updates: Partial<TableData>): Promise<void> {
  const ok = await api('PUT', `/tables/${id}`, updates);
  if (ok) { lsSet(STORAGE_TABLES, await getTables()); return; }
  const list = lsGet<TableData[]>(STORAGE_TABLES, []); const idx = list.findIndex((t) => t.id === id);
  if (idx !== -1) { list[idx] = { ...list[idx], ...updates }; lsSet(STORAGE_TABLES, list); }
}

export async function deleteTable(id: string): Promise<void> {
  const ok = await api('DELETE', `/tables/${id}`);
  if (ok) { lsSet(STORAGE_TABLES, await getTables()); return; }
  lsSet(STORAGE_TABLES, lsGet<TableData[]>(STORAGE_TABLES, []).filter((t) => t.id !== id));
}

// ─── Combined ───

export async function getAllGuests(): Promise<CombinedGuest[]> {
  const d = await api<CombinedGuest[]>('GET', '/combined');
  if (d) return d;
  const pre = lsGet<PreGuest[]>(STORAGE_PRE, []);
  const confirmed = lsGet<ConfirmedGuest[]>(STORAGE_CONFIRMED, []);
  const confirmedMap = new Map(confirmed.map(c => [c.id, c]));
  const result: CombinedGuest[] = pre.map(p => ({
    id: p.id, name: p.name, guests: p.guests, companionNames: p.companionNames || [],
    tableNumber: p.tableNumber, confirmed: p.confirmed, checkedIn: confirmedMap.get(p.id)?.checkedIn || false,
    checkedInAt: confirmedMap.get(p.id)?.checkedInAt || '',
    email: confirmedMap.get(p.id)?.email || '', dietary: confirmedMap.get(p.id)?.dietary || '',
    message: confirmedMap.get(p.id)?.message || '', songs: confirmedMap.get(p.id)?.songs || '',
    confirmedAt: confirmedMap.get(p.id)?.confirmedAt || '',
  }));
  for (const c of confirmed) {
    if (!pre.find(p => p.id === c.id)) {
      result.push({ id: c.id, name: c.name, guests: c.guests, companionNames: [], tableNumber: c.tableNumber, confirmed: true, checkedIn: !!c.checkedIn, checkedInAt: c.checkedInAt || '', email: c.email, dietary: c.dietary, message: c.message, songs: c.songs, confirmedAt: c.confirmedAt });
    }
  }
  return result;
}
