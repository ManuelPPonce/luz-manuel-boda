import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllGuests, getConfirmedGuests, getTables, updateConfirmedGuest } from '../../data';
import type { CombinedGuest, TableData } from '../../types';

function getAttendingCount(guest: CombinedGuest) {
  return guest.attendingCount ?? (guest.confirmed ? guest.guests + 1 : 0);
}

function getInvitedCount(guest: CombinedGuest) {
  return guest.invitedCount ?? guest.guests + 1;
}

function peopleLabel(count: number) {
  return `${count} ${count === 1 ? 'persona' : 'personas'}`;
}

export function AdminCheckIn() {
  const [guests, setGuests] = useState<CombinedGuest[]>([]);
  const [tables, setTables] = useState<TableData[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CombinedGuest | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('wedding-admin')) {
      navigate('/admin');
      return;
    }
    load();
  }, [navigate]);

  async function load() {
    const [allGuests, tableList] = await Promise.all([getAllGuests(), getTables()]);
    setGuests(allGuests.filter((guest) => guest.confirmed && !guest.canceled));
    setTables(tableList);
  }

  async function toggleCheckIn(guest: CombinedGuest) {
    const existing = (await getConfirmedGuests()).find((c) => c.id === guest.id);
    if (!existing) return;

    await updateConfirmedGuest(guest.id, {
      checkedIn: !guest.checkedIn,
      checkedInAt: !guest.checkedIn ? new Date().toISOString() : '',
    });
    await load();
    setSelected(null);
  }

  const filtered = guests.filter((guest) =>
    [guest.name, ...(guest.companionNames || []), String(guest.tableNumber || '')]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const confirmedPeople = guests.reduce((sum, guest) => sum + getAttendingCount(guest), 0);
  const arrivedPeople = guests.filter((guest) => guest.checkedIn).reduce((sum, guest) => sum + getAttendingCount(guest), 0);
  const arrivedGroups = guests.filter((guest) => guest.checkedIn).length;
  const guestTable = selected ? tables.find((table) => table.number === selected.tableNumber) : null;

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between border-b border-olive-100 bg-white px-4 py-4 shadow-sm">
        <Link to="/admin/dashboard" className="font-serif text-xl text-slate-700 transition-colors hover:text-olive-600">
          &larr; Panel
        </Link>
        <div className="text-right">
          <p className="text-xs text-slate-500">{arrivedPeople}/{confirmedPeople} personas llegaron</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-slate-300">
            {guests.length} confirmaciones reales · {arrivedGroups} registradas
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-sm border border-olive-100 bg-white p-4 text-center shadow-sm">
            <p className="font-serif text-3xl text-olive-600">{confirmedPeople}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">Personas confirmadas</p>
          </div>
          <div className="rounded-sm border border-olive-100 bg-white p-4 text-center shadow-sm">
            <p className="font-serif text-3xl text-gold-600">{arrivedPeople}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">Personas llegaron</p>
          </div>
          <div className="rounded-sm border border-olive-100 bg-white p-4 text-center shadow-sm">
            <p className="font-serif text-3xl text-slate-600">{guests.length}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">Grupos confirmados</p>
          </div>
        </div>

        <div className="mb-6 rounded-sm border border-olive-100 bg-white p-4 shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar confirmado por nombre, acompañante o mesa..."
            className="w-full rounded-sm border border-olive-200 bg-olive-50/50 px-4 py-3 text-sm text-slate-700 transition-colors placeholder:text-slate-300 focus:border-olive-500 focus:outline-none"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="rounded-sm border border-olive-100 bg-white p-12 text-center shadow-sm">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-300">
                {search ? 'No se encontraron confirmados' : 'No hay confirmaciones reales'}
              </p>
            </div>
          ) : (
            filtered.map((guest) => (
              <div
                key={guest.id}
                className={`flex cursor-pointer items-center justify-between rounded-sm border bg-white p-4 transition-all duration-200 hover:shadow-md ${guest.checkedIn ? 'border-olive-300 shadow-sm' : 'border-olive-100'}`}
                onClick={() => setSelected(guest)}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-sm border-2 transition-all duration-200 ${guest.checkedIn ? 'border-olive-600 bg-olive-600' : 'border-slate-300'}`}>
                    {guest.checkedIn && (
                      <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{guest.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {peopleLabel(getAttendingCount(guest))} confirmadas
                      {getInvitedCount(guest) !== getAttendingCount(guest) && ` · ${getInvitedCount(guest)} invitadas`}
                      {guest.tableNumber > 0 && ` · Mesa ${guest.tableNumber}`}
                    </p>
                  </div>
                </div>
                <span className={`rounded-sm px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.1em] ${guest.checkedIn ? 'bg-olive-100 text-olive-700' : 'bg-slate-100 text-slate-400'}`}>
                  {guest.checkedIn ? new Date(guest.checkedInAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : 'Ver'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-sm border border-olive-100 bg-cream shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-olive-100 p-6">
              <h3 className="font-serif text-xl text-slate-700">Confirmar llegada</h3>
              <button onClick={() => setSelected(null)} className="text-xl text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <div className="space-y-4 p-6">
              <div className="text-center">
                <p className="text-lg font-medium text-slate-700">{selected.name}</p>
                <p className="text-sm text-slate-400">{peopleLabel(getAttendingCount(selected))} confirmadas</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-sm border border-olive-100 bg-white p-4 text-center">
                  <p className="font-serif text-2xl text-olive-600">{selected.tableNumber > 0 ? selected.tableNumber : '-'}</p>
                  <p className="text-[9px] uppercase tracking-[0.1em] text-slate-400">Mesa</p>
                </div>
                <div className="rounded-sm border border-olive-100 bg-white p-4 text-center">
                  <p className="font-serif text-2xl text-olive-600">{getAttendingCount(selected)}</p>
                  <p className="text-[9px] uppercase tracking-[0.1em] text-slate-400">Confirmadas</p>
                </div>
              </div>
              {getInvitedCount(selected) !== getAttendingCount(selected) && (
                <div className="rounded-sm bg-amber-50 p-3 text-center">
                  <p className="text-xs text-amber-700">
                    Tenía {peopleLabel(getInvitedCount(selected))} invitadas, pero confirmó {peopleLabel(getAttendingCount(selected))}.
                  </p>
                </div>
              )}
              {guestTable && (
                <div className="rounded-sm bg-olive-50 p-3 text-center">
                  <p className="text-xs text-slate-500">
                    Mesa {guestTable.number} &middot; {guestTable.shape === 'circle' ? 'Redonda' : 'Rectangular'} &middot; Cap. {guestTable.capacity}
                  </p>
                </div>
              )}
              {selected.companionNames?.filter(Boolean).length > 0 && (
                <div>
                  <p className="mb-2 text-[9px] uppercase tracking-[0.1em] text-slate-400">Acompañantes asignados</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.companionNames.filter(Boolean).map((name, index) => (
                      <span key={index} className="rounded-sm border border-olive-100 bg-white px-2.5 py-1 text-xs text-slate-600">{name}</span>
                    ))}
                  </div>
                </div>
              )}
              {selected.checkedIn && (
                <div className="rounded-sm bg-olive-100 p-3 text-center">
                  <p className="text-xs font-medium text-olive-700">
                    &#10003; Llegó a las {new Date(selected.checkedInAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3 border-t border-olive-100 p-6">
              <button onClick={() => setSelected(null)} className="flex-1 rounded-sm border border-slate-200 py-3 text-xs uppercase tracking-[0.12em] text-slate-500 transition-colors hover:bg-slate-50">
                Cerrar
              </button>
              <button
                onClick={() => toggleCheckIn(selected)}
                className={`flex-1 rounded-sm py-3 text-xs uppercase tracking-[0.12em] transition-colors ${selected.checkedIn ? 'border border-rose-200 text-rose-600 hover:bg-rose-50' : 'bg-olive-600 text-cream hover:bg-olive-700'}`}
              >
                {selected.checkedIn ? 'Cancelar llegada' : 'Confirmar llegada'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
