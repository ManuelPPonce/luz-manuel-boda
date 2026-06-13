import { useState } from 'react';

interface InvitationLetterProps {
  onOpen: () => void;
}

export function InvitationLetter({ onOpen }: InvitationLetterProps) {
  const [opened, setOpened] = useState(false);
  const [sealBroken, setSealBroken] = useState(false);

  function handleOpen() {
    setSealBroken(true);
    setTimeout(() => {
      setOpened(true);
      setTimeout(onOpen, 800);
    }, 600);
  }

  if (opened) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(141,158,111,0.15)_0%,transparent_60%)]" />

      <div
        className="relative cursor-pointer perspective"
        onClick={handleOpen}
        style={{ pointerEvents: sealBroken ? 'none' : 'auto' }}
      >
        <div className={`relative transition-all duration-700 ease-in-out ${sealBroken ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`} style={{ transformStyle: 'preserve-3d' }}>
          <div className="relative w-[300px] md:w-[400px]">
            <div className="relative bg-gradient-to-br from-olive-700 to-olive-800 rounded-sm p-8 md:p-10 shadow-2xl border border-olive-600/30">
              <div className="absolute inset-0 opacity-[0.03]">
                <div className="w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px)' }} />
              </div>

              <div className="relative text-center">
                <div className="mb-6">
                  <div className="w-12 h-px bg-gold-400/40 mx-auto mb-4" />
                  <span className="text-gold-400/60 text-xs tracking-[0.3em] uppercase">Invitación</span>
                  <div className="w-12 h-px bg-gold-400/40 mx-auto mt-4" />
                </div>

                <h2 className="font-serif text-cream text-3xl md:text-4xl font-light tracking-[0.08em] mb-2">Luz</h2>
                <span className="font-script text-gold-400 text-2xl italic">&amp;</span>
                <h2 className="font-serif text-cream text-3xl md:text-4xl font-light tracking-[0.08em] mt-2 mb-6">Manuel</h2>

                <p className="text-cream/60 text-xs tracking-[0.25em] uppercase mb-6">18 de Julio, 2026</p>
                <div className="w-12 h-px bg-gold-400/40 mx-auto mb-6" />
                <p className="text-cream/40 text-[10px] tracking-[0.2em] uppercase leading-relaxed">
                  Tocan la puerta...<br />es el amor que llega para quedarse
                </p>
              </div>

              <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 transition-all duration-500 ${sealBroken ? 'scale-150 opacity-0' : ''}`}>
                <div className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center shadow-xl shadow-gold-900/30">
                  <span className="text-cream font-serif text-2xl font-bold">L</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 text-center transition-opacity duration-500 ${sealBroken ? 'opacity-0' : ''}`}>
          <p className="text-cream/30 text-xs tracking-[0.15em] animate-pulse-soft">Toca para abrir</p>
        </div>
      </div>
    </div>
  );
}
