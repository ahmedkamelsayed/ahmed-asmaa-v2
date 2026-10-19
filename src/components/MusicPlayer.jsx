import { useEffect, useRef, useState } from 'react';
import { useLang } from '../lib/lang.js';

// Optional background music. With `autoStart` it tries to play as soon as the
// page opens; browsers often refuse sound before a user gesture, so it then
// starts on the guest's first tap/click/key anywhere on the page. The button
// always toggles it.
export default function MusicPlayer({ src, autoStart = false }) {
  const { t } = useLang();
  const m = t.music;
  const audioRef = useRef(null);
  const [status, setStatus] = useState('paused'); // paused | loading | playing | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const audio = audioRef.current;
    const onPlaying = () => setStatus('playing');
    const onPause = () => setStatus((s) => (s === 'error' ? s : 'paused'));
    const onError = () => {
      setStatus('error');
      setMessage(m.failed);
    };
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.pause();
    };
  }, [m.failed]);

  // Try right away; if the browser blocks it, the first gesture anywhere
  // starts it once (taps on the music button itself are left to its toggle).
  useEffect(() => {
    if (!autoStart) return undefined;
    audioRef.current.play().catch(() => {});
    const events = ['pointerup', 'touchend', 'keydown'];
    const stop = () => events.forEach((e) => window.removeEventListener(e, start, true));
    function start(e) {
      if (e.target instanceof Element && e.target.closest('.music')) {
        stop();
        return;
      }
      stop();
      const audio = audioRef.current;
      if (audio.paused) audio.play().catch(() => {});
    }
    events.forEach((e) => window.addEventListener(e, start, true));
    return stop;
  }, [autoStart]);

  useEffect(() => {
    if (!message) return undefined;
    const id = setTimeout(() => setMessage(''), 4000);
    return () => clearTimeout(id);
  }, [message]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (status === 'error') return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      await audio.play();
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setStatus('paused');
        setMessage(m.blocked);
      } else if (err.name !== 'AbortError') {
        setStatus('error');
        setMessage(m.failed);
      }
    }
  };

  const playing = status === 'playing';
  const label = status === 'error' ? m.failed : playing ? m.pauseLabel : m.playLabel;

  return (
    <div className="music">
      <audio ref={audioRef} src={src} loop preload={autoStart ? 'auto' : 'none'} />
      {message && <p className="music__msg" role="status">{message}</p>}
      <button
        type="button"
        className={`music__btn music__btn--${status}`}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={label}
        title={label}
        disabled={status === 'error'}
      >
        <span className="music__bars" aria-hidden="true"><i /><i /><i /></span>
        <svg className="music__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          {playing ? <path d="M8 6v12M16 6v12" /> : <path d="M9 6.5v11l9-5.5z" />}
        </svg>
        <span className="music__label">
          {status === 'error' ? m.off : playing ? m.pause : status === 'loading' ? '…' : m.play}
        </span>
      </button>
    </div>
  );
}
