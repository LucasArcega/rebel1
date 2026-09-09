import { useEffect, useRef, useState } from 'react';

export const useAutoScroll = () => {
  const contentRef = useRef<HTMLPreElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(40);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = window.setInterval(() => {
      const element = contentRef.current;
      if (!element) return;

      element.scrollTop += 1;

      if (element.scrollTop + element.clientHeight >= element.scrollHeight - 2) {
        setIsPlaying(false);
      }
    }, speed);

    return () => window.clearInterval(interval);
  }, [isPlaying, speed]);

  const pause = () => setIsPlaying(false);
  const play = () => setIsPlaying(true);
  const toggle = () => setIsPlaying((value) => !value);

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
