import { useEffect, useRef, useState } from 'react';

interface IntroVideoProps {
  onComplete: () => void;
}

export function IntroVideo({ onComplete }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.load();
    video.play().catch(() => {});
  }, []);

  return (
    <section className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#d8d7d3]">
      <picture className="absolute inset-0">
        <source media="(min-width: 768px)" srcSet="/images/hero.webp" />
        <img
          src="/images/hero-mobile.webp"
          alt=""
          className="h-full w-full scale-105 object-cover opacity-60 blur-xl"
          aria-hidden="true"
        />
      </picture>
      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(216,215,211,0.94)_0%,rgba(246,242,236,0.74)_35%,rgba(246,242,236,0.68)_65%,rgba(141,158,111,0.45)_100%)] md:block" />
      <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_center,transparent_0%,rgba(20,30,46,0.20)_72%,rgba(20,30,46,0.36)_100%)] md:block" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#111513]/50 via-[#111513]/20 to-[#111513]/60 md:hidden" />

      <div className="relative h-full w-full md:flex md:items-center md:justify-center md:px-10 md:py-8">
        <div className="relative h-full w-full md:aspect-[9/16] md:h-[calc(100svh-64px)] md:w-auto md:max-w-[min(44vw,520px)]">
          <video
            ref={videoRef}
            className={`h-full w-full object-cover transition-opacity duration-700 md:object-contain md:shadow-[0_28px_80px_rgba(20,30,46,0.28)] md:ring-1 md:ring-white/65 ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
            src="/video/card.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/images/hero-mobile.webp"
            onLoadedData={() => {
              setVideoReady(true);
            }}
            onCanPlay={() => {
              setVideoReady(true);
            }}
            onEnded={onComplete}
            aria-label="Intro de boda de Luz y Manuel"
          />
          <button type="button" onClick={onComplete} className="intro-enter-button">
            Entrar
          </button>
        </div>
      </div>
      {!videoReady && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-cream">
          <p className="font-serif text-4xl font-light uppercase leading-[0.95] tracking-[0.08em] drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)] md:text-6xl">
            Luz<br />&amp; Manuel
          </p>
          <p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-cream/80">Cargando intro</p>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#111513]/10 via-transparent to-[#111513]/25 md:from-[#111513]/0 md:to-[#111513]/20" />
    </section>
  );
}
