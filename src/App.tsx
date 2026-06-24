import { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/layout/Navbar';
import { MusicPlayer } from './components/effects/MusicPlayer';
import { EditorialInvitation } from './components/sections/EditorialInvitation';
import { Hero } from './components/sections/Hero';
import { IntroVideo } from './components/sections/IntroVideo';
import { RSVPPage } from './pages/RSVPPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminGuests } from './pages/admin/AdminGuests';
import { AdminTables } from './pages/admin/AdminTables';
import { AdminCheckIn } from './pages/admin/AdminCheckIn';

gsap.registerPlugin(ScrollTrigger);

const INTRO_SEEN_KEY = 'luz-manuel-intro-seen';

function MainContent() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const resumeAfterReturnRef = useRef(false);
  const [introOpen, setIntroOpen] = useState(true);
  const [introKey, setIntroKey] = useState(0);
  const [introSeen, setIntroSeen] = useState(() => {
    try {
      return window.localStorage.getItem(INTRO_SEEN_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const playMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || document.hidden) return;

    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, []);

  const closeIntro = useCallback(() => {
    try {
      window.localStorage.setItem(INTRO_SEEN_KEY, 'true');
    } catch {}
    setIntroSeen(true);
    playMusic();
    setIntroOpen(false);
  }, [playMusic]);

  useEffect(() => {
    const smoothScroll = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = (target as HTMLAnchorElement).getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    document.addEventListener('click', smoothScroll);
    return () => document.removeEventListener('click', smoothScroll);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    const pauseForBackground = () => {
      resumeAfterReturnRef.current = !audio.paused;
      audio.pause();
    };

    const resumeIfNeeded = () => {
      if (!resumeAfterReturnRef.current || document.hidden) return;
      resumeAfterReturnRef.current = false;
      playMusic();
    };

    const onVisibility = () => {
      if (document.hidden) {
        pauseForBackground();
      } else {
        resumeIfNeeded();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', pauseForBackground);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', pauseForBackground);
    };
  }, [playMusic]);

  useEffect(() => {
    if (introOpen) return;

    const startOnInteraction = () => playMusic();
    document.addEventListener('pointerdown', startOnInteraction, { once: true });
    document.addEventListener('keydown', startOnInteraction, { once: true });
    document.addEventListener('touchstart', startOnInteraction, { once: true });

    return () => {
      document.removeEventListener('pointerdown', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
    };
  }, [introOpen, playMusic]);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      setIntroKey((current) => current + 1);
      setIntroOpen(true);
    };

    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  return (
    <>
      {introOpen && <IntroVideo key={introKey} onComplete={closeIntro} showSkipButton={introSeen} />}
      {!introOpen && (
        <>
          <Navbar />
          <main>
            <Hero key={introKey} />
            <EditorialInvitation />
          </main>
          <footer className="border-t border-cream/20 bg-[#667150] py-6 text-center">
            <div className="mx-auto max-w-md px-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-cream">
                &copy; {new Date().getFullYear()} Luz &amp; Manuel
              </p>
            </div>
          </footer>
          <MusicPlayer audioRef={audioRef} />
        </>
      )}
      <audio ref={audioRef} src="/music/playlist-v2.mp3" loop preload="auto" />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/rsvp" element={<RSVPPage />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/guests" element={<AdminGuests />} />
      <Route path="/admin/tables" element={<AdminTables />} />
      <Route path="/admin/checkin" element={<AdminCheckIn />} />
      <Route path="*" element={<MainContent />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
