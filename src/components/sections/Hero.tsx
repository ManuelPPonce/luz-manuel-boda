import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Button } from '../ui/Button';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 })
        .fromTo('.hero-names', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2 }, '-=0.4')
        .fromTo('.hero-ampersand', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2)' }, '-=0.6')
        .fromTo('.hero-date', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
        .fromTo('.hero-location', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
        .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3');

      gsap.to('.hero-overlay', { opacity: 0.6, duration: 2, ease: 'power2.inOut' });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-800"
    >
      <div
        className="absolute inset-0 bg-cover bg-[center_right_-4rem] md:bg-center"
        style={{
          backgroundImage: 'url(/images/Hero.jpg)',
        }}
      />
      <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-slate-900/85 via-slate-900/70 to-slate-900/90" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="hero-subtitle text-cream/90 text-sm md:text-base tracking-[0.3em] uppercase mb-8 drop-shadow-lg">
          Nos casamos
        </p>

        <h1 className="hero-names font-serif text-5xl md:text-7xl lg:text-9xl text-cream font-light tracking-[0.08em] leading-tight [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]">
          <span className="block">Luz</span>
          <span className="hero-ampersand block text-6xl md:text-8xl lg:text-[8rem] text-gold-300 font-script italic font-light my-2 md:my-4 drop-shadow-[0_0_12px_rgba(212,175,55,0.5)]">
            &amp;
          </span>
          <span className="block">Manuel</span>
        </h1>

        <div className="hero-date mt-8 md:mt-12">
          <div className="w-12 h-px bg-gold-400/40 mx-auto mb-6" />
          <p className="text-cream/95 text-lg md:text-2xl tracking-[0.25em] uppercase font-light drop-shadow-lg">
            18 de Julio, 2026
          </p>
        </div>

        <p className="hero-location mt-4 text-cream/80 text-sm md:text-base tracking-[0.15em] drop-shadow-lg">
          Holiday Inn Campeche
        </p>

        <div className="hero-cta mt-10 md:mt-14 flex flex-col md:flex-row items-center justify-center gap-4">
          <a href="#gallery">
            <Button variant="outline" size="lg" className="border-cream/30 text-cream hover:bg-cream/10">
              Explorar invitación
            </Button>
          </a>
          <a href="/rsvp">
            <Button variant="primary" size="lg" className="bg-gold-600 hover:bg-gold-700 text-cream">
              Confirmar asistencia
            </Button>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
        <div className="w-6 h-10 rounded-full border border-cream/20 flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 rounded-full bg-cream/40 animate-pulse-soft" />
        </div>
      </div>
    </section>
  );
}
