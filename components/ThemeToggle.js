'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Pour éviter le "hydration mismatch", on ne rend rien côté serveur
    return <div className="w-12 h-7" />;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-14 h-8 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
      aria-label="Toggle Dark Mode"
    >
      <div
        className={`w-6 h-6 bg-white dark:bg-black rounded-full shadow-md transform transition-transform ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </div>
    </button>
  );
}
