import { useRef, useState } from 'react';

const MUSIC_URL = '/music/playlist.mp3';

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  }

  return (
    <>
      <audio ref={audioRef} src={MUSIC_URL} loop preload="auto" />
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-olive-600 text-cream shadow-lg hover:bg-olive-700 transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95"
        title={playing ? 'Pausar música' : 'Reproducir música'}
      >
        {playing ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>
    </>
  );
}
