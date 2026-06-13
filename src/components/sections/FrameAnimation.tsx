import { useEffect, useRef, useState } from 'react';

const TOTAL = 5;
const INTERVAL_MS = 2500;

export function FrameAnimation() {
  const [frame, setFrame] = useState(1);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const loadedRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    for (let i = 1; i <= TOTAL; i++) {
      const img = new Image();
      img.onload = () => { loadedRef.current++; if (loadedRef.current === TOTAL) setReady(true); };
      img.onerror = () => { loadedRef.current++; if (loadedRef.current === TOTAL) setReady(true); };
      img.src = `/images/frame/frame-${String(i).padStart(2, '0')}.jpg`;
    }
  }, []);

  useEffect(() => {
    if (!ready || paused) return;
    intervalRef.current = setInterval(() => {
      setFrame((prev) => (prev >= TOTAL ? 1 : prev + 1));
    }, INTERVAL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [ready, paused]);

  if (!ready) return null;

  return (
    <section className="relative py-16 md:py-32 bg-cream overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <p className="text-olive-400/60 text-xs md:text-sm tracking-[0.3em] uppercase">Nuestra historia en movimiento</p>
          <h2 className="font-serif text-2xl md:text-4xl text-slate-700 font-light tracking-[0.08em] mt-2">
            Nuestra historia
          </h2>
        </div>

        <div className="w-full max-w-3xl mx-auto">
          <div className="relative w-full rounded-sm overflow-hidden shadow-xl bg-olive-100 select-none"
            style={{ aspectRatio: '4 / 3' }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <img
              src={`/images/frame/frame-${String(frame).padStart(2, '0')}.jpg`}
              alt="Animación"
              className="w-full h-full object-cover pointer-events-none transition-opacity duration-300"
              draggable={false}
            />
          </div>
        </div>

        <div className="max-w-xl mx-auto mt-4 md:mt-6 px-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono w-4 text-right">{frame}</span>
            <div className="flex-1 relative h-2">
              <div className="absolute inset-0 bg-olive-200 rounded-full" />
              <div className="absolute top-0 left-0 h-full bg-olive-500 rounded-full transition-all duration-300" style={{ width: `${(frame / TOTAL) * 100}%` }} />
              <input type="range" min={1} max={TOTAL} value={frame}
                onChange={(e) => { setPaused(true); setFrame(Number(e.target.value)); }}
                onMouseUp={() => setPaused(false)}
                onTouchEnd={() => setPaused(false)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <span className="text-xs text-slate-400 font-mono w-4">{TOTAL}</span>
          </div>
          <div className="flex justify-center gap-2 mt-3">
            {Array.from({ length: TOTAL }, (_, i) => (
              <button key={i} onClick={() => { setPaused(true); setFrame(i + 1); setTimeout(() => setPaused(false), INTERVAL_MS); }}
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
