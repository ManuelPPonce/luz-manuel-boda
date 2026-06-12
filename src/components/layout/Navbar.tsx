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
  const [open, setOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <a
          href="#hero"
          className="font-serif text-xl md:text-2xl tracking-[0.15em] text-olive-600"
        >
          L &amp; M
        </a>

        <button
          className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          <span className={cn('block h-px w-6 bg-slate-700 transition-all duration-300', open && 'rotate-45 translate-y-[3.5px]')} />
          <span className={cn('block h-px w-6 bg-slate-700 transition-all duration-300', open && 'opacity-0')} />
          <span className={cn('block h-px w-6 bg-slate-700 transition-all duration-300', open && '-rotate-45 -translate-y-[3.5px]')} />
        </button>

        <div className={cn('hidden md:flex items-center gap-8', open && 'flex')}>
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

      {open && (
        <div className="md:hidden bg-cream/95 backdrop-blur-xl border-t border-olive-100">
          <div className="px-4 py-6 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm tracking-[0.12em] uppercase text-slate-600 hover:text-olive-600 transition-colors py-2"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
