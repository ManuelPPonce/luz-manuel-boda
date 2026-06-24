import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CalendarDays, ChevronDown, Clock3, MapPin, Send } from 'lucide-react';

function AnimatedLetters({ text, start = 0 }: { text: string; start?: number }) {
  let letterIndex = start;

  return (
    <span className="block" aria-hidden="true">
      {[...text].map((char, index) => {
        const delay = `${letterIndex * 72}ms`;
        letterIndex += 1;

        return (
          <span
            key={`${char}-${index}`}
            className={char === ' ' ? 'inline-block w-[0.32em]' : 'hero-letter inline-block'}
            style={{ animationDelay: delay }}
          >
            {char === ' ' ? '\u00a0' : char}
          </span>
        );
      })}
    </span>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-date', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 1.3 })
        .fromTo('.hero-time', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.45')
        .fromTo('.hero-location', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.35')
        .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
        .fromTo('.hero-scroll', { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.15');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#d8d7d3]"
    >
      <picture className="absolute inset-0">
        <source media="(min-width: 768px)" srcSet="/images/hero.webp" />
        <img
          src="/images/hero-mobile.webp"
          alt="Luz y Manuel"
          className="h-full w-full object-cover object-center"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-b from-[#111513]/50 via-[#111513]/25 to-[#111513]/90" />
      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#111513]/90 via-[#111513]/60 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(17,21,19,0.18)_58%,rgba(17,21,19,0.42)_100%)]" />
      <div className="paper-rip absolute bottom-[-1px] left-0 right-0 h-20 bg-[#f6f2ec]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-end px-5 pb-24 pt-28 text-center text-cream">
        <p className="hero-title-glow mb-5 font-serif text-5xl font-light uppercase leading-[0.9] tracking-[0.08em] md:text-7xl" aria-label="Wedding Day">
          <AnimatedLetters text="Wedding" />
          <AnimatedLetters text="Day" start={7} />
        </p>

        <h1 className="hero-title-glow font-serif text-4xl font-light leading-tight md:text-6xl" aria-label="Luz y Manuel">
          <AnimatedLetters text="Luz & Manuel" start={11} />
        </h1>

        <div className="hero-date mt-6">
          <div className="mx-auto mb-5 h-px w-16 bg-cream/65" />
          <p className="flex items-center justify-center gap-2 text-sm font-light uppercase tracking-[0.24em] drop-shadow-lg md:text-lg">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            18.07.2026
          </p>
        </div>

        <p className="hero-time mt-3 flex items-center justify-center gap-2 text-xs font-light uppercase tracking-[0.2em] text-cream/95 drop-shadow-lg md:text-sm">
          <Clock3 className="h-4 w-4" aria-hidden="true" />
          7:00 PM
        </p>

        <p className="hero-location mt-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.16em] text-cream/90 drop-shadow-lg md:text-sm">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          Holiday Inn Campeche
        </p>

        <div className="hero-cta mt-8">
          <a
            href="#confirmar-asistencia"
            className="relative inline-flex items-center justify-center overflow-hidden bg-olive-800/95 px-12 py-4 font-serif text-base uppercase tracking-[0.15em] text-cream shadow-xl shadow-slate-900/25 transition-all duration-500 hover:bg-olive-900 active:scale-[0.97]"
          >
            <span className="inline-flex items-center gap-2">
              Confirmar
              <Send className="h-4 w-4" aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>

      <div className="hero-scroll absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 animate-float flex-col items-center gap-1 text-olive-700/70">
        <span className="text-[9px] uppercase tracking-[0.22em]">Desliza</span>
        <ChevronDown className="h-6 w-6" aria-hidden="true" />
      </div>
    </section>
  );
}
