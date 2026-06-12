import { cn } from '../../lib/utils';

interface SectionTitleProps {
  children: string;
  align?: 'left' | 'center';
  light?: boolean;
  className?: string;
}

export function SectionTitle({
  children,
  align = 'center',
  light = false,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' && 'text-center',
        className
      )}
    >
      <h2
        className={cn(
          'font-serif text-3xl md:text-5xl font-light tracking-[0.08em]',
          light ? 'text-cream' : 'text-slate-700'
        )}
      >
        {children}
      </h2>
      <div
        className={cn(
          'mt-4 h-px w-16',
          align === 'center' ? 'mx-auto' : '',
          light ? 'bg-gold-400/40' : 'bg-olive-300'
        )}
      />
    </div>
  );
}
