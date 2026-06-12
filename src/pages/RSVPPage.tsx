import { useState, type FormEvent, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { saveConfirmedGuest, searchPreGuest, updatePreGuest, getTables, getPreGuests } from '../data';
import type { TableData } from '../types';

export function RSVPPage() {
  const [step, setStep] = useState<'search' | 'form' | 'done'>('search');
  const [searchName, setSearchName] = useState('');
  const [searchError, setSearchError] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; tableNumber: number }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [name, setName] = useState('');
  const [tableNumber, setTableNumber] = useState(0);
  const [tableInfo, setTableInfo] = useState<TableData | null>(null);
  const [guestCount, setGuestCount] = useState(0);
  const [companionNames, setCompanionNames] = useState<string[]>([]);
  const [companionChecked, setCompanionChecked] = useState<boolean[]>([]);
  const [message, setMessage] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false); }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => { if (step === 'form') setCompanionChecked(companionNames.map(() => true)); }, [step, companionNames.length]);

  async function handleSearchChange(val: string) {
    setSearchName(val); setSearchError('');
    if (val.trim().length < 1) { setSuggestions([]); setShowSuggestions(false); return; }
    const q = val.toLowerCase().trim();
    const all = await getPreGuests();
    const matches = all.filter((g) => g.name.toLowerCase().includes(q)).slice(0, 8);
    setSuggestions(matches.map((g) => ({ name: g.name, tableNumber: g.tableNumber })));
    setShowSuggestions(matches.length > 0);
  }

  function selectSuggestion(name: string) { setSearchName(name); setShowSuggestions(false); proceedWithName(name); }

  async function proceedWithName(n: string) {
    const pre = await searchPreGuest(n);
    if (pre) {
      setName(pre.name); setTableNumber(pre.tableNumber); setGuestCount(pre.guests);
      setCompanionNames(pre.companionNames?.filter(Boolean) || []);
      const tables = await getTables();
      setTableInfo(tables.find((t) => t.number === pre.tableNumber) || null);
      setStep('form'); setSearchError('');
    } else {
      setName(n.trim()); setTableNumber(0); setTableInfo(null); setGuestCount(0); setCompanionNames([]); setStep('form'); setSearchError('');
    }
  }

  function handleSearch(e: FormEvent) { e.preventDefault(); if (!searchName.trim()) { setSearchError('Ingresa tu nombre'); return; } proceedWithName(searchName); }

  async function handleConfirm(e: FormEvent) {
    e.preventDefault();
    const attendingCompanions = companionChecked.filter(Boolean).length;
    const totalGuests = companionNames.length > 0 ? attendingCompanions : guestCount;
    const songs = (document.getElementById('songInput') as HTMLInputElement)?.value || '';
    await saveConfirmedGuest({ id: crypto.randomUUID(), name, email: '', guests: totalGuests, dietary: '', message, songs, confirmedAt: new Date().toISOString(), tableNumber, checkedIn: false, checkedInAt: '' });
    const pre = await searchPreGuest(name);
    if (pre) await updatePreGuest(pre.id, { confirmed: true });
    setStep('done');
  }

  if (step === 'done') {
    return (<div className="min-h-screen bg-cream flex items-center justify-center p-4"><div className="max-w-lg w-full text-center"><div className="w-20 h-20 rounded-full bg-olive-100 flex items-center justify-center mx-auto mb-6"><span className="text-4xl text-olive-600">&#10003;</span></div><h2 className="font-serif text-3xl text-slate-700 font-light tracking-[0.05em] mb-3">Gracias, {name}</h2><p className="text-slate-500/70 mb-6">Te esperamos con mucho cariño.</p>{tableNumber > 0 && (<div className="inline-block bg-white border border-olive-100 rounded-sm px-6 py-3 shadow-sm mb-6"><p className="text-[9px] text-slate-400 tracking-[0.15em] uppercase">Tu mesa</p><p className="font-serif text-3xl text-olive-600">{tableNumber}</p></div>)}<div className="flex justify-center gap-3"><Link to="/" className="px-6 py-3 border border-olive-200 text-olive-600 text-xs tracking-[0.12em] uppercase rounded-sm hover:bg-olive-50 transition-colors">Volver</Link><button onClick={() => { setStep('search'); setSearchName(''); setMessage(''); }} className="px-6 py-3 bg-olive-600 text-cream text-xs tracking-[0.12em] uppercase rounded-sm hover:bg-olive-700 transition-colors">Confirmar otro</button></div></div></div>);
  }

  return (<div className="min-h-screen bg-cream"><div className="max-w-2xl mx-auto px-4 py-16 md:py-24"><div className="text-center mb-10"><Link to="/" className="text-olive-400 text-xs tracking-[0.15em] uppercase hover:text-olive-600 transition-colors">&larr; Volver a la invitación</Link><h1 className="font-serif text-3xl md:text-5xl text-slate-700 font-light tracking-[0.08em] mt-6 mb-2">Confirmar asistencia</h1><p className="text-slate-500/70 text-sm">Confirma antes del <span className="text-olive-600 font-medium">18 de Junio de 2026</span></p></div>
      <GlassCard intensity="heavy" className="p-6 md:p-10">
        {step === 'search' ? (
          <form onSubmit={handleSearch} className="space-y-5">
            <div className="text-center mb-4"><div className="text-4xl mb-3">&#128220;</div><p className="text-slate-500/70 text-sm">Ingresa tu nombre para encontrar tu información</p></div>
            <div ref={searchRef} className="relative">
              <input type="text" value={searchName} onChange={(e) => handleSearchChange(e.target.value)} onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }} placeholder="Tu nombre completo" autoFocus className="w-full px-4 py-3 bg-cream/80 border border-olive-200/60 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-olive-500 transition-colors text-sm text-center" />
              {showSuggestions && (<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-olive-100 rounded-sm shadow-lg z-10 max-h-48 overflow-y-auto">{suggestions.map((s) => (<button key={s.name} type="button" onClick={() => selectSuggestion(s.name)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-olive-50 transition-colors border-b border-olive-50 last:border-0"><span className="font-medium">{s.name}</span>{s.tableNumber > 0 && <span className="text-olive-500 text-[10px] ml-2">Mesa {s.tableNumber}</span>}</button>))}</div>)}
            </div>
            {searchError && <p className="text-rose-500 text-xs text-center">{searchError}</p>}
            <p className="text-slate-400 text-[10px] text-center">Selecciona tu nombre de la lista o escribe y da clic en buscar</p>
            <Button type="submit" variant="primary" size="lg" className="w-full">Buscar</Button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-6">
            <div className="text-center pb-4 border-b border-olive-100"><p className="text-slate-400 text-[9px] tracking-[0.15em] uppercase mb-1">Confirmando como</p><p className="font-serif text-2xl text-slate-700">{name}</p></div>
            {tableNumber > 0 && tableInfo && (<div className="bg-gradient-to-br from-olive-50 to-cream border border-olive-200 rounded-sm p-6 text-center"><p className="text-[9px] text-slate-400 tracking-[0.15em] uppercase mb-2">Mesa asignada</p><div className="w-16 h-16 rounded-full bg-white border-2 border-olive-300 flex items-center justify-center mx-auto mb-2 shadow-sm"><span className="font-serif text-2xl text-olive-600 font-medium">{tableNumber}</span></div><p className="text-xs text-slate-500">{tableInfo.shape === 'circle' ? 'Mesa redonda' : 'Mesa rectangular'} &middot; {tableInfo.capacity} personas</p></div>)}
            {companionNames.length > 0 ? (<div><p className="text-[10px] text-slate-500 tracking-[0.15em] uppercase mb-3">Acompañantes</p><div className="space-y-2"><label className="flex items-center gap-3 p-3 bg-white border border-olive-100 rounded-sm cursor-pointer hover:bg-olive-50/50 transition-colors"><input type="checkbox" checked={true} onChange={() => {}} className="w-4 h-4 accent-olive-600 rounded-sm" /><span className="text-sm text-slate-700 font-medium">{name} (tú)</span></label>{companionNames.map((cname, i) => (<label key={i} className="flex items-center gap-3 p-3 bg-white border border-olive-100 rounded-sm cursor-pointer hover:bg-olive-50/50 transition-colors"><input type="checkbox" checked={companionChecked[i] ?? true} onChange={() => { const next = [...companionChecked]; next[i] = !next[i]; setCompanionChecked(next); }} className="w-4 h-4 accent-olive-600 rounded-sm" /><span className="text-sm text-slate-700">{cname}</span></label>))}</div><p className="text-[9px] text-slate-400 mt-2">Desmarca a quienes no asistirán</p></div>) : (<div><label className="block text-[10px] text-slate-500 tracking-[0.15em] uppercase mb-2">Acompañantes</label><select value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} className="w-full px-4 py-3 bg-cream/80 border border-olive-200/60 text-slate-700 focus:outline-none focus:border-olive-500 transition-colors text-sm rounded-sm">{Array.from({ length: 11 }, (_, i) => (<option key={i} value={i}>{i === 0 ? 'Solo yo' : `${i} acompañante${i > 1 ? 's' : ''}`}</option>))}</select></div>)}
            <div><label className="block text-[10px] text-slate-500 tracking-[0.15em] uppercase mb-2">Mensaje para los novios (opcional)</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} className="w-full px-4 py-3 bg-cream/80 border border-olive-200/60 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-olive-500 transition-colors text-sm resize-none rounded-sm" placeholder="Tus mejores deseos..." /></div>
            <div className="bg-olive-50/50 border border-olive-100 rounded-sm p-4"><label htmlFor="songInput" className="block text-[10px] text-slate-500 tracking-[0.15em] uppercase mb-2">&#127925; Canciones que quieras escuchar</label><p className="text-[9px] text-slate-400 mb-2">Recomiéndanos canciones para la fiesta (artista - canción)</p><input id="songInput" name="songs" className="w-full px-4 py-3 bg-white border border-olive-200/60 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-olive-500 transition-colors text-sm rounded-sm" placeholder="Ej: Grupo Firme - Ya Supérame" /></div>
            <Button type="submit" variant="primary" size="lg" className="w-full">Confirmar asistencia</Button>
          </form>
        )}
      </GlassCard>
    </div></div>);
}
