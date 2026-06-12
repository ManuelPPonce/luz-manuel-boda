import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllGuests, getConfirmedGuests, saveConfirmedGuest, updateConfirmedGuest, getTables, type CombinedGuest } from '../../data';
import type { ConfirmedGuest, TableData } from '../../types';

export function AdminCheckIn() {
  const [guests, setGuests] = useState<CombinedGuest[]>([]);
  const [tables, setTables] = useState<TableData[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CombinedGuest | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('wedding-admin')) { navigate('/admin'); return; }
    setGuests(getAllGuests());
    setTables(getTables());
  }, [navigate]);

  function confirmCheckIn(guest: CombinedGuest) {
    const existing = getConfirmedGuests().find((c) => c.id === guest.id);
    if (existing) {
      updateConfirmedGuest(guest.id, {
        checkedIn: !guest.checkedIn,
        checkedInAt: !guest.checkedIn ? new Date().toISOString() : '',
      });
    } else {
      const newGuest: ConfirmedGuest = {
        id: guest.id, name: guest.name, email: '', guests: guest.guests,
        dietary: '', message: '', songs: '', confirmedAt: new Date().toISOString(),
        tableNumber: guest.tableNumber, checkedIn: true, checkedInAt: new Date().toISOString(),
      };
      saveConfirmedGuest(newGuest);
    }
    setGuests(getAllGuests());
    setSelected(null);
  }

  const filtered = guests.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));
  const arrived = guests.filter((g) => g.checkedIn).length;
  const guestTable = selected ? tables.find((t) => t.number === selected.tableNumber) : null;

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-olive-100 px-4 py-4 flex items-center justify-between shadow-sm">
        <Link to="/admin/dashboard" className="font-serif text-slate-700 text-xl hover:text-olive-600 transition-colors">&larr; Panel</Link>
        <span className="text-slate-400 text-xs">{arrived} llegaron</span>
      </header>

      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-sm border border-olive-100 p-4 mb-6 shadow-sm">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar invitado por nombre..."
            className="w-full px-4 py-3 bg-olive-50/50 border border-olive-200 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-olive-500 transition-colors text-sm rounded-sm" autoFocus />
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-sm border border-olive-100 p-12 text-center shadow-sm">
              <p className="text-slate-300 text-xs tracking-[0.15em] uppercase">{search ? 'No se encontraron invitados' : 'No hay invitados'}</p>
            </div>
          ) : (
            filtered.map((guest) => (
              <div key={guest.id}
                className={`bg-white rounded-sm border p-4 flex items-center justify-between transition-all duration-200 cursor-pointer hover:shadow-md ${
                  guest.checkedIn ? 'border-olive-300 shadow-sm' : 'border-olive-100'
                }`}
                onClick={() => setSelected(guest)}>
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center transition-all duration-200 ${
                    guest.checkedIn ? 'bg-olive-600 border-olive-600' : 'border-slate-300'
                  }`}>
                    {guest.checkedIn && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{guest.name}</p>
                    <p className="text-slate-400 text-[10px]">
                      {guest.guests > 0 ? `${guest.guests + 1} personas` : 'Solo'}
                      {guest.tableNumber > 0 && ` · Mesa ${guest.tableNumber}`}
                    </p>
                  </div>
                </div>
                <span className={`text-[9px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-sm font-medium ${
                  guest.checkedIn ? 'bg-olive-100 text-olive-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  {guest.checkedIn ? `${new Date(guest.checkedInAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}` : 'Ver'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-cream rounded-sm w-full max-w-md shadow-2xl border border-olive-100" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-olive-100 flex items-center justify-between">
              <h3 className="font-serif text-xl text-slate-700">Confirmar llegada</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-lg font-medium text-slate-700">{selected.name}</p>
                <p className="text-slate-400 text-sm">{selected.guests > 0 ? `${selected.guests + 1} personas` : 'Solo'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-sm border border-olive-100 p-4 text-center">
                  <p className="text-2xl font-serif text-olive-600">{selected.tableNumber > 0 ? selected.tableNumber : '-'}</p>
                  <p className="text-[9px] text-slate-400 tracking-[0.1em] uppercase">Mesa</p>
                </div>
                <div className="bg-white rounded-sm border border-olive-100 p-4 text-center">
                  <p className="text-2xl font-serif text-olive-600">{selected.guests + 1}</p>
                  <p className="text-[9px] text-slate-400 tracking-[0.1em] uppercase">Total personas</p>
                </div>
              </div>

              {guestTable && (
                <div className="bg-olive-50 rounded-sm p-3 text-center">
                  <p className="text-xs text-slate-500">Mesa {guestTable.number} &middot; {guestTable.shape === 'circle' ? 'Redonda' : 'Rectangular'} &middot; Cap. {guestTable.capacity}</p>
                </div>
              )}

              {selected.companionNames?.filter(Boolean).length > 0 && (
                <div>
                  <p className="text-[9px] text-slate-400 tracking-[0.1em] uppercase mb-2">Acompañantes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.companionNames.filter(Boolean).map((name, i) => (
                      <span key={i} className="bg-white border border-olive-100 px-2.5 py-1 text-xs text-slate-600 rounded-sm">{name}</span>
                    ))}
                  </div>
                </div>
              )}

              {selected.checkedIn && (
                <div className="bg-olive-100 rounded-sm p-3 text-center">
                  <p className="text-xs text-olive-700 font-medium">&#10003; Llegó a las {new Date(selected.checkedInAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-olive-100 flex gap-3">
              <button onClick={() => setSelected(null)}
                className="flex-1 py-3 border border-slate-200 text-slate-500 text-xs tracking-[0.12em] uppercase rounded-sm hover:bg-slate-50 transition-colors">
                Cerrar
              </button>
              <button onClick={() => confirmCheckIn(selected)}
                className={`flex-1 py-3 text-xs tracking-[0.12em] uppercase rounded-sm transition-colors ${
                  selected.checkedIn
                    ? 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                    : 'bg-olive-600 text-cream hover:bg-olive-700'
                }`}>
                {selected.checkedIn ? 'Cancelar llegada' : 'Confirmar llegada'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
