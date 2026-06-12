import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTitle } from '../ui/SectionTitle';

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  { id: '1', src: '/images/galery/Luz&ManuelSavetheDate-29.jpg', alt: 'Foto 1', w: 600, h: 800 },
  { id: '2', src: '/images/galery/Luz&ManuelSavetheDate-45.jpg', alt: 'Foto 2', w: 800, h: 600 },
  { id: '3', src: '/images/galery/Luz&ManuelSavetheDate-57.jpg', alt: 'Foto 3', w: 600, h: 600 },
  { id: '4', src: '/images/galery/Luz&ManuelSavetheDate-65.jpg', alt: 'Foto 4', w: 800, h: 700 },
  { id: '5', src: '/images/galery/Luz&ManuelSavetheDate-70.jpg', alt: 'Foto 5', w: 600, h: 900 },
  { id: '6', src: '/images/galery/Luz&ManuelSavetheDate-71.jpg', alt: 'Foto 6', w: 800, h: 600 },
  { id: '7', src: '/images/galery/Luz&ManuelSavetheDate-77.jpg', alt: 'Foto 7', w: 700, h: 600 },
  { id: '8', src: '/images/galery/Luz&ManuelSavetheDate-83.jpg', alt: 'Foto 8', w: 600, h: 700 },
];

export function Gallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gallery-item', { opacity: 0, scale: 0.9, y: 30 }, {
        opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: '.gallery-grid', start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (lightbox) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  return (
    <section id="gallery" ref={sectionRef} className="relative py-24 md:py-32 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <SectionTitle>Galería</SectionTitle>

        <div className="gallery-grid columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 mt-12">
          {IMAGES.map((img) => (
            <button key={img.id} onClick={() => setLightbox(img.src)} className="gallery-item mb-3 md:mb-4 block w-full overflow-hidden group cursor-pointer border-0 p-0 bg-transparent">
              <div className="relative overflow-hidden rounded-sm">
                <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" style={{ aspectRatio: `${img.w}/${img.h}` }} />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-500 flex items-center justify-center">
                  <span className="text-cream text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">+</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-cream/60 hover:text-cream text-3xl transition-colors" aria-label="Cerrar">&times;</button>
          <img src={lightbox} alt="Foto ampliada" className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
