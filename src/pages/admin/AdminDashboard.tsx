import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllGuests, getTables } from '../../data';
import type { CombinedGuest, TableData } from '../../types';

function getInvitedCount(guest: CombinedGuest) {
  return guest.invitedCount ?? guest.guests + 1;
}

function getAttendingCount(guest: CombinedGuest) {
  return guest.attendingCount ?? (guest.confirmed ? guest.guests + 1 : 0);
}

function getCanceledCount(guest: CombinedGuest) {
  return guest.canceledCount ?? (guest.canceled ? getInvitedCount(guest) : 0);
}

function getGuestStatus(guest: CombinedGuest) {
  if (guest.canceled || guest.rsvpStatus === 'cancelo') return 'Canceló';
  if (guest.confirmed || guest.rsvpStatus === 'confirmo') return 'Confirmó';
  return 'Pendiente';
}

export function AdminDashboard() {
  const [guests, setGuests] = useState<CombinedGuest[]>([]);
  const [tables, setTables] = useState<TableData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('wedding-admin')) {
      navigate('/admin');
      return;
    }

    (async () => {
      setGuests(await getAllGuests());
      setTables(await getTables());
    })();
  }, [navigate]);

  const total = guests.length;
  const totalPeople = guests.reduce((sum, guest) => sum + getInvitedCount(guest), 0);
  const confirmedPeople = guests.filter((guest) => guest.confirmed).reduce((sum, guest) => sum + getAttendingCount(guest), 0);
  const canceledPeople = guests.filter((guest) => guest.canceled).reduce((sum, guest) => sum + getCanceledCount(guest), 0);
  const checkedInPeople = guests.filter((guest) => guest.checkedIn).reduce((sum, guest) => sum + getAttendingCount(guest), 0);
  const tableCount = tables.length;
  const allSongs = guests.filter((guest) => guest.songs);

  function handleLogout() {
    localStorage.removeItem('wedding-admin');
    navigate('/admin');
  }

  const StatCard = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
    <div className="rounded-sm border border-olive-100 bg-white p-5 text-center shadow-sm">
      <p className={`font-serif text-3xl ${color}`}>{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-slate-400">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between border-b border-olive-100 bg-white px-4 py-4 shadow-sm">
        <div>
          <h1 className="font-serif text-xl text-slate-700">Panel Admin</h1>
          <p className="text-xs text-slate-400">Luz & Manuel</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-[10px] uppercase tracking-[0.1em] text-slate-400 transition-colors hover:text-olive-600">Invitación</Link>
          <button onClick={handleLogout} className="text-[10px] uppercase tracking-[0.1em] text-slate-400 transition-colors hover:text-rose-500">Salir</button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl p-4 md:p-8">
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Invitados" value={total} color="text-slate-700" />
          <StatCard label="Personas" value={totalPeople} color="text-olive-600" />
          <StatCard label="Confirmaron" value={confirmedPeople} color="text-gold-600" />
          <StatCard label="Cancelaron" value={canceledPeople} color="text-rose-500" />
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Link to="/admin/tables" className="rounded-sm border border-olive-100 bg-white p-4 text-center transition-shadow hover:shadow-md">
            <p className="font-serif text-2xl text-olive-600">{tableCount}</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-slate-400">Mesas</p>
            <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.1em] text-olive-600">Diseñar &rarr;</p>
          </Link>
          <Link to="/admin/guests" className="rounded-sm border border-olive-100 bg-white p-4 text-center transition-shadow hover:shadow-md">
            <p className="font-serif text-2xl text-slate-600">{total}</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-slate-400">Invitados</p>
            <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.1em] text-olive-600">Gestionar &rarr;</p>
          </Link>
          <Link to="/admin/checkin" className="col-span-2 rounded-sm border border-olive-100 bg-white p-4 text-center transition-shadow hover:shadow-md">
            <p className="font-serif text-2xl text-slate-600">{checkedInPeople}/{totalPeople}</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-slate-400">Check-in en vivo</p>
            <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.1em] text-olive-600">Abrir &rarr;</p>
          </Link>
        </div>

        <div className="overflow-hidden rounded-sm border border-olive-100 bg-white shadow-sm">
          <div className="border-b border-olive-50 p-4">
            <h2 className="text-xs uppercase tracking-[0.15em] text-slate-500">Últimos invitados</h2>
          </div>
          {guests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-300">No hay invitados registrados</p>
              <Link to="/admin/guests" className="mt-2 inline-block text-xs text-olive-600 hover:underline">Agregar primero</Link>
            </div>
          ) : (
            <div className="divide-y divide-olive-50">
              {[...guests].slice(0, 8).map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-3 hover:bg-olive-50/30 md:p-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{guest.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {getInvitedCount(guest)} invitados{guest.confirmed && ` · ${getAttendingCount(guest)} asistirán`}{guest.tableNumber > 0 && ` · Mesa ${guest.tableNumber}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`rounded-sm px-2 py-1 text-[9px] uppercase tracking-[0.1em] ${guest.canceled ? 'bg-rose-50 text-rose-500' : guest.confirmed ? 'bg-olive-100 text-olive-700' : 'bg-amber-50 text-amber-600'}`}>
                      {getGuestStatus(guest)}
                    </span>
                    <span className={`rounded-sm px-2 py-1 text-[9px] uppercase tracking-[0.1em] ${guest.checkedIn ? 'bg-olive-100 text-olive-700' : 'bg-slate-100 text-slate-400'}`}>
                      {guest.checkedIn ? 'Llegó' : 'Check-in pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 overflow-hidden rounded-sm border border-olive-100 bg-white shadow-sm">
          <div className="border-b border-olive-50 p-4">
            <h2 className="text-xs uppercase tracking-[0.15em] text-slate-500">&#127925; Canciones solicitadas</h2>
          </div>
          {allSongs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-300">Sin solicitudes aún</p>
            </div>
          ) : (
            <div className="divide-y divide-olive-50">
              {allSongs.map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-3 hover:bg-olive-50/30">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{guest.name}</p>
                  </div>
                  <span className="text-xs italic text-slate-500">{guest.songs}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
