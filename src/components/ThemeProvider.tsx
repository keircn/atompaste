'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '~/lib/auth-context';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'dark' | 'light';
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  effectiveTheme: 'dark',
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'atompaste-theme',
  ...props
}: ThemeProviderProps) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (user?.theme) {
      setThemeState(user.theme as Theme);
    } else {
      const stored = localStorage.getItem(storageKey) as Theme;
      if (stored) {
        setThemeState(stored);
      } else {
        setThemeState('system');
      }
    }
  }, [user, storageKey]);

  useEffect(() => {
    const calculateEffectiveTheme = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme;
    };

    const updateEffectiveTheme = () => {
      const effective = calculateEffectiveTheme();
      setEffectiveTheme(effective);
      
      const root = window.document.documentElement;
      const body = window.document.body;
      
      root.classList.remove('light', 'dark');
      body.classList.remove('light', 'dark');
      
      root.classList.add(effective);
      body.classList.add(effective);
    };

    updateEffectiveTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateEffectiveTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);

    if (user) {
      try {
        await fetch('/api/user/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ theme: newTheme }),
        });
      } catch (error) {
        console.error('Failed to update theme in database:', error);
      }
    } else {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  const value = {
    theme,
    setTheme,
    effectiveTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
