import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTitle } from '../ui/SectionTitle';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { GIFT_REGISTRY } from '../../data';

gsap.registerPlugin(ScrollTrigger);

const CARD_NUMBER = '5101 2597 0665 2251';

export function GiftRegistry() {
  const sectionRef = useRef<HTMLElement>(null);
  const gift = GIFT_REGISTRY[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gift-card', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.gift-card', start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  function copyNumber() {
    navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g, ''));
  }

  return (
    <section id="gifts" ref={sectionRef} className="relative py-24 md:py-32 bg-gradient-to-b from-cream via-olive-50/30 to-cream overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <SectionTitle>Mesa de Regalos</SectionTitle>
        <p className="text-center text-slate-500/70 -mt-8 mb-12 font-light text-sm md:text-base max-w-lg mx-auto">
          Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo,
          aquí tienes algunas ideas.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <GlassCard className="gift-card p-8 text-center group hover:-translate-y-1 transition-transform duration-300">
            <div className="text-5xl mb-4 text-gold-500">&#127873;</div>
            <h3 className="font-serif text-2xl text-slate-700 mb-3">Liverpool</h3>
            <p className="text-slate-500/70 text-sm leading-relaxed mb-6">{gift.description}</p>
            <a href={gift.link} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg">Ver lista</Button>
            </a>
          </GlassCard>

          <GlassCard className="gift-card p-8 text-center group hover:-translate-y-1 transition-transform duration-300">
            <div className="text-5xl mb-4 text-olive-500">&#128179;</div>
            <h3 className="font-serif text-2xl text-slate-700 mb-3">Transferencia o Depósito</h3>
            <p className="text-slate-500/70 text-sm leading-relaxed mb-4">
              Tarjeta NU
            </p>
            <div className="bg-olive-50 border border-olive-200 rounded-sm px-4 py-3 mb-4 font-mono text-sm text-slate-700 tracking-wider select-all">
              {CARD_NUMBER}
            </div>
            <button
              onClick={copyNumber}
              className="inline-block border border-olive-300 px-5 py-2 text-xs tracking-[0.12em] uppercase text-olive-600 hover:bg-olive-600 hover:text-cream transition-all duration-300 rounded-sm"
            >
              Copiar número
            </button>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
