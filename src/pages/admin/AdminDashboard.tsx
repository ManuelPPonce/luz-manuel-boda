import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllGuests, getTables, type CombinedGuest, type TableData } from '../../data';

export function AdminDashboard() {
  const [guests, setGuests] = useState<CombinedGuest[]>([]);
  const [tables, setTables] = useState<TableData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('wedding-admin')) { navigate('/admin'); return; }
    setGuests(getAllGuests());
    setTables(getTables());
  }, [navigate]);

  const total = guests.length;
  const totalPeople = guests.reduce((sum, g) => sum + g.guests + 1, 0);
  const confirmed = guests.filter((g) => g.confirmed).length;
  const checkedInPeople = guests.filter((g) => g.checkedIn).reduce((sum, g) => sum + g.guests + 1, 0);
  const tableCount = tables.length;

  function handleLogout() {
    localStorage.removeItem('wedding-admin');
    navigate('/admin');
  }

  const StatCard = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
    <div className="bg-white rounded-sm border border-olive-100 p-5 text-center shadow-sm">
      <p className={`text-3xl font-serif ${color}`}>{value}</p>
      <p className="text-slate-400 text-[10px] tracking-[0.15em] uppercase mt-1">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-olive-100 px-4 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="font-serif text-slate-700 text-xl">Panel Admin</h1>
          <p className="text-slate-400 text-xs">Luz & Manuel</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-400 text-[10px] tracking-[0.1em] uppercase hover:text-olive-600 transition-colors">Invitación</Link>
          <button onClick={handleLogout} className="text-slate-400 text-[10px] tracking-[0.1em] uppercase hover:text-rose-500 transition-colors">Salir</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Invitados" value={total} color="text-slate-700" />
          <StatCard label="Personas" value={totalPeople} color="text-olive-600" />
          <StatCard label="Confirmados" value={confirmed} color="text-gold-600" />
          <StatCard label="Llegaron" value={checkedInPeople} color="text-olive-600" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Link to="/admin/tables" className="bg-white border border-olive-100 rounded-sm p-4 text-center hover:shadow-md transition-shadow">
            <p className="text-2xl font-serif text-olive-600">{tableCount}</p>
            <p className="text-slate-400 text-[9px] tracking-[0.1em] uppercase mt-1">Mesas</p>
            <p className="text-olive-600 text-[9px] tracking-[0.1em] uppercase mt-2 font-medium">Diseñar &rarr;</p>
          </Link>
          <Link to="/admin/guests" className="bg-white border border-olive-100 rounded-sm p-4 text-center hover:shadow-md transition-shadow">
            <p className="text-2xl font-serif text-slate-600">{total}</p>
            <p className="text-slate-400 text-[9px] tracking-[0.1em] uppercase mt-1">Invitados</p>
            <p className="text-olive-600 text-[9px] tracking-[0.1em] uppercase mt-2 font-medium">Gestionar &rarr;</p>
          </Link>
          <Link to="/admin/checkin" className="bg-white border border-olive-100 rounded-sm p-4 text-center hover:shadow-md transition-shadow col-span-2">
            <p className="text-2xl font-serif text-slate-600">{checkedInPeople}/{totalPeople}</p>
            <p className="text-slate-400 text-[9px] tracking-[0.1em] uppercase mt-1">Check-in en vivo</p>
            <p className="text-olive-600 text-[9px] tracking-[0.1em] uppercase mt-2 font-medium">Abrir &rarr;</p>
          </Link>
        </div>

        <div className="bg-white rounded-sm border border-olive-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-olive-50">
            <h2 className="text-slate-500 text-xs tracking-[0.15em] uppercase">Últimos invitados</h2>
          </div>
          {guests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-300 text-xs tracking-[0.15em] uppercase">No hay invitados registrados</p>
              <Link to="/admin/guests" className="text-olive-600 text-xs mt-2 inline-block hover:underline">Agregar primero</Link>
            </div>
          ) : (
            <div className="divide-y divide-olive-50">
              {[...guests].slice(0, 8).map((guest) => (
                <div key={guest.id} className="p-3 md:p-4 flex items-center justify-between hover:bg-olive-50/30">
                  <div>
                    <p className="text-slate-700 text-sm font-medium">{guest.name}</p>
                    <p className="text-slate-400 text-[10px]">
                      {guest.guests > 0 ? `${guest.guests + 1} personas` : 'Solo'}
                      {guest.tableNumber > 0 && ` · Mesa ${guest.tableNumber}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded-sm ${
                      guest.confirmed ? 'bg-olive-100 text-olive-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {guest.confirmed ? 'Confirmó' : 'Invitado'}
                    </span>
                    <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded-sm ${
                      guest.checkedIn ? 'bg-olive-100 text-olive-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {guest.checkedIn ? 'Llegó' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-sm border border-olive-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-olive-50">
            <h2 className="text-slate-500 text-xs tracking-[0.15em] uppercase">&#127925; Canciones solicitadas</h2>
          </div>
          {(() => {
            const allSongs = guests.filter(g => g.songs).filter(Boolean);
            return allSongs.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-slate-300 text-xs tracking-[0.15em] uppercase">Sin solicitudes aún</p>
              </div>
            ) : (
              <div className="divide-y divide-olive-50">
                {allSongs.map((g) => (
                  <div key={g.id} className="p-3 flex items-center justify-between hover:bg-olive-50/30">
                    <div>
                      <p className="text-slate-700 text-sm font-medium">{g.name}</p>
                    </div>
                    <span className="text-slate-500 text-xs italic">{g.songs}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
