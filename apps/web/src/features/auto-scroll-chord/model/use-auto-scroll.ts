import { useEffect, useRef, useState } from 'react';

export const useAutoScroll = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(40);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = window.setInterval(() => {
      window.scrollBy(0, 1);

      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

      if (atBottom) {
        setIsPlaying(false);
      }
    }, speed);

    return () => window.clearInterval(interval);
  }, [isPlaying, speed]);

  const pause = () => setIsPlaying(false);
  const play = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsPlaying(true);
  };

  const toggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    play();
  };

  return {
    contentRef,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    toggle,
  };
};
