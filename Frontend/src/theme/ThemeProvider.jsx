import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes } from './themes';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  // Read preference from localStorage, default to dark theme first
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('researchpilot-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'dark'; // Always default to dark theme
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Manage class mappings on HTML root element
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }

    localStorage.setItem('researchpilot-theme', theme);
  }, [theme]);

  // Expose colors and toggle utilities for future expansion
  const value = {
    theme,
    colors: themes[theme],
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
