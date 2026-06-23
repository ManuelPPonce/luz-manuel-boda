import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import {
  deleteConfirmedGuest,
  deletePreGuest,
  getAllGuests,
  getTables,
  saveConfirmedGuest,
  savePreGuest,
  updatePreGuest,
} from '../../data';
import type { CombinedGuest, TableData } from '../../types';

type GuestStatusFilter = 'all' | 'invitado' | 'pendiente' | 'confirmo' | 'cancelo';
type ResponseStatus = 'pendiente' | 'confirmo' | 'cancelo';

const statusOptions: { value: GuestStatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'invitado', label: 'Invitado' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'confirmo', label: 'Confirmó' },
  { value: 'cancelo', label: 'Canceló' },
];

function getResponseStatus(guest: CombinedGuest): ResponseStatus {
  if (guest.rsvpStatus) return guest.rsvpStatus;
  if (guest.canceled) return 'cancelo';
  if (guest.confirmed) return 'confirmo';
  return 'pendiente';
}

function getInvitedCount(guest: CombinedGuest) {
  return guest.invitedCount ?? guest.guests + 1;
}

function getAttendingCount(guest: CombinedGuest) {
  return guest.attendingCount ?? (guest.confirmed ? guest.guests + 1 : 0);
}

function getCanceledCount(guest: CombinedGuest) {
  return guest.canceledCount ?? (guest.canceled ? getInvitedCount(guest) : 0);
}

function peopleLabel(count: number) {
  return `${count} ${count === 1 ? 'persona' : 'personas'}`;
}

function statusLabel(status: ResponseStatus) {
  if (status === 'confirmo') return 'Confirmó';
  if (status === 'cancelo') return 'Canceló';
  return 'Pendiente';
}

function statusClass(status: ResponseStatus) {
  if (status === 'confirmo') return 'bg-olive-100 text-olive-700';
  if (status === 'cancelo') return 'bg-rose-50 text-rose-500';
  return 'bg-amber-50 text-amber-600';
}

export function AdminGuests() {
  const [guests, setGuests] = useState<CombinedGuest[]>([]);
  const [tables, setTables] = useState<TableData[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<GuestStatusFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formName, setFormName] = useState('');
  const [formGuests, setFormGuests] = useState('0');
  const [formCompanions, setFormCompanions] = useState<string[]>([]);
  const [formTable, setFormTable] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const guestGroups = useMemo(() => {
    const confirmed = guests.filter((guest) => getResponseStatus(guest) === 'confirmo');
    const canceled = guests.filter((guest) => getResponseStatus(guest) === 'cancelo');
    const pending = guests.filter((guest) => getResponseStatus(guest) === 'pendiente');

    return { confirmed, canceled, pending };
  }, [guests]);

  const totals = useMemo(() => {
    const invitedPeople = guests.reduce((sum, guest) => sum + getInvitedCount(guest), 0);
    const attendingPeople = guestGroups.confirmed.reduce((sum, guest) => sum + getAttendingCount(guest), 0);
    const canceledPeople = guestGroups.canceled.reduce((sum, guest) => sum + getCanceledCount(guest), 0);
    const pendingPeople = guestGroups.pending.reduce((sum, guest) => sum + getInvitedCount(guest), 0);

    return {
      invitedGroups: guests.length,
      invitedPeople,
      attendingGroups: guestGroups.confirmed.length,
      attendingPeople,
      canceledGroups: guestGroups.canceled.length,
      canceledPeople,
      pendingGroups: guestGroups.pending.length,
      pendingPeople,
    };
  }, [guestGroups, guests]);

  const filteredGuests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return guests.filter((guest) => {
      const status = getResponseStatus(guest);
      const matchesStatus = statusFilter === 'all' || statusFilter === 'invitado' || status === statusFilter;
      if (!matchesStatus) return false;
      if (!query) return true;

      const searchable = [
        guest.name,
        String(guest.tableNumber || ''),
        'invitado',
        statusLabel(status),
        status,
        ...(guest.companionNames || []),
      ].join(' ').toLowerCase();

      return searchable.includes(query);
    });
  }, [guests, search, statusFilter]);

  useEffect(() => {
    if (!localStorage.getItem('wedding-admin')) {
      navigate('/admin');
      return;
    }

    refresh();
  }, [navigate]);

  async function refresh() {
    const [allGuests, tableList] = await Promise.all([getAllGuests(), getTables()]);
    setGuests(allGuests);
    setTables(tableList);
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

  function handleEdit(guest: CombinedGuest) {
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

  async function toggleConfirmed(guest: CombinedGuest) {
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

  function SummaryList({ title, guests: items, emptyText }: { title: string; guests: CombinedGuest[]; emptyText: string }) {
    return (
      <div className="rounded-sm border border-olive-100 bg-white">
        <div className="border-b border-olive-50 px-4 py-3">
          <h4 className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{title}</h4>
        </div>
        {items.length === 0 ? (
          <p className="p-4 text-xs text-slate-300">{emptyText}</p>
        ) : (
          <div className="max-h-56 divide-y divide-olive-50 overflow-y-auto">
            {items.map((guest) => (
              <div key={guest.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{guest.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {peopleLabel(getInvitedCount(guest))} invitados{guest.tableNumber > 0 && ` · Mesa ${guest.tableNumber}`}
                  </p>
                </div>
                <span className={`shrink-0 rounded-sm px-2 py-1 text-[9px] uppercase tracking-[0.1em] ${statusClass(getResponseStatus(guest))}`}>
                  {getResponseStatus(guest) === 'confirmo' ? peopleLabel(getAttendingCount(guest)) : statusLabel(getResponseStatus(guest))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
          <span className="hidden text-xs text-slate-400 md:inline">
            {totals.invitedGroups} invitados · {peopleLabel(totals.attendingPeople)} confirmaron · {peopleLabel(totals.canceledPeople)} cancelaron
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="mb-6 grid gap-3 md:grid-cols-4">
          <div className="rounded-sm border border-olive-100 bg-white p-4 text-center shadow-sm">
            <p className="font-serif text-3xl text-slate-700">{totals.invitedPeople}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-400">Personas invitadas</p>
          </div>
          <div className="rounded-sm border border-olive-100 bg-white p-4 text-center shadow-sm">
            <p className="font-serif text-3xl text-olive-600">{totals.attendingPeople}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-400">Sí asistirán</p>
          </div>
          <div className="rounded-sm border border-olive-100 bg-white p-4 text-center shadow-sm">
            <p className="font-serif text-3xl text-rose-500">{totals.canceledPeople}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-400">Cancelaron</p>
          </div>
          <div className="rounded-sm border border-olive-100 bg-white p-4 text-center shadow-sm">
            <p className="font-serif text-3xl text-amber-600">{totals.pendingPeople}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-400">Pendientes</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xs uppercase tracking-[0.15em] text-slate-500">Lista de invitados</h2>
            <p className="mt-1 text-xs text-slate-400">{filteredGuests.length} visibles de {guests.length}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsSummaryOpen(true)}
              className="rounded-sm border border-olive-200 px-4 py-2 text-xs uppercase tracking-[0.12em] text-olive-700 transition-colors hover:bg-white"
            >
              Ver resumen
            </button>
            <Button variant="primary" size="sm" onClick={openAddModal}>+ Agregar invitado</Button>
          </div>
        </div>

        <div className="mb-4 grid gap-3 rounded-sm border border-olive-100 bg-white p-3 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-sm border border-olive-200 bg-olive-50/40 px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-300 focus:border-olive-500"
            placeholder="Buscar por nombre, acompañante, mesa o estado"
          />
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatusFilter(option.value)}
                className={`rounded-sm px-3 py-2 text-[10px] uppercase tracking-[0.1em] transition-colors ${
                  statusFilter === option.value ? 'bg-olive-700 text-cream' : 'bg-olive-50 text-olive-700 hover:bg-olive-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-sm border border-olive-100 bg-white shadow-sm">
          {guests.length === 0 ? (
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
                    <th className="p-3 text-left text-[9px] uppercase tracking-[0.1em] text-slate-400">Invitados</th>
                    <th className="p-3 text-left text-[9px] uppercase tracking-[0.1em] text-slate-400">Asistencia</th>
                    <th className="p-3 text-center text-[9px] uppercase tracking-[0.1em] text-slate-400">Mesa</th>
                    <th className="p-3 text-center text-[9px] uppercase tracking-[0.1em] text-slate-400">Estado</th>
                    <th className="p-3 text-center text-[9px] uppercase tracking-[0.1em] text-slate-400">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest) => {
                    const companions = guest.companionNames?.filter(Boolean) || [];
                    const status = getResponseStatus(guest);

                    return (
                      <tr key={guest.id} className="border-b border-olive-50 hover:bg-olive-50/30">
                        <td className="p-3">
                          <p className="text-sm font-medium text-slate-700">{guest.name}</p>
                          {companions.length > 0 && <p className="mt-0.5 text-[10px] text-slate-400">{companions.join(', ')}</p>}
                        </td>
                        <td className="p-3">
                          <p className="text-sm text-slate-600">{peopleLabel(getInvitedCount(guest))}</p>
                          <p className="mt-0.5 text-[10px] text-slate-400">{guest.guests > 0 ? `${guest.guests} acompañante${guest.guests > 1 ? 's' : ''}` : 'Sin acompañantes'}</p>
                        </td>
                        <td className="p-3">
                          {status === 'confirmo' ? (
                            <p className="text-sm font-medium text-olive-700">{peopleLabel(getAttendingCount(guest))} sí van</p>
                          ) : status === 'cancelo' ? (
                            <p className="text-sm font-medium text-rose-500">{peopleLabel(getCanceledCount(guest))} cancelaron</p>
                          ) : (
                            <p className="text-sm font-medium text-amber-600">Pendiente</p>
                          )}
                          {guest.confirmedAt && <p className="mt-0.5 text-[10px] text-slate-400">{new Date(guest.confirmedAt).toLocaleDateString('es-MX')}</p>}
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-sm font-medium text-olive-600">{guest.tableNumber > 0 ? `Mesa ${guest.tableNumber}` : '-'}</span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="rounded-sm bg-slate-100 px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-slate-500">Invitado</span>
                            <button
                              onClick={() => toggleConfirmed(guest)}
                              className={`rounded-sm px-2 py-1 text-[9px] uppercase tracking-[0.1em] ${statusClass(status)}`}
                              title={guest.confirmed ? 'Marcar como pendiente' : 'Marcar como confirmado'}
                            >
                              {statusLabel(status)}
                            </button>
                          </div>
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

      {isSummaryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-sm border border-olive-100 bg-cream p-5 shadow-2xl md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-olive-100 pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400">Resumen de asistencia</p>
                <h3 className="mt-1 font-serif text-2xl text-slate-700">Invitados y confirmaciones</h3>
              </div>
              <button type="button" onClick={() => setIsSummaryOpen(false)} className="rounded-sm px-3 py-1 text-xl leading-none text-slate-400 transition-colors hover:bg-white hover:text-slate-700">
                &times;
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-4">
              <div className="rounded-sm border border-olive-100 bg-white p-4 text-center">
                <p className="font-serif text-3xl text-slate-700">{totals.invitedPeople}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">Personas invitadas</p>
                <p className="mt-1 text-[10px] text-slate-300">{totals.invitedGroups} grupos</p>
              </div>
              <div className="rounded-sm border border-olive-100 bg-white p-4 text-center">
                <p className="font-serif text-3xl text-olive-600">{totals.attendingPeople}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">Sí van</p>
                <p className="mt-1 text-[10px] text-slate-300">{totals.attendingGroups} grupos</p>
              </div>
              <div className="rounded-sm border border-olive-100 bg-white p-4 text-center">
                <p className="font-serif text-3xl text-rose-500">{totals.canceledPeople}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">Cancelaron</p>
                <p className="mt-1 text-[10px] text-slate-300">{totals.canceledGroups} grupos</p>
              </div>
              <div className="rounded-sm border border-olive-100 bg-white p-4 text-center">
                <p className="font-serif text-3xl text-amber-600">{totals.pendingPeople}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">Pendientes</p>
                <p className="mt-1 text-[10px] text-slate-300">{totals.pendingGroups} grupos</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <SummaryList title="Dijeron que sí van" guests={guestGroups.confirmed} emptyText="Aún no hay confirmaciones." />
              <SummaryList title="Cancelaron asistencia" guests={guestGroups.canceled} emptyText="Nadie ha cancelado." />
              <SummaryList title="Pendientes" guests={guestGroups.pending} emptyText="No hay pendientes." />
            </div>
          </div>
        </div>
      )}

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
