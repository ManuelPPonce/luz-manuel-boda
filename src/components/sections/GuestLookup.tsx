import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../ui/SectionTitle';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { searchPreGuest, getConfirmedGuests } from '../../data';

export function GuestLookup() {
  const [searchName, setSearchName] = useState('');
  const [result, setResult] = useState<{
    name: string;
    tableNumber: number;
    guests: number;
    confirmed: boolean;
  } | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSearch() {
    if (!searchName.trim()) {
      setError('Ingresa tu nombre');
      return;
    }
    const guest = searchPreGuest(searchName);
    if (!guest) {
      setError('No encontramos tu nombre. ¿Ya confirmaste?');
      setResult(null);
      return;
    }
    const confirmedList = getConfirmedGuests();
    const alreadyConfirmed = confirmedList.find((c) => c.id === guest.id);
    setError('');
    setResult({
      name: guest.name,
      tableNumber: guest.tableNumber,
      guests: guest.guests,
      confirmed: !!alreadyConfirmed || guest.confirmed,
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch();
  }

  return (
    <section id="lookup" className="relative py-24 md:py-32 bg-cream overflow-hidden">
      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <SectionTitle>Busca tu mesa</SectionTitle>
        <p className="text-center text-slate-500/70 -mt-8 mb-10 font-light text-sm md:text-base">
          Ingresa tu nombre para ver tu mesa y acompañantes
        </p>

        <GlassCard intensity="heavy" className="p-6 md:p-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchName}
              onChange={(e) => { setSearchName(e.target.value); setError(''); setResult(null); }}
              onKeyDown={handleKeyDown}
              placeholder="Tu nombre completo"
              className="flex-1 px-4 py-3 bg-cream/80 border border-olive-200/60 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-olive-500 transition-colors text-sm"
              autoFocus
            />
            <Button variant="primary" size="md" onClick={handleSearch}>
              Buscar
            </Button>
          </div>

          {error && <p className="mt-4 text-olive-600 text-sm text-center">{error}</p>}

          {result && (
            <div className="mt-6 p-6 bg-olive-50/50 border border-olive-200 rounded-sm text-center">
              <div className="text-3xl mb-2">&#10024;</div>
              <p className="font-serif text-xl text-slate-700 mb-2">
                ¡Bienvenido, <span className="text-olive-600">{result.name}</span>!
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6 max-w-xs mx-auto">
                <div className="bg-white/80 p-4 rounded-sm border border-olive-100">
                  <p className="text-2xl font-serif text-olive-600">{result.tableNumber}</p>
                  <p className="text-[10px] text-slate-400 tracking-[0.1em] uppercase mt-1">Mesa</p>
                </div>
                <div className="bg-white/80 p-4 rounded-sm border border-olive-100">
                  <p className="text-2xl font-serif text-olive-600">{result.guests + 1}</p>
                  <p className="text-[10px] text-slate-400 tracking-[0.1em] uppercase mt-1">Personas</p>
                </div>
              </div>

              <div className="mt-6">
                {result.confirmed ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-olive-50 border border-olive-200 rounded-sm">
                    <span className="text-olive-600 text-sm">&#10003;</span>
                    <span className="text-olive-700 text-xs tracking-[0.1em] uppercase">Asistencia confirmada</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-500/70 text-sm mb-3">Aún no has confirmado tu asistencia</p>
                    <Button variant="primary" size="md" onClick={() => navigate('/rsvp')}>
                      Confirmar ahora
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </section>
  );
}
