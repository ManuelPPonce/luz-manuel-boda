import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL = 5;

export function FrameAnimation() {
  const [frame, setFrame] = useState(1);
  const [ready, setReady] = useState(false);
  const loadedRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startFrame: number; active: boolean }>({ startX: 0, startFrame: 1, active: false });

  useEffect(() => {
    for (let i = 1; i <= TOTAL; i++) {
      const img = new Image();
      img.onload = () => { loadedRef.current++; if (loadedRef.current === TOTAL) setReady(true); };
      img.onerror = () => { loadedRef.current++; if (loadedRef.current === TOTAL) setReady(true); };
      img.src = `/images/frame/frame-${String(i).padStart(2, '0')}.jpg`;
    }
  }, []);

  const handleDragStart = useCallback((clientX: number) => {
    dragRef.current = { startX: clientX, startFrame: frame, active: true };
  }, [frame]);

  const handleDragMove = useCallback((clientX: number) => {
    if (!dragRef.current.active || !containerRef.current) return;
    const dx = clientX - dragRef.current.startX;
    const containerW = containerRef.current.clientWidth;
    const threshold = containerW / TOTAL;
    const shift = Math.round(dx / threshold);
    const newFrame = Math.max(1, Math.min(TOTAL, dragRef.current.startFrame + shift));
    setFrame(newFrame);
  }, []);

  const handleDragEnd = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  const mouseDown = useCallback((e: React.MouseEvent) => { handleDragStart(e.clientX); }, [handleDragStart]);
  const touchStart = useCallback((e: React.TouchEvent) => { handleDragStart(e.touches[0].clientX); }, [handleDragStart]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => handleDragMove(e.clientX);
    const onUp = () => handleDragEnd();
    const onTouch = (e: TouchEvent) => handleDragMove(e.touches[0].clientX);
    const onTouchEnd = () => handleDragEnd();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  if (!ready) return null;

  return (
    <section className="relative py-16 md:py-32 bg-cream overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <p className="text-olive-400/60 text-xs md:text-sm tracking-[0.3em] uppercase">Nuestra historia en movimiento</p>
          <h2 className="font-serif text-2xl md:text-4xl text-slate-700 font-light tracking-[0.08em] mt-2">
            Desliza sobre la foto
          </h2>
        </div>

        <div className="w-full max-w-3xl mx-auto">
          <div
            ref={containerRef}
            onMouseDown={mouseDown}
            onTouchStart={touchStart}
            className="relative w-full rounded-sm overflow-hidden shadow-xl bg-olive-100 cursor-ew-resize select-none active:cursor-grabbing"
            style={{ aspectRatio: '4 / 3' }}
          >
            <img
              src={`/images/frame/frame-${String(frame).padStart(2, '0')}.jpg`}
              alt="Animación"
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-cream/50 text-xs tracking-[0.15em] uppercase bg-slate-900/30 px-3 py-1 rounded-full backdrop-blur-sm">
                Arrastra para ver más
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto mt-4 md:mt-6 px-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono w-4 text-right">{frame}</span>
            <div className="flex-1 relative h-2">
              <div className="absolute inset-0 bg-olive-200 rounded-full" />
              <div className="absolute top-0 left-0 h-full bg-olive-500 rounded-full transition-all duration-100" style={{ width: `${(frame / TOTAL) * 100}%` }} />
              <input type="range" min={1} max={TOTAL} value={frame}
                onChange={(e) => setFrame(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <span className="text-xs text-slate-400 font-mono w-4">{TOTAL}</span>
          </div>
          <div className="flex justify-center gap-2 mt-3">
            {Array.from({ length: TOTAL }, (_, i) => (
              <button key={i} onClick={() => setFrame(i + 1)}
                className={`rounded-full transition-all duration-200 ${
                  frame === i + 1 ? 'bg-olive-600 w-6 h-2' : 'bg-olive-200 hover:bg-olive-400 w-2 h-2'
                }`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
