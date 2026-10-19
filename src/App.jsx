import { useEffect } from 'react';
import { config } from './config.js';
import { LangContext } from './lib/lang.js';
import Cover from './components/Cover.jsx';
import Story from './components/Story.jsx';
import Details from './components/Details.jsx';
import Countdown from './components/Countdown.jsx';
import Location from './components/Location.jsx';
import Closing from './components/Closing.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';

// Scroll-reveal. Content is visible by default; it is only hidden for the
// fade-in once this runs, so nothing depends on JS or animations.
function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    const root = document.documentElement;
    let frame = 0;
    // Reveal everything whose top has reached the lower part of the viewport,
    // including elements a fast scroll or jump skipped past.
    const check = () => {
      frame = 0;
      const limit = window.innerHeight * 0.92;
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
        if (el.getBoundingClientRect().top < limit) el.classList.add('is-visible');
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    root.classList.add('reveal-ready');
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // Elements that mount later (e.g. the countdown after hydration).
    const mo = new MutationObserver(schedule);
    mo.observe(document.getElementById('root'), { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      mo.disconnect();
      root.classList.remove('reveal-ready');
    };
  }, []);
}

export default function App({ lang }) {
  useReveal();
  return (
    <LangContext.Provider value={lang}>
      <Cover />
      <main>
        <Story />
        <Details />
        <Countdown />
        <Location />
      </main>
      <Closing />
      {config.music.src && <MusicPlayer src={config.music.src} startOnFirstTap={config.music.startOnFirstTap} />}
    </LangContext.Provider>
  );
}
