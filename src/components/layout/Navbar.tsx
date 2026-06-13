import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Galería', href: '#gallery' },
  { label: 'Evento', href: '#event' },
  { label: 'Tu Mesa', href: '#lookup' },
  { label: 'Regalos', href: '#gifts' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
        scrolled
          ? 'bg-cream/90 backdrop-blur-xl shadow-lg shadow-slate-900/5'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center h-16 md:h-20">
        <a
          href="#hero"
          className="font-serif text-xl md:text-2xl tracking-[0.15em] text-olive-600"
        >
          L &amp; M
        </a>

        <div className="hidden md:flex items-center gap-8 ml-auto">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm tracking-[0.12em] uppercase text-slate-600 hover:text-olive-600 transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
