import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { CANCELED_CONFIRMATION_MESSAGE, getPreGuests, getTables, saveConfirmedGuest, searchPreGuest, updatePreGuest } from '../data';
import type { TableData } from '../types';

export function RSVPPage() {
  const [step, setStep] = useState<'search' | 'form' | 'done'>('search');
  const [searchName, setSearchName] = useState('');
  const [searchError, setSearchError] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; tableNumber: number }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [tableNumber, setTableNumber] = useState(0);
  const [tableInfo, setTableInfo] = useState<TableData | null>(null);
  const [guestCount, setGuestCount] = useState(0);
  const [companionNames, setCompanionNames] = useState<string[]>([]);
  const [companionAttendance, setCompanionAttendance] = useState<boolean[]>([]);
  const [message, setMessage] = useState('');
  const [didCancel, setDidCancel] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const attendingCompanions = companionAttendance.filter(Boolean).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    }

    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  async function handleSearchChange(val: string) {
    setSearchName(val);
    setSearchError('');

    if (val.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const q = val.toLowerCase().trim();
    const all = await getPreGuests();
    const matches = all.filter((g) => g.name.toLowerCase().includes(q)).slice(0, 8);
    setSuggestions(matches.map((g) => ({ name: g.name, tableNumber: g.tableNumber })));
    setShowSuggestions(matches.length > 0);
  }

  function selectSuggestion(selectedName: string) {
    setSearchName(selectedName);
    setShowSuggestions(false);
    proceedWithName(selectedName);
  }

  async function proceedWithName(searchValue: string) {
    const pre = await searchPreGuest(searchValue);

    if (pre) {
      setSelectedGuestId(pre.id);
      setName(pre.name);
      setTableNumber(pre.tableNumber);
      setGuestCount(pre.guests);
      setCompanionNames(pre.companionNames?.filter(Boolean) || []);
      setCompanionAttendance(Array.from({ length: pre.guests }, () => true));
      setDidCancel(false);

      const tables = await getTables();
      setTableInfo(tables.find((t) => t.number === pre.tableNumber) || null);
      setStep('form');
      setSearchError('');
      return;
    }

    setSelectedGuestId(null);
    setName('');
    setTableNumber(0);
    setTableInfo(null);
    setGuestCount(0);
    setCompanionNames([]);
    setCompanionAttendance([]);
    setDidCancel(false);
    setSearchError('No encontramos ese nombre en la lista de invitados. Revisa que esté escrito igual a tu invitación.');
    setStep('search');
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!searchName.trim()) {
      setSearchError('Ingresa tu nombre');
      return;
    }
    proceedWithName(searchName);
  }

  function toggleCompanion(index: number) {
    setCompanionAttendance((current) =>
      Array.from({ length: guestCount }, (_, itemIndex) =>
        itemIndex === index ? !(current[itemIndex] ?? true) : (current[itemIndex] ?? true)
      )
    );
  }

  async function handleConfirm(e: FormEvent) {
    e.preventDefault();
    if (!selectedGuestId) {
      setSearchError('Primero busca y selecciona tu nombre en la lista de invitados.');
      setStep('search');
      return;
    }

    const songs = (document.getElementById('songInput') as HTMLInputElement)?.value || '';
    await saveConfirmedGuest({
      id: selectedGuestId,
      name,
      email: '',
      guests: attendingCompanions,
      dietary: '',
      message,
      songs,
      confirmedAt: new Date().toISOString(),
      tableNumber,
      checkedIn: false,
      checkedInAt: '',
    });
    await updatePreGuest(selectedGuestId, { confirmed: true });
    setDidCancel(false);
    setStep('done');
  }

  async function handleCancelAttendance() {
    if (!selectedGuestId) {
      setSearchError('Primero busca y selecciona tu nombre en la lista de invitados.');
      setStep('search');
      return;
    }

    await saveConfirmedGuest({
      id: selectedGuestId,
      name,
      email: '',
      guests: 0,
      dietary: '',
      message: CANCELED_CONFIRMATION_MESSAGE,
      songs: '',
      confirmedAt: new Date().toISOString(),
      tableNumber,
      checkedIn: false,
      checkedInAt: '',
    });
    await updatePreGuest(selectedGuestId, { confirmed: false });
    setDidCancel(true);
    setStep('done');
  }

  if (step === 'done') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream p-4">
        <div className="w-full max-w-lg text-center">
          <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${didCancel ? 'bg-rose-50' : 'bg-olive-100'}`}>
            <span className={`text-4xl ${didCancel ? 'text-rose-500' : 'text-olive-600'}`}>{didCancel ? '!' : '\u2713'}</span>
          </div>
          <h2 className="mb-3 font-serif text-3xl font-light tracking-[0.05em] text-slate-700">{didCancel ? `Gracias por avisarnos, ${name}` : `Gracias, ${name}`}</h2>
          <p className="mb-6 text-slate-500/70">{didCancel ? 'Registramos que no podrás asistir.' : 'Te esperamos con mucho cariño.'}</p>
          {!didCancel && tableNumber > 0 && (
            <div className="mb-6 inline-block rounded-sm border border-olive-100 bg-white px-6 py-3 shadow-sm">
              <p className="text-[9px] uppercase tracking-[0.15em] text-slate-400">Tu mesa</p>
              <p className="font-serif text-3xl text-olive-600">{tableNumber}</p>
            </div>
          )}
          <div className="flex justify-center">
            <Link to="/" className="rounded-sm border border-olive-200 px-6 py-3 text-xs uppercase tracking-[0.12em] text-olive-600 transition-colors hover:bg-olive-50">
              Volver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        <div className="mb-10 text-center">
          <Link to="/" className="text-xs uppercase tracking-[0.15em] text-olive-400 transition-colors hover:text-olive-600">
            &larr; Volver a la invitación
          </Link>
          <h1 className="mb-2 mt-6 font-serif text-3xl font-light tracking-[0.08em] text-slate-700 md:text-5xl">Confirmar asistencia</h1>
          <p className="text-sm text-slate-500/70">
            Confirma antes del <span className="font-medium text-olive-600">18 de Junio de 2026</span>
          </p>
        </div>

        <GlassCard intensity="heavy" className="p-6 md:p-10">
          {step === 'search' ? (
            <form onSubmit={handleSearch} className="space-y-5">
              <div className="mb-4 text-center">
                <div className="mb-3 text-4xl">&#128220;</div>
                <p className="text-sm text-slate-500/70">Ingresa tu nombre para encontrar tu información</p>
              </div>
              <div ref={searchRef} className="relative">
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                  placeholder="Tu nombre completo"
                  autoFocus
                  className="w-full border border-olive-200/60 bg-cream/80 px-4 py-3 text-center text-sm text-slate-700 transition-colors placeholder:text-slate-300 focus:border-olive-500 focus:outline-none"
                />
                {showSuggestions && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-sm border border-olive-100 bg-white shadow-lg">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.name}
                        type="button"
                        onClick={() => selectSuggestion(suggestion.name)}
                        className="w-full border-b border-olive-50 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors last:border-0 hover:bg-olive-50"
                      >
                        <span className="font-medium">{suggestion.name}</span>
                        {suggestion.tableNumber > 0 && <span className="ml-2 text-[10px] text-olive-500">Mesa {suggestion.tableNumber}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {searchError && <p className="text-center text-xs text-rose-500">{searchError}</p>}
              <p className="text-center text-[10px] text-slate-400">Selecciona tu nombre de la lista o escribe tu nombre registrado y da clic en buscar</p>
              <Button type="submit" variant="primary" size="lg" className="w-full">Buscar</Button>
            </form>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-6">
              <div className="border-b border-olive-100 pb-4 text-center">
                <p className="mb-1 text-[9px] uppercase tracking-[0.15em] text-slate-400">Confirmando como</p>
                <p className="font-serif text-2xl text-slate-700">{name}</p>
              </div>

              {tableNumber > 0 && tableInfo && (
                <div className="rounded-sm border border-olive-200 bg-gradient-to-br from-olive-50 to-cream p-6 text-center">
                  <p className="mb-2 text-[9px] uppercase tracking-[0.15em] text-slate-400">Mesa asignada</p>
                  <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-olive-300 bg-white shadow-sm">
                    <span className="font-serif text-2xl font-medium text-olive-600">{tableNumber}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {tableInfo.shape === 'circle' ? 'Mesa redonda' : 'Mesa rectangular'} &middot; {tableInfo.capacity} personas
                  </p>
                </div>
              )}

              <div className="rounded-sm border border-olive-100 bg-olive-50/50 p-4">
                <p className="mb-3 text-[10px] uppercase tracking-[0.15em] text-slate-500">Lugares asignados</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-sm border border-olive-100 bg-white p-4 text-center">
                    <p className="font-serif text-3xl text-olive-600">{attendingCompanions + 1}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-400">Personas</p>
                  </div>
                  <div className="rounded-sm border border-olive-100 bg-white p-4 text-center">
                    <p className="font-serif text-3xl text-olive-600">{attendingCompanions}/{guestCount}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-400">Acompañantes</p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-sm border border-olive-100 bg-white px-3 py-2.5">
                    <span className="text-sm font-medium text-slate-700">{name}</span>
                    <span className="text-[9px] uppercase tracking-[0.12em] text-olive-500">Invitado</span>
                  </div>

                  {Array.from({ length: guestCount }, (_, index) => {
                    const companionName = companionNames[index] || 'Acompañante asignado';

                    return (
                      <label key={`${companionName}-${index}`} className="flex cursor-pointer items-center justify-between rounded-sm border border-olive-100 bg-white px-3 py-2.5 transition-colors hover:border-olive-200 hover:bg-olive-50/40">
                        <span className="flex items-center gap-3 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={companionAttendance[index] ?? true}
                            onChange={() => toggleCompanion(index)}
                            className="h-4 w-4 accent-olive-600"
                          />
                          {companionName}
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.12em] text-slate-400">Acompañante {index + 1}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-slate-500">Mensaje para los novios (opcional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-sm border border-olive-200/60 bg-cream/80 px-4 py-3 text-sm text-slate-700 transition-colors placeholder:text-slate-300 focus:border-olive-500 focus:outline-none"
                  placeholder="Tus mejores deseos..."
                />
              </div>

              <div className="rounded-sm border border-olive-100 bg-olive-50/50 p-4">
                <label htmlFor="songInput" className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-slate-500">&#127925; Canciones que quieras escuchar</label>
                <p className="mb-2 text-[9px] text-slate-400">Recomiéndenos canciones para la fiesta (artista - canción)</p>
                <input
                  id="songInput"
                  name="songs"
                  className="w-full rounded-sm border border-olive-200/60 bg-white px-4 py-3 text-sm text-slate-700 transition-colors placeholder:text-slate-300 focus:border-olive-500 focus:outline-none"
                  placeholder="Ej: Grupo Firme - Ya Supérame"
                />
              </div>

              <div className="space-y-3">
                <Button type="submit" variant="primary" size="lg" className="w-full">Confirmar asistencia</Button>
                <button
                  type="button"
                  onClick={handleCancelAttendance}
                  className="w-full rounded-sm border border-rose-200 bg-white px-5 py-3 text-xs uppercase tracking-[0.12em] text-rose-500 transition-colors hover:bg-rose-50"
                >
                  No podré asistir
                </button>
              </div>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
