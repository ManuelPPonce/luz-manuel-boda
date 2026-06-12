import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COUPLE } from '../../data';

gsap.registerPlugin(ScrollTrigger);

export function FinalMessage() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.final-title', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.final-section', start: 'top 80%', toggleActions: 'play none none reverse' },
      });
      gsap.fromTo('.final-text', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.4,
        scrollTrigger: { trigger: '.final-section', start: 'top 80%', toggleActions: 'play none none reverse' },
      });
      gsap.fromTo('.final-signature', { opacity: 0, scale: 0.8 }, {
        opacity: 1, scale: 1, duration: 1, ease: 'back.out(2)', delay: 0.8,
        scrollTrigger: { trigger: '.final-section', start: 'top 80%', toggleActions: 'play none none reverse' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="final-section relative py-32 md:py-48 bg-slate-800 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(141,158,111,0.12)_0%,transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <div className="final-title mb-8">
          <span className="text-gold-400/40 text-2xl font-serif italic">&ldquo;</span>
        </div>

        <p className="final-text text-cream/80 text-lg md:text-2xl font-light leading-relaxed font-script italic">
          El amor no mira con los ojos, sino con el alma...
          <br /><br />
          Gracias por ser parte de nuestra historia.
          <br />
          Cada persona que amamos es un capítulo,
          <br />
          y hoy cerramos uno para empezar el más hermoso de todos.
        </p>

        <div className="final-signature mt-12">
          <div className="w-16 h-px bg-gold-400/30 mx-auto mb-6" />
          <p className="font-serif text-2xl md:text-3xl text-cream font-light tracking-[0.15em]">{COUPLE.bride}</p>
          <p className="font-script text-2xl text-gold-400/60 my-2">&amp;</p>
          <p className="font-serif text-2xl md:text-3xl text-cream font-light tracking-[0.15em]">{COUPLE.groom}</p>
          <p className="mt-6 text-cream/40 text-sm tracking-[0.2em] uppercase">18 · 07 · 2026</p>
        </div>

        <div className="final-text mt-16">
          <span className="text-gold-400/40 text-2xl font-serif italic">&rdquo;</span>
        </div>
      </div>
    </section>
  );
}
