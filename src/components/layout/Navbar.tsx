import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Invitacion', href: '#invitation' },
  { label: 'Evento', href: '#event' },
  { label: 'Galería', href: '#gallery' },
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
        'fixed left-0 right-0 top-0 z-40 transition-all duration-500',
        scrolled ? 'bg-cream/95 shadow-lg shadow-olive-900/5 backdrop-blur-xl' : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4 md:h-20">
        <a
          href="#hero"
          className={cn(
            'font-serif text-xl tracking-[0.15em] transition-colors md:text-2xl',
            scrolled ? 'text-olive-700' : 'text-cream'
          )}
        >
          L &amp; M
        </a>

        <div className="ml-auto hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm uppercase tracking-[0.12em] transition-colors duration-300',
                scrolled ? 'text-olive-800/80 hover:text-olive-700' : 'text-cream/90 hover:text-white'
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
