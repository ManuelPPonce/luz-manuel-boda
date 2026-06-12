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
  {
    year: '2018',
    title: 'El primer encuentro',
    description:
      'Fue en una cafetería del centro. Ella pidió un café con leche, él un expreso. Sus miradas se cruzaron entre los vapores y desde entonces no han dejado de sonreírse.',
  },
  {
    year: '2020',
    title: 'El año que nos quedamos',
    description:
      'El mundo se detuvo, pero nosotros aprendimos a movernos juntos. Entre películas, llamadas de noche y cartas escritas a mano, supimos que el amor no entiende de distancias.',
  },
  {
    year: '2022',
    title: 'Nuestro lugar en el mundo',
    description:
      'Viajamos a la montaña y en la cima, con el viento y el silencio, supimos que nuestro hogar no era un lugar, sino el otro.',
  },
  {
    year: '2024',
    title: 'La pregunta',
    description:
      'Enero, doce de la noche, bajo las estrellas. Manuel sacó un anillo y sin soltar la mano de Luz le preguntó: ¿quieres caminar conmigo toda la vida?',
  },
  {
    year: '2026',
    title: 'El gran día',
    description:
      'Después de ocho años, miles de tazas de café, canciones compartidas y un amor que creció con cada amanecer, llega el día en que todo comienza de nuevo.',
  },
];

export const EVENT_DETAILS: EventDetails[] = [
  {
    title: 'Llegada de Invitados',
    time: '7:00 PM',
    date: '18 de Julio, 2026',
    location: 'Holiday Inn Campeche',
    address: 'Av. Resurgimiento 116, Centro, 24000 Campeche, Camp.',
    dressCode: 'Formal elegante',
    icon: 'guests',
  },
  {
    title: 'Ceremonia Civil',
    time: '8:00 PM',
    date: '18 de Julio, 2026',
    location: 'Salón de Eventos - Holiday Inn Campeche',
    address: 'Av. Resurgimiento 116, Centro, 24000 Campeche, Camp.',
    dressCode: 'Formal elegante',
    icon: 'civil',
  },
  {
    title: 'Recepción & Banquete',
    time: '9:00 PM',
    date: '18 de Julio, 2026',
    location: 'Salón de Eventos - Holiday Inn Campeche',
    address: 'Av. Resurgimiento 116, Centro, 24000 Campeche, Camp.',
    dressCode: 'Formal elegante',
    icon: 'party',
  },
];

export const GIFT_REGISTRY: GiftItem[] = [
  {
    name: 'Liverpool',
    description: 'Tu presencia es el mejor regalo, pero si deseas obsequiarnos algo, aquí está nuestra lista.',
    price: '',
    link: 'https://mesaderegalos.liverpool.com.mx/milistaderegalos/51956113',
  },
];

export const ADMIN_PASSWORD = 'luz2026';

const PREGUESTS_KEY = 'wedding-preguests';
const CONFIRMED_KEY = 'wedding-confirmed';

// ─── Pre-loaded guests (admin adds these) ───

export function getPreGuests(): PreGuest[] {
  try {
    const data = localStorage.getItem(PREGUESTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePreGuest(guest: PreGuest): void {
  const list = getPreGuests();
  list.push(guest);
  localStorage.setItem(PREGUESTS_KEY, JSON.stringify(list));
}

export function updatePreGuest(id: string, updates: Partial<PreGuest>): void {
  const list = getPreGuests();
  const idx = list.findIndex((g) => g.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(PREGUESTS_KEY, JSON.stringify(list));
  }
}

export function deletePreGuest(id: string): void {
  const list = getPreGuests().filter((g) => g.id !== id);
  localStorage.setItem(PREGUESTS_KEY, JSON.stringify(list));
}

export function searchPreGuest(name: string): PreGuest | null {
  const list = getPreGuests();
  const n = name.toLowerCase().trim();
  return list.find((g) => g.name.toLowerCase().includes(n)) ?? null;
}

// ─── Confirmed guests (from RSVP form) ───

export function getConfirmedGuests(): ConfirmedGuest[] {
  try {
    const data = localStorage.getItem(CONFIRMED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveConfirmedGuest(guest: ConfirmedGuest): void {
  const list = getConfirmedGuests();
  list.push(guest);
  localStorage.setItem(CONFIRMED_KEY, JSON.stringify(list));
}

export function updateConfirmedGuest(id: string, updates: Partial<ConfirmedGuest>): void {
  const list = getConfirmedGuests();
  const idx = list.findIndex((g) => g.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(CONFIRMED_KEY, JSON.stringify(list));
  }
}

export function deleteConfirmedGuest(id: string): void {
  const list = getConfirmedGuests().filter((g) => g.id !== id);
  localStorage.setItem(CONFIRMED_KEY, JSON.stringify(list));
}

// ─── Combined for admin dashboard ───

export function getAllGuests(): CombinedGuest[] {
  const pre = getPreGuests();
  const confirmed = getConfirmedGuests();

  const result: CombinedGuest[] = pre.map((p) => ({
    id: p.id,
    name: p.name,
    guests: p.guests,
    companionNames: p.companionNames || [],
    tableNumber: p.tableNumber,
    confirmed: p.confirmed,
    checkedIn: false,
    checkedInAt: '',
  }));

  for (const c of confirmed) {
    const existing = result.find((r) => r.id === c.id);
    if (existing) {
      existing.confirmed = true;
      existing.checkedIn = c.checkedIn;
      existing.checkedInAt = c.checkedInAt;
      existing.email = c.email;
      existing.dietary = c.dietary;
      existing.message = c.message;
      existing.songs = c.songs;
      existing.confirmedAt = c.confirmedAt;
    } else {
      result.push({
        id: c.id,
        name: c.name,
        guests: c.guests,
        companionNames: [],
        tableNumber: c.tableNumber,
        confirmed: true,
        checkedIn: c.checkedIn,
        checkedInAt: c.checkedInAt,
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

// ─── Table layout ───

const TABLES_KEY = 'wedding-tables';

export function getTables(): TableData[] {
  try {
    const data = localStorage.getItem(TABLES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTable(table: TableData): void {
  const list = getTables();
  list.push(table);
  localStorage.setItem(TABLES_KEY, JSON.stringify(list));
}

export function updateTable(id: string, updates: Partial<TableData>): void {
  const list = getTables();
  const idx = list.findIndex((t) => t.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(TABLES_KEY, JSON.stringify(list));
  }
}

export function deleteTable(id: string): void {
  const list = getTables().filter((t) => t.id !== id);
  localStorage.setItem(TABLES_KEY, JSON.stringify(list));
}


