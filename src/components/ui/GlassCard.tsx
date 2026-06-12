import type { ReactNode, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  intensity?: 'light' | 'medium' | 'heavy';
}

export function GlassCard({
  children,
  intensity = 'medium',
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'backdrop-blur-xl border shadow-2xl rounded-sm transition-all duration-500 hover:shadow-3xl',
        intensity === 'light' &&
          'bg-white/40 border-olive-200/20 shadow-slate-900/5',
        intensity === 'medium' &&
          'bg-white/60 border-olive-200/30 shadow-slate-900/5',
        intensity === 'heavy' &&
          'bg-white/80 border-olive-200/40 shadow-slate-900/10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
