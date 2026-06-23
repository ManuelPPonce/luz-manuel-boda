import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Clock3, Copy, ExternalLink, Gift, Heart, MapPin, Music2, ScrollText, Timer, Utensils } from 'lucide-react';
import { useCountdown } from '../../hooks/useCountdown';
import { COUPLE, GIFT_REGISTRY } from '../../data';

gsap.registerPlugin(ScrollTrigger);

const schedule = [
  { time: '19:00', title: 'Recepción de invitados', note: 'Llegada de los invitados y asignación de mesa', icon: Clock3 },
  { time: '20:00', title: 'Ceremonia civil', note: 'Acompáñanos a decir sí', icon: ScrollText },
  { time: '21:00', title: 'Banquete', note: 'Cena, brindis y celebración', icon: Utensils },
  { time: '23:00', title: 'Baile', note: 'Se abre la pista', icon: Music2 },
];

const galleryImages = [
  '/images/galery/Luz&ManuelSavetheDate-29.webp',
  '/images/galery/Luz&ManuelSavetheDate-45.webp',
  '/images/galery/Luz&ManuelSavetheDate-57.webp',
  '/images/galery/Luz&ManuelSavetheDate-65.webp',
  '/images/galery/Luz&ManuelSavetheDate-70.webp',
  '/images/galery/Luz&ManuelSavetheDate-83.webp',
];

const frameImages = [
  '/images/frame/frame-01.webp',
  '/images/frame/frame-02.webp',
  '/images/frame/frame-03.webp',
  '/images/frame/frame-04.webp',
  '/images/frame/frame-05.webp',
];

const floralImages = {
  corner: '/images/floral/floral-corner-transparent.png',
  bouquet: '/images/floral/floral-bouquet-transparent.png',
  spray: '/images/floral/floral-spray-transparent.png',
};

const CARD_NUMBER = '5101 2597 0665 2251';
const WEDDING_YEAR = 2026;
const WEDDING_MONTH_INDEX = 6;
const WEDDING_DAY = 18;
const weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
const parents = [
  {
    role: 'Padres de la novia',
    names: ['José Rubén Canales Cruz', 'María Del Carmen Mendoza Rodríguez'],
  },
  {
    role: 'Padres del novio',
    names: ['Josué Manuel Pérez Cheng', 'Nubia Del Sugey Ponce'],
  },
];

function FloralDecor({ src, className = '' }: { src: string; className?: string }) {
  return <img src={src} alt="" aria-hidden="true" loading="lazy" className={`floral-decor ${className}`} />;
}

function PaperTear({ tone }: { tone: 'cream' | 'sage' }) {
  return <div className={`paper-tear paper-tear-${tone}`} aria-hidden="true" />;
}

function SectionHeading({ eyebrow, title, light = false }: { eyebrow?: string; title: string; light?: boolean }) {
  return (
    <div className="mx-auto mb-8 max-w-xl text-center">
      {eyebrow && (
        <p className={`mb-3 text-[10px] uppercase tracking-[0.28em] ${light ? 'text-cream' : 'text-olive-700/80'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-serif text-4xl font-light uppercase tracking-[0.08em] md:text-5xl ${light ? 'text-cream' : 'text-olive-900'}`}>
        {title}
      </h2>
      <div className={`mx-auto mt-4 h-px w-14 ${light ? 'bg-cream/75' : 'bg-olive-500/50'}`} />
    </div>
  );
}

function CountdownStrip() {
  const time = useCountdown(COUPLE.date);
  const units = [
    { value: time.days, label: 'Días' },
    { value: time.hours, label: 'Horas' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Seg' },
  ];

  return (
    <div className="mx-auto grid max-w-xl grid-cols-4 gap-2">
      {units.map((unit) => (
        <div key={unit.label} className="countdown-tile">
          <span>{String(unit.value).padStart(2, '0')}</span>
          <small>{unit.label}</small>
        </div>
      ))}
    </div>
  );
}

export function EditorialInvitation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gift = GIFT_REGISTRY[0];
  const [activeImage, setActiveImage] = useState(0);
  const [activeFrame, setActiveFrame] = useState(0);
  const previousImage = (activeImage - 1 + galleryImages.length) % galleryImages.length;
  const nextImage = (activeImage + 1) % galleryImages.length;
  const firstDayOffset = (new Date(WEDDING_YEAR, WEDDING_MONTH_INDEX, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(WEDDING_YEAR, WEDDING_MONTH_INDEX + 1, 0).getDate();

  function copyNumber() {
    navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g, ''));
  }

  function showPreviousImage() {
    setActiveImage((current) => (current - 1 + galleryImages.length) % galleryImages.length);
  }

  function showNextImage() {
    setActiveImage((current) => (current + 1) % galleryImages.length);
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = window.setInterval(() => {
      setActiveFrame((current) => (current + 1) % frameImages.length);
    }, 1300);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.scroll-section').forEach((section) => {
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 44 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.scroll-reveal').forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 86%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      gsap.fromTo(
        '.schedule-row',
        { autoAlpha: 0, x: -28 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.75,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.schedule-list',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        '.map-frame',
        { autoAlpha: 0, scale: 0.96 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.map-frame',
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="invitation" ref={sectionRef} className="bg-[#f6f2ec] text-olive-900">
      <section className="scroll-section paper-section paper-section-cream px-5 py-20 md:px-8 md:py-28">
        <FloralDecor src={floralImages.corner} className="-left-28 bottom-[-150px] w-[390px] -rotate-6 opacity-[0.20] md:-left-32 md:bottom-[-210px] md:w-[620px]" />
        <FloralDecor src={floralImages.bouquet} className="-right-24 top-8 w-[240px] rotate-12 opacity-[0.13] md:-right-20 md:top-14 md:w-[360px]" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="scroll-reveal relative mx-auto w-full max-w-sm">
            <img
              src="/images/hero-mobile.webp"
              alt="Luz y Manuel"
              className="h-[520px] w-full object-cover shadow-[0_24px_60px_rgba(20,30,46,0.14)]"
            />
            <div className="paper-rip absolute -bottom-1 left-0 right-0 h-16 bg-[#f6f2ec]" />
          </div>

          <div className="scroll-reveal text-center md:text-left">
            <p className="font-script text-3xl italic text-olive-700">Queremos compartir este día contigo</p>
            <h2 className="mt-5 font-serif text-4xl font-light uppercase leading-tight tracking-[0.08em] text-olive-900 md:text-6xl">
              Luz<br />&amp; Manuel
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-olive-900/75 md:text-base">
              Con la bendición de nuestras familias, celebraremos el inicio de una vida juntos. Gracias por acompañarnos en una noche de amor y recuerdos.
            </p>
            <div className="mt-8 grid max-w-xl gap-5 border-y border-olive-200/70 py-6 md:grid-cols-2">
              {parents.map((group) => (
                <div key={group.role}>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-olive-700/70">{group.role}</p>
                  <div className="mt-3 space-y-1.5">
                    {group.names.map((name) => (
                      <p key={name} className="font-serif text-base leading-6 text-olive-900 md:text-lg">
                        {name}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 inline-flex items-center justify-center bg-olive-800 px-7 py-3.5 font-serif text-sm uppercase tracking-[0.22em] text-cream md:text-base">
              18 de julio de 2026
            </div>
          </div>
        </div>
        <PaperTear tone="sage" />
      </section>

      <section className="scroll-section paper-section paper-section-sage px-5 py-20 md:px-8 md:py-28">
        <div className="relative z-10">
          <SectionHeading eyebrow="La fecha" title="Calendario" light />
          <div className="scroll-reveal mx-auto max-w-md bg-cream px-7 py-8 text-olive-900 shadow-[0_18px_50px_rgba(20,30,46,0.08)]">
            <p className="mb-5 text-center font-serif text-3xl text-olive-900">Julio</p>
            <div className="mb-5 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-olive-700/60">
              {weekDays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-xs text-olive-900/70">
              {Array.from({ length: firstDayOffset }).map((_, index) => (
                <span key={`empty-${index}`} aria-hidden="true" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                <span key={day} className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${day === WEDDING_DAY ? 'bg-olive-700 text-cream shadow-md shadow-olive-900/20' : ''}`}>
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="scroll-reveal relative z-10 mt-16">
          <SectionHeading eyebrow="Cuenta regresiva" title="Faltan" light />
          <CountdownStrip />
          <div className="mx-auto mt-12 max-w-xl overflow-hidden bg-cream text-olive-900 md:max-w-sm">
            <img
              key={frameImages[activeFrame]}
              src={frameImages[activeFrame]}
              alt="Luz y Manuel"
              className="countdown-frame-image h-80 w-full object-cover object-center md:h-[540px]"
              loading={activeFrame === 0 ? 'eager' : 'lazy'}
            />
            <div className="p-7 text-center">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-olive-50 text-olive-700">
                <Timer className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="font-serif text-2xl text-olive-900">18 de julio de 2026</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-olive-700/60">Luz &amp; Manuel</p>
            </div>
          </div>
        </div>
        <PaperTear tone="cream" />
      </section>

      <section id="event" className="scroll-section paper-section paper-section-cream px-5 py-20 md:px-8 md:py-28">
        <FloralDecor src={floralImages.spray} className="-right-28 bottom-[-150px] w-[330px] rotate-[10deg] opacity-[0.18] md:-right-16 md:bottom-[-190px] md:w-[560px]" />
        <FloralDecor src={floralImages.bouquet} className="-left-28 top-8 w-[220px] -rotate-12 opacity-[0.12] md:-left-10 md:top-12 md:w-[320px]" />
        <SectionHeading eyebrow="Ceremonia y recepción" title="Lugar" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="map-frame relative overflow-hidden bg-white/75 p-2 shadow-[0_24px_60px_rgba(20,30,46,0.12)] ring-1 ring-olive-100">
            <iframe
              src="https://www.google.com/maps?q=Holiday+Inn+Campeche&output=embed"
              title="Mapa de Holiday Inn Campeche"
              className="h-[420px] w-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="scroll-reveal text-center md:text-left">
            <h3 className="font-serif text-4xl font-light text-olive-900">Holiday Inn Campeche</h3>
            <p className="mt-4 text-sm leading-7 text-olive-900/75">Av. Resurgimiento 116, Centro, Campeche</p>
            <a
              href="https://www.google.com/maps?q=Holiday+Inn+Campeche"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 bg-olive-700 px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream transition hover:bg-olive-800"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Ver ubicación
            </a>
          </div>
        </div>
        <PaperTear tone="sage" />
      </section>

      <section className="scroll-section paper-section paper-section-sage px-5 py-20 md:px-8 md:py-28">
        <div className="relative z-10">
          <SectionHeading title="Timing" light />
        </div>
        <p className="scroll-reveal relative z-10 mx-auto -mt-2 mb-12 max-w-2xl text-center text-sm leading-7 text-cream">
          Una noche pensada para celebrar con calma, emoción y muchos recuerdos.
        </p>
        <div className="schedule-list relative z-10 mx-auto max-w-4xl">
          {schedule.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={item.time} className="schedule-row relative grid grid-cols-[72px_44px_1fr] gap-4 py-4 md:grid-cols-[120px_64px_1fr] md:gap-6 md:py-5">
                <div className="pt-2 text-right">
                  <span className="font-serif text-2xl text-cream md:text-4xl">{item.time}</span>
                  <span className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-cream">Hrs</span>
                </div>

                <div className="relative flex justify-center">
                  {index < schedule.length - 1 && (
                    <span className="absolute top-14 h-[calc(100%+1.5rem)] w-px bg-gradient-to-b from-cream/80 via-cream/50 to-transparent" aria-hidden="true" />
                  )}
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-cream/75 bg-cream text-olive-800 shadow-[0_10px_24px_rgba(20,30,46,0.14)] md:h-14 md:w-14">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                <div className="group border border-cream/75 bg-cream p-5 text-olive-900 shadow-[0_14px_34px_rgba(20,30,46,0.08)] transition duration-500 hover:-translate-y-1 hover:border-white hover:shadow-[0_20px_44px_rgba(20,30,46,0.12)] md:p-6">
                  {/* <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-olive-700/80">Momento {index + 1}</p> */}
                  <h3 className="font-serif text-2xl text-olive-900 md:text-3xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-olive-900/75">{item.note}</p>
                </div>
              </div>
            );
          })}
        </div>
        <PaperTear tone="cream" />
      </section>

      <section id="gallery" className="scroll-section paper-section paper-section-cream px-5 py-20 md:px-8 md:py-28">
        <FloralDecor src={floralImages.corner} className="-left-36 bottom-[-210px] w-[420px] -rotate-3 opacity-[0.16] md:-left-28 md:bottom-[-250px] md:w-[650px]" />
        <FloralDecor src={floralImages.spray} className="-right-28 top-0 w-[280px] rotate-[16deg] opacity-[0.12] md:-right-16 md:top-10 md:w-[430px]" />
        <SectionHeading eyebrow="Recuerdos" title="Galería" />
        <p className="scroll-reveal relative z-10 mx-auto max-w-2xl text-center text-sm leading-7 text-olive-900/75">
          Algunos instantes de nuestra historia antes de celebrar este nuevo comienzo con ustedes.
        </p>
        <div className="scroll-reveal relative z-10 mx-auto mt-10 max-w-6xl">
          <div className="grid items-center gap-4 md:grid-cols-[0.68fr_1.14fr_0.68fr]">
            <button
              type="button"
              onClick={showPreviousImage}
              className="group hidden overflow-hidden bg-olive-700/10 p-2 text-left shadow-[0_18px_45px_rgba(20,30,46,0.10)] ring-1 ring-olive-200/70 transition hover:bg-olive-700/14 md:block"
              aria-label="Ver foto anterior"
            >
              <img
                key={previousImage}
                src={galleryImages[previousImage]}
                alt="Foto anterior"
                className="carousel-side-image h-80 w-full object-cover opacity-65 group-hover:scale-105 group-hover:opacity-85"
                loading="lazy"
              />
            </button>

            <div className="relative overflow-hidden bg-white/75 p-2 shadow-[0_28px_70px_rgba(20,30,46,0.16)] ring-1 ring-olive-100">
              <img
                key={activeImage}
                src={galleryImages[activeImage]}
                alt={`Galería Luz y Manuel ${activeImage + 1}`}
                className="carousel-main-image h-[420px] w-full object-cover md:h-[560px]"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-x-2 bottom-2 h-28 bg-gradient-to-t from-olive-900/60 to-transparent" />

              <button
                type="button"
                onClick={showPreviousImage}
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/86 text-olive-800 shadow-lg backdrop-blur transition hover:bg-white"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={showNextImage}
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/86 text-olive-800 shadow-lg backdrop-blur transition hover:bg-white"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>

              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-serif text-sm uppercase tracking-[0.22em] text-cream">
                {String(activeImage + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
              </p>
            </div>

            <button
              type="button"
              onClick={showNextImage}
              className="group hidden overflow-hidden bg-olive-700/10 p-2 text-left shadow-[0_18px_45px_rgba(20,30,46,0.10)] ring-1 ring-olive-200/70 transition hover:bg-olive-700/14 md:block"
              aria-label="Ver foto siguiente"
            >
              <img
                key={nextImage}
                src={galleryImages[nextImage]}
                alt="Foto siguiente"
                className="carousel-side-image h-80 w-full object-cover opacity-65 group-hover:scale-105 group-hover:opacity-85"
                loading="lazy"
              />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {galleryImages.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeImage ? 'w-9 bg-olive-700' : 'w-2.5 bg-olive-700/30 hover:bg-olive-700/60'
                }`}
                aria-label={`Ver foto ${index + 1}`}
                aria-current={index === activeImage}
              />
            ))}
          </div>
        </div>
        <PaperTear tone="sage" />
      </section>

      <section className="scroll-section paper-section paper-section-sage px-5 py-20 md:px-8 md:py-28">
        <div className="relative z-10">
          <SectionHeading eyebrow="" title="CON CARIÑO" light />
        </div>
        <p className="scroll-reveal relative z-10 mx-auto max-w-2xl text-center text-sm leading-7 text-cream">
          Nos emociona celebrar rodeados de las personas que forman parte de nuestra historia. Tu presencia hará que este día sea todavía más especial.
        </p>
        <div className="scroll-reveal relative z-10 mt-10 text-center">
          <Link id="confirmar-asistencia" to="/rsvp" className="inline-flex scroll-mt-28 items-center justify-center gap-2 bg-cream px-6 py-3 text-xs uppercase tracking-[0.18em] text-olive-800 shadow-[0_14px_34px_rgba(20,30,46,0.12)] transition hover:bg-white">
            <Heart className="h-4 w-4" aria-hidden="true" />
            Confirmar asistencia
          </Link>
        </div>
        <PaperTear tone="cream" />
      </section>

      <section id="gifts" className="scroll-section paper-section paper-section-cream px-5 py-20 md:px-8 md:py-28">
        <FloralDecor src={floralImages.spray} className="-left-20 bottom-[-90px] w-[320px] rotate-[8deg] opacity-[0.12] md:left-0 md:bottom-[-140px] md:w-[500px]" />
        <FloralDecor src={floralImages.bouquet} className="-right-20 top-10 w-[220px] rotate-12 opacity-[0.12] md:right-10 md:top-16 md:w-[300px]" />
        <div className="relative z-10">
          <SectionHeading eyebrow="Mesa" title="Regalos" />
        </div>
        <div className="gift-grid relative z-10 mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          <div className="gift-panel scroll-reveal border border-olive-100 bg-white/70 p-8 text-center">
            <Gift className="mx-auto mb-5 h-8 w-8 text-olive-700" aria-hidden="true" />
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-olive-700/70">Liverpool</p>
            <h3 className="font-serif text-3xl text-olive-900 md:text-4xl">Mesa de regalos</h3>
            <p className="mx-auto mt-4 max-w-md text-base leading-8 text-olive-900/75 md:text-lg">{gift.description}</p>
            <a href={gift.link} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center justify-center gap-2 bg-olive-700 px-7 py-3.5 text-sm uppercase tracking-[0.16em] text-cream transition hover:bg-olive-800">
              Ver lista
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="gift-panel scroll-reveal border border-olive-100 bg-white/70 p-8 text-center">
            <Copy className="mx-auto mb-5 h-8 w-8 text-olive-700" aria-hidden="true" />
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-olive-700/70">Transferencia</p>
            <h3 className="font-serif text-3xl text-olive-900 md:text-4xl">Tarjeta NU</h3>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-olive-700/60">Número de tarjeta</p>
            <p className="mt-2 font-mono text-lg tracking-[0.12em] text-olive-900/80 md:text-xl">{CARD_NUMBER}</p>
            <button onClick={copyNumber} className="mt-7 inline-flex items-center justify-center gap-2 border border-olive-300 px-7 py-3.5 text-sm uppercase tracking-[0.16em] text-olive-700 transition hover:bg-olive-50">
              Copiar tarjeta
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
