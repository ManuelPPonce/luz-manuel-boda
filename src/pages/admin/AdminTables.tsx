import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getTables, saveTable, updateTable, deleteTable, getPreGuests } from '../../data';
import type { TableData } from '../../types';
import { Button } from '../../components/ui/Button';

export function AdminTables() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [guests, setGuests] = useState<{ name: string; tableNumber: number }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'guest' | 'novios' | 'aisle' | 'door'>('guest');
  const [formNumber, setFormNumber] = useState('');
  const [formCapacity, setFormCapacity] = useState('8');
  const [formShape, setFormShape] = useState<'circle' | 'rectangle'>('circle');
  const [editingId, setEditingId] = useState<string | null>(null);
  const rotateRef = useRef<{ id: string; startAngle: number; origRotation: number } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('wedding-admin')) { navigate('/admin'); return; }
    refresh();
  }, [navigate]);

  function refresh() {
    setTables(getTables());
    setGuests(getPreGuests().map((g) => ({ name: g.name, tableNumber: g.tableNumber })));
  }

  function handleSave() {
    if (formType === 'guest' && (!formNumber.trim())) return;
    const cols = Math.ceil(Math.sqrt(tables.length + 1));
    const idx = tables.length;
    const x = 80 + (idx % cols) * 220;
    const y = 80 + Math.floor(idx / cols) * 180;

    if (editingId) {
      updateTable(editingId, {
        number: parseInt(formNumber) || 0, capacity: parseInt(formCapacity) || 0,
        shape: formShape, type: formType as 'guest' | 'novios' | 'aisle' | 'door',
      });
    } else {
      const isAisle = formType === 'aisle';
      const isDoor = formType === 'door';
      const isRect = formShape === 'rectangle' || isAisle || isDoor;
      saveTable({
        id: crypto.randomUUID(), number: formType === 'guest' ? parseInt(formNumber, 10) : 0,
        capacity: parseInt(formCapacity, 10), x, y, w: isDoor ? 60 : (isRect ? 140 : 100), h: isDoor ? 100 : (isAisle ? 200 : (isRect ? 80 : 100)),
        rotation: 0, shape: isAisle ? 'rectangle' : formShape, type: formType as 'guest' | 'novios' | 'aisle' | 'door',
      });
    }
    setFormNumber(''); setFormCapacity('8'); setFormShape('circle'); setFormType('guest');
    setShowForm(false); setEditingId(null);
    refresh();
  }

  function handleEdit(t: TableData) {
    setFormType(t.type); setFormNumber(String(t.number));
    setFormCapacity(String(t.capacity)); setFormShape(t.shape);
    setEditingId(t.id); setShowForm(true);
  }

  function handleDelete(id: string) {
    if (window.confirm('¿Eliminar este elemento?')) { deleteTable(id); refresh(); }
  }

  function handleDragStart(e: React.MouseEvent, table: TableData) {
    const startX = e.clientX, startY = e.clientY;
    const origX = table.x, origY = table.y;
    function onMove(ev: MouseEvent) { updateTable(table.id, { x: origX + (ev.clientX - startX), y: origY + (ev.clientY - startY) }); refresh(); }
    function onUp() { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); }
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
  }

  function handleRotateStart(e: React.MouseEvent, table: TableData) {
    e.stopPropagation();
    const rect = (e.currentTarget.closest('[data-table-id]') as HTMLElement)?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    rotateRef.current = { id: table.id, startAngle, origRotation: table.rotation };

    function onMove(ev: MouseEvent) {
      if (!rotateRef.current) return;
      const angle = Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI);
      const delta = angle - rotateRef.current.startAngle;
      updateTable(rotateRef.current.id, { rotation: Math.round((rotateRef.current.origRotation + delta) / 15) * 15 });
      refresh();
    }
    function onUp() { rotateRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); }
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
  }

  const guestsAtTable = (tableNum: number) => guests.filter((g) => g.tableNumber === tableNum);

  function handleResizeStart(e: React.MouseEvent, table: TableData, corner: 'se' | 'sw' | 'ne' | 'nw' | 's' | 'e') {
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY;
    const ow = table.w, oh = table.h, ox = table.x, oy = table.y;
    function onMove(ev: MouseEvent) {
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      const upd: Partial<TableData> = {};
      if (corner === 'e' || corner === 'se' || corner === 'ne') upd.w = Math.max(40, ow + dx);
      if (corner === 's' || corner === 'se' || corner === 'sw') upd.h = Math.max(40, oh + dy);
      if (corner === 'sw' || corner === 'nw') { upd.w = Math.max(40, ow - dx); upd.x = ox + dx; }
      if (corner === 'nw' || corner === 'ne') { upd.h = Math.max(40, oh - dy); upd.y = oy + dy; }
      updateTable(table.id, upd);
      refresh();
    }
    function onUp() { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); }
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
  }

  const ResizeHandle = ({ table, corner, style }: { table: TableData; corner: 'se' | 'sw' | 'ne' | 'nw' | 's' | 'e'; style?: React.CSSProperties }) => (
    <div onMouseDown={(e) => handleResizeStart(e, table, corner)}
      className="absolute w-3 h-3 bg-white border border-olive-400 rounded-sm cursor-nwse-resize hover:bg-olive-100 shadow-sm"
      style={style} />
  );

  function TableVisual({ t }: { t: TableData }) {
    const seated = guestsAtTable(t.number);
    const w = t.w || (t.type === 'novios' ? 140 : t.shape === 'rectangle' ? 120 : 96);
    const h = t.h || (t.type === 'novios' ? 60 : t.type === 'aisle' ? 120 : t.shape === 'rectangle' ? 80 : 96);

    if (t.type === 'novios') {
      return <div style={{ width: w, height: h }} className="bg-gold-50 border-2 border-gold-400 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow rounded-sm relative">
        <div className="text-center"><p className="font-serif text-sm text-gold-700 font-medium">Novios</p><p className="text-[8px] text-gold-500">Principal</p></div>
        <ResizeHandle table={t} corner="se" style={{ bottom: -6, right: -6 }} />
        <ResizeHandle table={t} corner="e" style={{ top: '50%', right: -6, marginTop: -6 }} />
        <ResizeHandle table={t} corner="s" style={{ left: '50%', bottom: -6, marginLeft: -6 }} />
      </div>;
    }
    if (t.type === 'door') {
      return <div style={{ width: w, height: h }} className="bg-amber-50 border-2 border-amber-400 flex items-center justify-center shadow-md rounded-sm relative">
        <div className="text-center">
          <span className="text-lg">&#128682;</span>
          <p className="text-[8px] text-amber-600 tracking-[0.15em] uppercase mt-0.5">Puerta</p>
        </div>
        <ResizeHandle table={t} corner="se" style={{ bottom: -6, right: -6 }} />
        <ResizeHandle table={t} corner="e" style={{ top: '50%', right: -6, marginTop: -6 }} />
        <ResizeHandle table={t} corner="s" style={{ left: '50%', bottom: -6, marginLeft: -6 }} />
      </div>;
    }
    if (t.type === 'aisle') {
      return <div style={{ width: w, height: h }} className="bg-olive-100 border-2 border-dashed border-olive-300 rounded-sm relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8px] text-olive-400 tracking-[0.2em] uppercase">Pasillo</span>
        </div>
        <ResizeHandle table={t} corner="se" style={{ bottom: -6, right: -6 }} />
        <ResizeHandle table={t} corner="sw" style={{ bottom: -6, left: -6 }} />
        <ResizeHandle table={t} corner="ne" style={{ top: -6, right: -6 }} />
        <ResizeHandle table={t} corner="nw" style={{ top: -6, left: -6 }} />
        <ResizeHandle table={t} corner="e" style={{ top: '50%', right: -6, marginTop: -6 }} />
        <ResizeHandle table={t} corner="s" style={{ left: '50%', bottom: -6, marginLeft: -6 }} />
      </div>;
    }
    if (t.shape === 'rectangle') {
      return <div style={{ width: w, height: h }} className="bg-olive-50 border-2 border-olive-300 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow rounded-sm relative">
        <div className="text-center"><p className="font-serif text-lg text-olive-700 font-medium">{t.number}</p><p className="text-[8px] text-slate-400">{seated.length}/{t.capacity}</p></div>
        <ResizeHandle table={t} corner="se" style={{ bottom: -6, right: -6 }} />
        <ResizeHandle table={t} corner="e" style={{ top: '50%', right: -6, marginTop: -6 }} />
        <ResizeHandle table={t} corner="s" style={{ left: '50%', bottom: -6, marginLeft: -6 }} />
      </div>;
    }
    return <div style={{ width: w, height: h }} className="rounded-full bg-olive-50 border-2 border-olive-300 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow relative">
      <div className="text-center"><p className="font-serif text-lg text-olive-700 font-medium">{t.number}</p><p className="text-[8px] text-slate-400">{seated.length}/{t.capacity}</p></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-olive-100 px-4 py-4 flex items-center justify-between shadow-sm">
        <Link to="/admin/dashboard" className="font-serif text-slate-700 text-xl hover:text-olive-600 transition-colors">&larr; Panel</Link>
        <span className="text-slate-400 text-xs">{tables.filter(t => t.type === 'guest').length} mesas</span>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-slate-500 text-xs tracking-[0.15em] uppercase">Croquis del lugar</h2>
            <p className="text-slate-400 text-[10px] mt-0.5">Arrastra para mover · Ruedita para rotar</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormType('guest'); setFormNumber(''); setFormCapacity('8'); setFormShape('circle'); }}>
            {showForm ? 'Cancelar' : '+ Agregar elemento'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-white rounded-sm border border-olive-100 p-6 mb-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-slate-500 text-[10px] tracking-[0.1em] uppercase mb-1">Tipo</label>
                <select value={formType} onChange={(e) => { setFormType(e.target.value as any); setFormNumber(''); }}
                  className="px-3 py-2.5 bg-olive-50/50 border border-olive-200 text-slate-700 text-sm focus:outline-none focus:border-olive-500 rounded-sm cursor-pointer">
                  <option value="guest">Mesa de invitados</option>
                  <option value="novios">Mesa de novios</option>
                  <option value="aisle">Camino / Pasillo</option>
                  <option value="door">Puerta</option>
                </select>
              </div>

              {formType === 'guest' && (
                <>
                  <div>
                    <label className="block text-slate-500 text-[10px] tracking-[0.1em] uppercase mb-1">Número</label>
                    <input type="number" min="1" value={formNumber} onChange={(e) => setFormNumber(e.target.value)}
                      className="w-20 px-3 py-2.5 bg-olive-50/50 border border-olive-200 text-slate-700 text-sm focus:outline-none focus:border-olive-500 rounded-sm" />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] tracking-[0.1em] uppercase mb-1">Forma</label>
                    <select value={formShape} onChange={(e) => { setFormShape(e.target.value as any); setFormCapacity(e.target.value === 'circle' ? '8' : '12'); }}
                      className="px-3 py-2.5 bg-olive-50/50 border border-olive-200 text-slate-700 text-sm focus:outline-none focus:border-olive-500 rounded-sm cursor-pointer">
                      <option value="circle">Redonda (8 pers)</option>
                      <option value="rectangle">Rectangular (12 pers)</option>
                    </select>
                  </div>
                </>
              )}

              <Button variant="primary" size="md" onClick={handleSave}>
                {editingId ? 'Guardar' : 'Agregar'}
              </Button>
            </div>
          </div>
        )}

        {tables.length === 0 && !showForm ? (
          <div className="bg-white rounded-sm border border-olive-100 p-16 text-center shadow-sm">
            <p className="text-slate-300 text-xs tracking-[0.15em] uppercase mb-3">Croquis vacío</p>
            <p className="text-slate-400 text-[10px] mb-4">Agrega mesas, la mesa de novios y pasillos</p>
            <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>Agregar primer elemento</Button>
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-olive-100 shadow-sm">
            <div className="relative w-full" style={{ minHeight: '500px', height: `${Math.max(500, Math.ceil(tables.length / 4) * 200 + 100)}px` }}>
              {tables.map((t) => (
                <div key={t.id} data-table-id={t.id}
                  className="absolute flex flex-col items-center cursor-grab active:cursor-grabbing group"
                  style={{ left: t.x, top: t.y, transform: `rotate(${t.rotation || 0}deg)` }}
                  onMouseDown={(e) => handleDragStart(e, t)}>

                  <TableVisual t={t} />

                  <div className="absolute -top-3 -right-3 hidden group-hover:flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(t); }}
                      className="w-5 h-5 bg-white border border-olive-200 rounded-full flex items-center justify-center text-[9px] text-slate-500 hover:text-olive-600 shadow-sm">&#9998;</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                      className="w-5 h-5 bg-white border border-olive-200 rounded-full flex items-center justify-center text-[9px] text-slate-500 hover:text-rose-500 shadow-sm">&times;</button>
                  </div>

                  {(t.shape === 'rectangle' || t.type === 'novios' || t.type === 'aisle' || t.type === 'door') && (
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                      <button onMouseDown={(e) => handleRotateStart(e, t)}
                        className="w-6 h-6 bg-white border border-olive-300 rounded-full flex items-center justify-center shadow-sm cursor-grab active:cursor-grabbing hover:border-olive-500 transition-colors"
                        title="Arrastra para rotar">
                        <svg className="w-3 h-3 text-olive-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-sm border border-olive-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-olive-50">
            <h2 className="text-slate-500 text-xs tracking-[0.15em] uppercase">Resumen</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-olive-50">
                  <th className="text-left p-3 text-slate-400 text-[9px] tracking-[0.1em] uppercase">Elemento</th>
                  <th className="text-left p-3 text-slate-400 text-[9px] tracking-[0.1em] uppercase">Tipo</th>
                  <th className="text-left p-3 text-slate-400 text-[9px] tracking-[0.1em] uppercase">Invitados</th>
                  <th className="text-left p-3 text-slate-400 text-[9px] tracking-[0.1em] uppercase">Disponible</th>
                </tr>
              </thead>
              <tbody>
                {tables.filter(t => t.type === 'guest').map((t) => {
                  const seated = guestsAtTable(t.number);
                  return (
                    <tr key={t.id} className="border-b border-olive-50">
                      <td className="p-3 text-slate-700 font-medium">Mesa {t.number}</td>
                      <td className="p-3 text-slate-500 text-xs">{t.shape === 'circle' ? 'Redonda (8)' : 'Rectangular (12)'}</td>
                      <td className="p-3 text-slate-600">{seated.length} inv.</td>
                      <td className="p-3"><span className={`text-[10px] font-medium ${t.capacity - seated.length >= 0 ? 'text-olive-600' : 'text-rose-500'}`}>{t.capacity - seated.length} lugares</span></td>
                    </tr>
                  );
                })}
                {tables.filter(t => t.type !== 'guest').map((t) => (
                  <tr key={t.id} className="border-b border-olive-50 text-slate-400">
                    <td className="p-3 font-medium capitalize">{t.type === 'novios' ? 'Mesa de Novios' : t.type === 'aisle' ? 'Pasillo' : 'Puerta'}</td>
                    <td className="p-3 text-xs capitalize">{t.type}</td>
                    <td className="p-3" colSpan={2}>—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
