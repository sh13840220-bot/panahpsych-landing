import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const percent = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
        setProgress(percent);
      } else {
        setProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Reset scroll progress when path changes
  useEffect(() => {
    setProgress(0);
  }, [location.pathname]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 200,
        backgroundColor: 'transparent',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: '#7FA39C',
          boxShadow: progress > 0 ? '0 0 8px rgba(127, 163, 156, 0.6)' : 'none',
          transition: 'width 100ms ease-out',
        }}
      />
    </div>
  );
}
