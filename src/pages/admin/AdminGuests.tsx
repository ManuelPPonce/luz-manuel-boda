import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getPreGuests, getConfirmedGuests, savePreGuest, updatePreGuest, deletePreGuest, deleteConfirmedGuest, getTables } from '../../data';
import type { PreGuest, TableData } from '../../types';
import { Button } from '../../components/ui/Button';

export function AdminGuests() {
  const [preGuests, setPreGuests] = useState<PreGuest[]>([]);
  const [tables, setTables] = useState<TableData[]>([]);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formGuests, setFormGuests] = useState('0');
  const [formCompanions, setFormCompanions] = useState<string[]>([]);
  const [formTable, setFormTable] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('wedding-admin')) { navigate('/admin'); return; }
    refresh();
  }, [navigate]);

  function refresh() {
    setPreGuests(getPreGuests());
    setTables(getTables());
    setConfirmedCount(getConfirmedGuests().length);
  }

  function resetForm() {
    setFormName('');
    setFormGuests('0');
    setFormCompanions([]);
    setFormTable('');
    setShowForm(false);
    setEditingId(null);
  }

  function handleSave() {
    if (!formName.trim() || !formTable.trim()) return;
    const numGuests = parseInt(formGuests, 10);
    const companions = formCompanions.slice(0, numGuests).filter(Boolean);

    if (editingId) {
      updatePreGuest(editingId, {
        name: formName.trim(),
        guests: numGuests,
        companionNames: companions,
        tableNumber: parseInt(formTable, 10),
      });
    } else {
      savePreGuest({
        id: crypto.randomUUID(),
        name: formName.trim(),
        guests: numGuests,
        companionNames: companions,
        tableNumber: parseInt(formTable, 10),
        confirmed: false,
      });
    }
    resetForm();
    refresh();
  }

  function handleEdit(g: PreGuest) {
    setFormName(g.name);
    setFormGuests(String(g.guests));
    setFormCompanions(g.companionNames || []);
    setFormTable(String(g.tableNumber));
    setEditingId(g.id);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (window.confirm('¿Eliminar este invitado?')) {
      deletePreGuest(id);
      deleteConfirmedGuest(id);
      refresh();
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-olive-100 px-4 py-4 flex items-center justify-between shadow-sm">
        <Link to="/admin/dashboard" className="font-serif text-slate-700 text-xl hover:text-olive-600 transition-colors">&larr; Panel</Link>
        <div className="flex items-center gap-4">
          <Link to="/admin/tables" className="text-slate-400 text-[10px] tracking-[0.1em] uppercase hover:text-olive-600 transition-colors">Mesas</Link>
          <span className="text-slate-400 text-xs">{preGuests.length} invitados · {confirmedCount} confirmaron</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-slate-500 text-xs tracking-[0.15em] uppercase">Lista de invitados</h2>
          <Button variant="primary" size="sm" onClick={() => { resetForm(); setShowForm(!showForm); }}>
            {showForm ? 'Cancelar' : '+ Agregar invitado'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-white rounded-sm border border-olive-100 p-6 mb-6 shadow-sm space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 text-[10px] tracking-[0.1em] uppercase mb-1">Nombre completo</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-olive-50/50 border border-olive-200 text-slate-700 text-sm focus:outline-none focus:border-olive-500 rounded-sm" placeholder="Nombre del invitado" />
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] tracking-[0.1em] uppercase mb-1">Acompañantes</label>
                <select value={formGuests} onChange={(e) => setFormGuests(e.target.value)}
                  className="w-full px-3 py-2.5 bg-olive-50/50 border border-olive-200 text-slate-700 text-sm focus:outline-none focus:border-olive-500 rounded-sm">
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>{i === 0 ? 'Solo' : `${i} acompañante${i > 1 ? 's' : ''}`}</option>
                  ))}
                </select>
              </div>
            </div>

            {parseInt(formGuests) > 0 && (
              <div>
                <label className="block text-slate-500 text-[10px] tracking-[0.1em] uppercase mb-2">Nombres de los acompañantes (opcional)</label>
                <div className="grid md:grid-cols-2 gap-2">
                  {Array.from({ length: parseInt(formGuests) }, (_, i) => (
                    <input key={i} type="text"
                      value={formCompanions[i] || ''}
                      onChange={(e) => {
                        const next = [...formCompanions];
                        next[i] = e.target.value;
                        setFormCompanions(next);
                      }}
                      className="w-full px-3 py-2 bg-olive-50/50 border border-olive-200 text-slate-700 text-sm focus:outline-none focus:border-olive-500 rounded-sm"
                      placeholder={`Acompañante ${i + 1}`} />
                  ))}
                </div>
              </div>
            )}

            <div className="md:w-1/3">
              <label className="block text-slate-500 text-[10px] tracking-[0.1em] uppercase mb-1">Mesa #</label>
              <select value={formTable} onChange={(e) => setFormTable(e.target.value)}
                className="w-full px-3 py-2.5 bg-olive-50/50 border border-olive-200 text-slate-700 text-sm focus:outline-none focus:border-olive-500 rounded-sm">
                <option value="">Seleccionar mesa</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.number}>Mesa {t.number} ({t.capacity} pers.)</option>
                ))}
              </select>
              {tables.length === 0 && (
                <p className="text-slate-400 text-[10px] mt-1">Crea mesas primero en <Link to="/admin/tables" className="text-olive-600 underline">Diseño de mesas</Link></p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="primary" size="md" onClick={handleSave}>
                {editingId ? 'Guardar cambios' : 'Agregar invitado'}
              </Button>
              <Button variant="outline" size="md" onClick={resetForm}>Cancelar</Button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-sm border border-olive-100 shadow-sm overflow-hidden">
          {preGuests.length === 0 && !showForm ? (
            <div className="p-12 text-center">
              <p className="text-slate-300 text-xs tracking-[0.15em] uppercase mb-2">No hay invitados</p>
              <button onClick={() => setShowForm(true)} className="text-olive-600 text-xs hover:underline">Agregar primer invitado</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-olive-50">
                    <th className="text-left p-3 text-slate-400 text-[9px] tracking-[0.1em] uppercase">Nombre</th>
                    <th className="text-left p-3 text-slate-400 text-[9px] tracking-[0.1em] uppercase">Acompañantes</th>
                    <th className="text-center p-3 text-slate-400 text-[9px] tracking-[0.1em] uppercase">Mesa</th>
                    <th className="text-center p-3 text-slate-400 text-[9px] tracking-[0.1em] uppercase">Estado</th>
                    <th className="text-center p-3 text-slate-400 text-[9px] tracking-[0.1em] uppercase"></th>
                  </tr>
                </thead>
                <tbody>
                  {preGuests.map((g) => (
                    <tr key={g.id} className="border-b border-olive-50 hover:bg-olive-50/30">
                      <td className="p-3">
                        <p className="text-slate-700 font-medium text-sm">{g.name}</p>
                        {g.companionNames?.filter(Boolean).length > 0 && (
                          <p className="text-slate-400 text-[10px] mt-0.5">{g.companionNames.filter(Boolean).join(', ')}</p>
                        )}
                      </td>
                      <td className="p-3 text-slate-600 text-sm">{g.guests > 0 ? `${g.guests + 1} pers.` : 'Solo'}</td>
                      <td className="p-3 text-center">
                        <span className="text-olive-600 font-medium text-sm">{g.tableNumber > 0 ? `Mesa ${g.tableNumber}` : '-'}</span>
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => { updatePreGuest(g.id, { confirmed: !g.confirmed }); refresh(); }}
                          className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded-sm ${
                            g.confirmed ? 'bg-olive-100 text-olive-700' : 'bg-slate-100 text-slate-400'
                          }`}>
                          {g.confirmed ? 'Confirmó' : 'Invitado'}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(g)} className="text-slate-400 text-[9px] tracking-[0.1em] uppercase hover:text-olive-600">Editar</button>
                          <button onClick={() => handleDelete(g.id)} className="text-slate-400 text-[9px] tracking-[0.1em] uppercase hover:text-rose-500">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
