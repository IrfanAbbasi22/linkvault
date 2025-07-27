'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <Sun className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-300 ${
          isDark ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
        }`} />
        <Moon className={`absolute inset-0 w-6 h-6 text-blue-500 transition-all duration-300 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
        }`} />
      </div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
        isDark 
          ? 'bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
          : 'bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
      }`} />
    </button>
  );
} 