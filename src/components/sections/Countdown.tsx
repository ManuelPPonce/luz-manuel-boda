import { useRef } from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import { COUPLE } from '../../data';
import { cn } from '../../lib/utils';

const units = [
  { key: 'days' as const, label: 'Días' },
  { key: 'hours' as const, label: 'Horas' },
  { key: 'minutes' as const, label: 'Minutos' },
  { key: 'seconds' as const, label: 'Segundos' },
];

export function Countdown() {
  const time = useCountdown(COUPLE.date);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-olive-50 to-cream">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(141,158,111,0.08)_0%,transparent_50%)]" />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <p className="text-olive-400/80 text-sm tracking-[0.3em] uppercase mb-8">
          Faltan
        </p>

        <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
          {units.map((unit, i) => (
            <div key={unit.key} className="flex items-center gap-2 md:gap-4">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="glass-card rounded-sm px-4 py-3 md:px-8 md:py-5 min-w-[70px] md:min-w-[120px]">
                    <span className="block font-serif text-3xl md:text-6xl lg:text-7xl text-olive-600 font-light leading-none tabular-nums">
                      {String(time[unit.key]).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <span className="mt-3 text-[10px] md:text-xs text-slate-400 tracking-[0.2em] uppercase">
                  {unit.label}
                </span>
              </div>
              {i < units.length - 1 && (
                <span
                  className={cn(
                    'font-serif text-2xl md:text-4xl text-olive-300/60 mt-[-1.5rem] md:mt-[-2rem]',
                    i === units.length - 2 && 'hidden md:block'
                  )}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        <h2 className="font-serif text-3xl md:text-5xl text-slate-700 font-light tracking-[0.08em] mt-12">
          Para el gran día
        </h2>
      </div>
    </section>
  );
}
