import { useState } from 'react';

interface InvitationLetterProps {
  onOpen: () => void;
}

type Phase = 'closed' | 'opening' | 'opened';

export function InvitationLetter({ onOpen }: InvitationLetterProps) {
  const [phase, setPhase] = useState<Phase>('closed');

  function handleOpen() {
    if (phase !== 'closed') return;
    setPhase('opening');
    setTimeout(() => {
      setPhase('opened');
      setTimeout(onOpen, 600);
    }, 2400);
  }

  if (phase === 'opened') return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-colors duration-1000 ${
        phase === 'opening' ? 'bg-[#f5f0e8]' : 'bg-[#1a1510]'
      }`}
      onClick={phase === 'closed' ? handleOpen : undefined}
    >
      <div className={`absolute inset-0 transition-opacity duration-1000 ${phase === 'opening' ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_60%)]" />
      </div>

      <div className="relative preserve-3d" style={{ perspective: '1200px' }}>
        {/* Envelope */}
        <div
          className={`relative transition-all duration-700 ${
            phase === 'opening' ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100'
          }`}
        >
          {/* Envelope flap */}
          <div
            className={`absolute top-0 left-0 right-0 z-20 origin-top transition-transform duration-700 ease-in-out ${
              phase === 'opening' ? 'rotate-x-[-160deg]' : 'rotate-x-0'
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className="w-[300px] h-[70px] md:w-[380px] md:h-[80px] mx-auto"
              style={{
                clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                background: 'linear-gradient(180deg, #c4a44a 0%, #a88830 100%)',
              }}
            />
            <div
              className="absolute -bottom-[2px] left-0 right-0 h-[3px]"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.15) 70%, transparent 100%)',
              }}
            />
          </div>

          {/* Envelope body */}
          <div className="relative w-[300px] md:w-[380px] mx-auto">
            {/* Back of envelope (visible above flap area) */}
            <div
              className="w-full h-[50px] md:h-[60px]"
              style={{
                background: 'linear-gradient(180deg, #d4bc6a 0%, #c4a44a 100%)',
                clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)',
              }}
            />

            {/* Main envelope body */}
            <div
              className="w-full h-[220px] md:h-[280px] relative"
              style={{
                background: 'linear-gradient(180deg, #c4a44a 0%, #b89430 40%, #a88830 100%)',
                borderRadius: '0 0 4px 4px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {/* Envelope inner shadow */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)',
                borderRadius: '0 0 4px 4px',
              }} />

              {/* Seal */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                    phase === 'opening' ? 'scale-[3] opacity-0' : 'scale-100 opacity-100'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #d4a020 0%, #b8860b 50%, #8b6508 100%)',
                    boxShadow: '0 4px 20px rgba(139, 101, 8, 0.5), 0 0 0 3px rgba(168, 136, 48, 0.2)',
                  }}
                >
                  <span className="text-cream font-serif text-xl md:text-2xl font-bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                    L
                  </span>
                </div>
              </div>

              {/* "Toca para abrir" text */}
              <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 transition-all duration-500 ${
                phase === 'opening' ? 'opacity-0' : 'opacity-100'
              }`}>
                <p className="text-[#a88830]/40 text-[10px] tracking-[0.2em] uppercase animate-pulse-soft whitespace-nowrap">
                  Toca para abrir
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Letter coming out */}
        <div
          className={`absolute top-0 left-0 right-0 z-30 transition-all duration-800 ease-out ${
            phase === 'opening' ? 'translate-y-[-60%] opacity-100' : 'translate-y-0 opacity-0 pointer-events-none'
          }`}
          style={{ transitionDelay: phase === 'opening' ? '700ms' : '0ms' }}
        >
          <div className="w-[280px] md:w-[360px] mx-auto bg-[#fdfaf5] rounded-sm shadow-2xl p-6 md:p-8 relative"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
            }}
          >
            {/* Paper texture */}
            <div className="absolute inset-0 opacity-[0.03] rounded-sm" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 3px)',
            }} />

            <div className="relative text-center">
              <div className="mb-4">
                <div className="w-10 h-px bg-[#c4a44a]/30 mx-auto mb-3" />
                <span className="text-[#8b7355] text-[11px] tracking-[0.3em] uppercase">Invitación</span>
                <div className="w-10 h-px bg-[#c4a44a]/30 mx-auto mt-3" />
              </div>

              <h2 className="font-serif text-[#3d3226] text-2xl md:text-3xl font-light tracking-[0.08em] mb-1">
                Luz
              </h2>
              <span className="inline-block font-script text-[#c4a44a] text-xl md:text-2xl italic my-1">
                &amp;
              </span>
              <h2 className="font-serif text-[#3d3226] text-2xl md:text-3xl font-light tracking-[0.08em] mt-1 mb-4">
                Manuel
              </h2>

              <p className="text-[#8b7355]/60 text-[11px] tracking-[0.2em] uppercase mb-4">
                18 de Julio, 2026
              </p>
              <div className="w-8 h-px bg-[#c4a44a]/20 mx-auto mb-4" />
              <p className="text-[#8b7355]/40 text-[10px] tracking-[0.15em] uppercase leading-relaxed">
                Tocan la puerta...<br />es el amor que llega para quedarse
              </p>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#c4a44a]/20" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#c4a44a]/20" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#c4a44a]/20" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#c4a44a]/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
