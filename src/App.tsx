import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/layout/Navbar';
import { Particles } from './components/effects/Particles';
import { MusicPlayer } from './components/effects/MusicPlayer';
import { InvitationLetter } from './components/sections/InvitationLetter';
import { Hero } from './components/sections/Hero';
import { Countdown } from './components/sections/Countdown';
import { CalendarSection } from './components/sections/CalendarSection';

import { Gallery } from './components/sections/Gallery';
import { FrameAnimation } from './components/sections/FrameAnimation';
import { EventInfo } from './components/sections/EventInfo';

import { GiftRegistry } from './components/sections/GiftRegistry';
import { RSVPPage } from './pages/RSVPPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminGuests } from './pages/admin/AdminGuests';
import { AdminTables } from './pages/admin/AdminTables';
import { AdminCheckIn } from './pages/admin/AdminCheckIn';

gsap.registerPlugin(ScrollTrigger);

function MainContent() {
  const [letterOpened, setLetterOpened] = useState(
    () => localStorage.getItem('letter-opened') === 'true'
  );

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

  function handleLetterOpen() {
    localStorage.setItem('letter-opened', 'true');
    setLetterOpened(true);
  }

  return (
    <>
      {!letterOpened && <InvitationLetter onOpen={handleLetterOpen} />}
      <Navbar />
      <main>
        <Hero />
        <section className="py-24 md:py-32 bg-cream overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-olive-400/80 text-sm tracking-[0.3em] uppercase mb-8">La fecha</p>
            <h2 className="font-serif text-3xl md:text-5xl text-slate-700 font-light tracking-[0.08em] mb-12">
              {new Intl.DateTimeFormat('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(2026, 6, 18))}
            </h2>
            <div className="flex justify-center">
              <CalendarSection />
            </div>
          </div>
        </section>
        <Countdown />
        <FrameAnimation />
        <Gallery />
        <EventInfo />
        <GiftRegistry />
      </main>
      <footer className="py-6 bg-olive-700 border-t border-olive-600/30 text-center">
        <div className="max-w-md mx-auto px-4">
          <p className="text-cream/50 text-[10px] tracking-[0.15em] uppercase">
            &copy; {new Date().getFullYear()} Luz &amp; Manuel
          </p>
        </div>
      </footer>
      {letterOpened && <Particles />}
      {letterOpened && <MusicPlayer />}
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
