import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTitle } from '../ui/SectionTitle';
import { GlassCard } from '../ui/GlassCard';
import { EVENT_DETAILS } from '../../data';

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<string, string> = {
  guests: '\u2728',
  civil: '\u2696',
  party: '\u2668',
};

export function EventInfo() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.event-card', { opacity: 0, x: -40 }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', stagger: 0.3,
        scrollTrigger: { trigger: '.events-timeline', start: 'top 80%', toggleActions: 'play none none reverse' },
      });
      gsap.fromTo('.timeline-line', { scaleY: 0 }, {
        scaleY: 1, duration: 1.5, ease: 'power2.inOut',
        scrollTrigger: { trigger: '.events-timeline', start: 'top 80%', end: 'bottom 20%', scrub: 1 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="event" ref={sectionRef} className="relative py-24 md:py-32 bg-gradient-to-b from-cream via-olive-50/30 to-cream overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <SectionTitle>El Evento</SectionTitle>

        <div className="events-timeline relative mt-16 md:mt-20">
          <div className="timeline-line absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-olive-300 via-olive-400 to-olive-300 origin-top" />

          {EVENT_DETAILS.map((event, i) => (
            <div key={event.title} className={`event-card relative flex items-start gap-6 mb-12 md:mb-16 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="hidden md:block md:w-1/2" />

              <div className="relative z-10 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cream border-2 border-olive-300 flex items-center justify-center shadow-lg shadow-olive-200/30">
                  <span className="text-lg md:text-xl">{ICONS[event.icon] || '\u2661'}</span>
                </div>
              </div>

              <GlassCard className={`flex-1 p-5 md:p-7 md:w-[calc(50%-2.5rem)] ${i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-serif text-2xl md:text-3xl text-olive-400 font-light italic leading-none">{event.time}</span>
                  <span className="text-xs text-slate-400 tracking-[0.1em] uppercase">{event.date}</span>
                </div>
                <h3 className="font-serif text-lg md:text-xl text-slate-700 mb-2">{event.title}</h3>
                <div className="h-px w-10 bg-olive-200 mb-3" />
                <p className="text-slate-700 font-medium text-sm">{event.location}</p>
                <p className="text-slate-500/60 text-xs mt-0.5 mb-3">{event.address}</p>
                <span className="inline-block border border-olive-200 px-2.5 py-0.5 text-[9px] tracking-[0.15em] uppercase text-olive-600 rounded-sm">
                  {event.dressCode}
                </span>
              </GlassCard>
            </div>
          ))}
        </div>

        <div className="mt-16 glass-card p-6 md:p-8 overflow-hidden rounded-sm">
          <h3 className="font-serif text-xl text-olive-700 mb-4 text-center">¿Cómo llegar?</h3>
          <div className="aspect-video w-full bg-olive-50 rounded-sm overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=Holiday+Inn+Campeche&output=embed"
              width="100%" height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa - Holiday Inn Campeche"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
