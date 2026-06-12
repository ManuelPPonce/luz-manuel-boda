import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden font-serif tracking-[0.15em] uppercase transition-all duration-500',
        size === 'sm' && 'px-5 py-2 text-xs',
        size === 'md' && 'px-8 py-3 text-sm',
        size === 'lg' && 'px-12 py-4 text-base',
        variant === 'primary' &&
          'bg-olive-600 text-cream hover:bg-olive-700 active:scale-[0.97]',
        variant === 'outline' &&
          'border border-olive-300/50 text-cream hover:bg-olive-600/20 active:scale-[0.97]',
        variant === 'ghost' &&
          'text-olive-600 hover:bg-olive-50 active:scale-[0.97]',
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
