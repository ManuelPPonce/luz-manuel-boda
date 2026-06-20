import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import {
  deleteConfirmedGuest,
  deletePreGuest,
  getAllGuests,
  getPreGuests,
  getTables,
  saveConfirmedGuest,
  savePreGuest,
  updatePreGuest,
} from '../../data';
import type { PreGuest, TableData } from '../../types';

type AdminGuest = PreGuest & { canceled?: boolean };

export function AdminGuests() {
  const [preGuests, setPreGuests] = useState<AdminGuest[]>([]);
  const [tables, setTables] = useState<TableData[]>([]);
  const [confirmedPeople, setConfirmedPeople] = useState(0);
  const [canceledPeople, setCanceledPeople] = useState(0);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formName, setFormName] = useState('');
  const [formGuests, setFormGuests] = useState('0');
  const [formCompanions, setFormCompanions] = useState<string[]>([]);
  const [formTable, setFormTable] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredGuests = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return preGuests;

    return preGuests.filter((guest) => {
      const searchable = [
        guest.name,
        String(guest.tableNumber || ''),
        guest.canceled ? 'cancelo cancelado' : guest.confirmed ? 'confirmo confirmado' : 'invitado pendiente',
        ...(guest.companionNames || []),
      ].join(' ').toLowerCase();

      return searchable.includes(query);
    });
  }, [preGuests, search]);

  useEffect(() => {
    if (!localStorage.getItem('wedding-admin')) {
      navigate('/admin');
      return;
    }

    refresh();
  }, [navigate]);

  async function refresh() {
    const [guests, allGuests, tableList] = await Promise.all([getPreGuests(), getAllGuests(), getTables()]);
    const statusMap = new Map(allGuests.map((guest) => [guest.id, guest]));
    setPreGuests(guests.map((guest) => {
      const status = statusMap.get(guest.id);
      return { ...guest, confirmed: !!status?.confirmed, canceled: !!status?.canceled };
    }));
    setTables(tableList);
    setConfirmedPeople(allGuests.filter((guest) => guest.confirmed).reduce((sum, guest) => sum + guest.guests + 1, 0));
    setCanceledPeople(allGuests.filter((guest) => guest.canceled).reduce((sum, guest) => sum + guest.guests + 1, 0));
  }

  function resetFormFields() {
    setFormName('');
    setFormGuests('0');
    setFormCompanions([]);
    setFormTable('');
    setEditingId(null);
  }

  function openAddModal() {
    resetFormFields();
    setIsModalOpen(true);
  }

  function closeModal() {
    resetFormFields();
    setIsModalOpen(false);
  }

  function handleGuestCountChange(value: string) {
    const nextCount = Number.parseInt(value, 10) || 0;
    setFormGuests(value);
    setFormCompanions((current) => current.slice(0, nextCount));
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!formName.trim() || isSaving) return;

    const numGuests = Math.max(0, Number.parseInt(formGuests, 10) || 0);
    const parsedTable = Number.parseInt(formTable, 10);
    const tableNumber = Number.isFinite(parsedTable) ? parsedTable : 0;
    const companions = Array.from({ length: numGuests }, (_, index) => formCompanions[index]?.trim() || '').filter(Boolean);

    setIsSaving(true);
    try {
      if (editingId) {
        await updatePreGuest(editingId, {
          name: formName.trim(),
          guests: numGuests,
          companionNames: companions,
          tableNumber,
        });
      } else {
        await savePreGuest({
          id: crypto.randomUUID(),
          name: formName.trim(),
          guests: numGuests,
          companionNames: companions,
          tableNumber,
          confirmed: false,
        });
      }

      closeModal();
      await refresh();
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(guest: PreGuest) {
    setFormName(guest.name);
    setFormGuests(String(guest.guests));
    setFormCompanions(guest.companionNames || []);
    setFormTable(guest.tableNumber > 0 ? String(guest.tableNumber) : '');
    setEditingId(guest.id);
    setIsModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Eliminar este invitado?')) return;
    await deletePreGuest(id);
    await deleteConfirmedGuest(id);
    await refresh();
  }

  async function toggleConfirmed(guest: AdminGuest) {
    if (guest.confirmed) {
      await deleteConfirmedGuest(guest.id);
      await updatePreGuest(guest.id, { confirmed: false });
    } else {
      await saveConfirmedGuest({
        id: guest.id,
        name: guest.name,
        email: '',
        guests: guest.guests,
        dietary: '',
        message: 'Confirmado manualmente desde admin',
        songs: '',
        confirmedAt: new Date().toISOString(),
        tableNumber: guest.tableNumber,
        checkedIn: false,
        checkedInAt: '',
      });
      await updatePreGuest(guest.id, { confirmed: true });
    }

    await refresh();
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between border-b border-olive-100 bg-white px-4 py-4 shadow-sm">
        <Link to="/admin/dashboard" className="font-serif text-xl text-slate-700 transition-colors hover:text-olive-600">
          &larr; Panel
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/admin/tables" className="text-[10px] uppercase tracking-[0.1em] text-slate-400 transition-colors hover:text-olive-600">
            Mesas
          </Link>
          <span className="text-xs text-slate-400">{preGuests.length} invitados · {confirmedPeople} confirmaron · {canceledPeople} cancelaron</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xs uppercase tracking-[0.15em] text-slate-500">Lista de invitados</h2>
            <p className="mt-1 text-xs text-slate-400">{filteredGuests.length} visibles de {preGuests.length}</p>
          </div>
          <Button variant="primary" size="sm" onClick={openAddModal}>+ Agregar invitado</Button>
        </div>

        <div className="mb-4 rounded-sm border border-olive-100 bg-white p-3 shadow-sm">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-sm border border-olive-200 bg-olive-50/40 px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-300 focus:border-olive-500"
            placeholder="Buscar por nombre, acompañante, mesa o estado"
          />
        </div>

        <div className="overflow-hidden rounded-sm border border-olive-100 bg-white shadow-sm">
          {preGuests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="mb-2 text-xs uppercase tracking-[0.15em] text-slate-300">No hay invitados</p>
              <button onClick={openAddModal} className="text-xs text-olive-600 hover:underline">Agregar primer invitado</button>
            </div>
          ) : filteredGuests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-300">No hay resultados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-olive-50">
                    <th className="p-3 text-left text-[9px] uppercase tracking-[0.1em] text-slate-400">Nombre</th>
                    <th className="p-3 text-left text-[9px] uppercase tracking-[0.1em] text-slate-400">Acompañantes</th>
                    <th className="p-3 text-center text-[9px] uppercase tracking-[0.1em] text-slate-400">Mesa</th>
                    <th className="p-3 text-center text-[9px] uppercase tracking-[0.1em] text-slate-400">Estado</th>
                    <th className="p-3 text-center text-[9px] uppercase tracking-[0.1em] text-slate-400">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest) => {
                    const companions = guest.companionNames?.filter(Boolean) || [];

                    return (
                      <tr key={guest.id} className="border-b border-olive-50 hover:bg-olive-50/30">
                        <td className="p-3">
                          <p className="text-sm font-medium text-slate-700">{guest.name}</p>
                          {companions.length > 0 && <p className="mt-0.5 text-[10px] text-slate-400">{companions.join(', ')}</p>}
                        </td>
                        <td className="p-3 text-sm text-slate-600">{guest.guests > 0 ? `${guest.guests + 1} pers.` : 'Solo'}</td>
                        <td className="p-3 text-center">
                          <span className="text-sm font-medium text-olive-600">{guest.tableNumber > 0 ? `Mesa ${guest.tableNumber}` : '-'}</span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => toggleConfirmed(guest)}
                            className={`rounded-sm px-2 py-1 text-[9px] uppercase tracking-[0.1em] ${guest.canceled ? 'bg-rose-50 text-rose-500' : guest.confirmed ? 'bg-olive-100 text-olive-700' : 'bg-slate-100 text-slate-400'}`}
                          >
                            {guest.canceled ? 'Canceló' : guest.confirmed ? 'Confirmó' : 'Invitado'}
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleEdit(guest)} className="text-[9px] uppercase tracking-[0.1em] text-slate-400 hover:text-olive-600">Editar</button>
                            <button onClick={() => handleDelete(guest.id)} className="text-[9px] uppercase tracking-[0.1em] text-slate-400 hover:text-rose-500">Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <form onSubmit={handleSave} className="w-full max-w-2xl rounded-sm border border-olive-100 bg-white p-5 shadow-2xl md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-olive-100 pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400">{editingId ? 'Editar invitado' : 'Nuevo invitado'}</p>
                <h3 className="mt-1 font-serif text-2xl text-slate-700">{editingId ? 'Actualizar datos' : 'Agregar a la lista'}</h3>
              </div>
              <button type="button" onClick={closeModal} className="rounded-sm px-3 py-1 text-xl leading-none text-slate-400 transition-colors hover:bg-olive-50 hover:text-slate-700">
                &times;
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.1em] text-slate-500">Nombre completo</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(event) => setFormName(event.target.value)}
                  className="w-full rounded-sm border border-olive-200 bg-olive-50/50 px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-olive-500"
                  placeholder="Nombre del invitado"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.1em] text-slate-500">Acompañantes asignados</label>
                <select
                  value={formGuests}
                  onChange={(event) => handleGuestCountChange(event.target.value)}
                  className="w-full rounded-sm border border-olive-200 bg-olive-50/50 px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-olive-500"
                >
                  {Array.from({ length: 11 }, (_, index) => (
                    <option key={index} value={index}>{index === 0 ? 'Solo' : `${index} acompañante${index > 1 ? 's' : ''}`}</option>
                  ))}
                </select>
              </div>
            </div>

            {Number.parseInt(formGuests, 10) > 0 && (
              <div className="mt-4">
                <label className="mb-2 block text-[10px] uppercase tracking-[0.1em] text-slate-500">Nombres de los acompañantes</label>
                <div className="grid gap-2 md:grid-cols-2">
                  {Array.from({ length: Number.parseInt(formGuests, 10) }, (_, index) => (
                    <input
                      key={index}
                      type="text"
                      value={formCompanions[index] || ''}
                      onChange={(event) => {
                        const next = [...formCompanions];
                        next[index] = event.target.value;
                        setFormCompanions(next);
                      }}
                      className="w-full rounded-sm border border-olive-200 bg-olive-50/50 px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-olive-500"
                      placeholder={`Acompañante ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 max-w-xs">
              <label className="mb-1 block text-[10px] uppercase tracking-[0.1em] text-slate-500">Mesa</label>
              <select
                value={formTable}
                onChange={(event) => setFormTable(event.target.value)}
                className="w-full rounded-sm border border-olive-200 bg-olive-50/50 px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-olive-500"
              >
                <option value="">Sin mesa</option>
                {tables.map((table) => (
                  <option key={table.id} value={table.number}>Mesa {table.number} ({table.capacity} pers.)</option>
                ))}
              </select>
              {tables.length === 0 && (
                <p className="mt-1 text-[10px] text-slate-400">
                  Crea mesas primero en <Link to="/admin/tables" className="text-olive-600 underline">Diseño de mesas</Link>
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="rounded-sm border border-olive-200 px-5 py-2.5 text-xs uppercase tracking-[0.12em] text-olive-700 transition-colors hover:bg-olive-50">
                Cancelar
              </button>
              <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
                {isSaving ? 'Guardando' : editingId ? 'Guardar cambios' : 'Agregar invitado'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
