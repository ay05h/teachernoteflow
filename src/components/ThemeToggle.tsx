
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (prefersDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };
  
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative h-10 w-10 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-300 ease-in-out"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {theme === 'light' ? (
          <Moon className="h-5 w-5 transition-all duration-300 ease-in-out" />
        ) : (
          <Sun className="h-5 w-5 transition-all duration-300 ease-in-out" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
