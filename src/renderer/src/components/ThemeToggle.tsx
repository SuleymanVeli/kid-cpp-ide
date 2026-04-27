import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import useSound from 'use-sound';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [play] = useSound('/sounds/switch.mp3'); // Səs effekti üçün

  useEffect(() => {
    // Sistem seçimini yoxla
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    play();
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-yellow-400 transition-all hover:scale-110 active:scale-95 shadow-md"
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}