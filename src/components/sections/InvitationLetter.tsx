import { useState } from 'react';

interface InvitationLetterProps {
  onOpen: () => void;
}

type Phase = 'closed' | 'unsealing' | 'opening' | 'opened';

export function InvitationLetter({ onOpen }: InvitationLetterProps) {
  const [phase, setPhase] = useState<Phase>('closed');

  function handleOpen() {
    if (phase !== 'closed') return;
    setPhase('unsealing');
    setTimeout(() => setPhase('opening'), 500);
    setTimeout(() => {
      setPhase('opened');
      setTimeout(onOpen, 400);
    }, 1300);
  }

  if (phase === 'opened') return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-colors duration-1000 ${phase === 'opening' ? 'bg-[#f5f0e8]' : 'bg-[#1a1510]'}`}>
      <div className={`absolute inset-0 transition-opacity duration-1000 ${phase === 'opening' ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(141,158,111,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="relative cursor-pointer perspective" onClick={handleOpen}>
        <div
          className={`relative preserve-3d transition-all duration-700 ease-out ${
            phase === 'unsealing' ? 'scale-95' : 'scale-100'
          } ${phase === 'opening' ? 'scale-105 opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
          <div className="relative w-[300px] md:w-[400px]">
            <div className="relative bg-gradient-to-br from-[#4a5e2a] to-[#2d3b17] rounded-sm p-8 md:p-10 shadow-2xl border border-[#6b8a3a]/20">
              <div className="absolute inset-0 opacity-[0.02] overflow-hidden rounded-sm">
                <div className="w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.08) 15px, rgba(255,255,255,0.08) 16px)' }} />
              </div>

              <div className={`relative text-center transition-all duration-500 ${phase === 'opening' ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'}`}>
                <div className="mb-6">
                  <div className="w-10 h-px bg-gold-400/30 mx-auto mb-3" />
                  <span className="text-gold-300/70 text-[11px] tracking-[0.35em] uppercase">Invitación</span>
                  <div className="w-10 h-px bg-gold-400/30 mx-auto mt-3" />
                </div>

                <div className={`transition-all duration-500 ${phase === 'opening' ? 'translate-y-[-8px]' : ''}`}>
                  <h2 className="font-serif text-cream text-3xl md:text-4xl font-light tracking-[0.08em] mb-2">
                    Luz
                  </h2>
                  <span className="inline-block font-script text-gold-300 text-2xl md:text-3xl italic my-1">
                    &amp;
                  </span>
                  <h2 className="font-serif text-cream text-3xl md:text-4xl font-light tracking-[0.08em] mt-2 mb-6">
                    Manuel
                  </h2>
                </div>

                <p className="text-cream/50 text-[11px] tracking-[0.25em] uppercase mb-5">18 de Julio, 2026</p>
                <div className="w-8 h-px bg-gold-400/25 mx-auto mb-5" />
                <p className="text-cream/35 text-[10px] tracking-[0.2em] uppercase leading-relaxed">
                  Tocan la puerta...<br />es el amor que llega para quedarse
                </p>
              </div>

              <div className={`absolute -bottom-7 left-1/2 -translate-x-1/2 transition-all duration-500 ${
                phase === 'unsealing' ? 'scale-[2] opacity-0' :
                phase === 'opening' ? 'scale-150 opacity-0' :
                'scale-100 opacity-100'
              }`}>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-xl shadow-gold-900/40 transition-all duration-300 ${
                  phase === 'unsealing' ? 'shadow-gold-400/60 shadow-2xl' : ''
                }`}>
                  <span className="text-cream font-serif text-2xl font-bold drop-shadow-sm">L</span>
                </div>
              </div>

              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 ${
                phase === 'opening' ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gold-400/80 to-transparent transition-transform duration-500 ease-out origin-center" style={{ transform: phase === 'opening' ? 'scaleX(1)' : 'scaleX(0)' }} />
              </div>
            </div>
          </div>
        </div>

        <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 text-center transition-all duration-500 ${
          phase !== 'closed' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        }`}>
          <p className="text-cream/25 text-[10px] tracking-[0.2em] uppercase animate-pulse-soft">Toca para abrir</p>
        </div>
      </div>
    </div>
  );
}
