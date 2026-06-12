import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTitle } from '../ui/SectionTitle';
import { STORY_EVENTS } from '../../data';
import { cn } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger);

export function Story() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.story-card');

      cards.forEach((card, i) => {
        const direction = i % 2 === 0 ? -60 : 60;

        gsap.fromTo(
          card,
          { opacity: 0, x: direction, y: 40 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      gsap.fromTo(
        '.story-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: '.story-timeline',
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-cream overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

      <div className="max-w-6xl mx-auto px-4">
        <SectionTitle>Nuestra Historia</SectionTitle>

        <div className="story-timeline relative mt-16 md:mt-24">
          <div className="story-line absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-rose-200 via-rose-300 to-rose-200 origin-top" />

          {STORY_EVENTS.map((event, i) => (
            <div
              key={event.year}
              className={cn(
                'story-card relative flex items-start gap-6 md:gap-0 mb-16 md:mb-24 last:mb-0',
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              )}
            >
              <div className="hidden md:block md:w-1/2" />

              <div className="relative z-10 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                <div className="w-12 h-12 rounded-full bg-cream border-2 border-rose-300 flex items-center justify-center shadow-lg shadow-rose-200/30">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                </div>
              </div>

              <div
                className={cn(
                  'glass-card p-6 md:p-8 rounded-sm flex-1 md:w-[calc(50%-2.5rem)]',
                  i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'
                )}
              >
                <span className="inline-block font-serif text-3xl md:text-4xl text-rose-300 font-light italic leading-none mb-2">
                  {event.year}
                </span>
                <h3 className="font-serif text-xl md:text-2xl text-night-700 font-medium mb-3">
                  {event.title}
                </h3>
                <p className="text-night-500/80 leading-relaxed font-light text-sm md:text-base">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
