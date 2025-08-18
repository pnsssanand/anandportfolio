import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // For portfolio site, always default to dark mode
    // Check if we're in admin context by looking at current path or admin flag
    const isAdminContext = window.location.pathname.includes('/admin') || 
                          window.location.hash.includes('admin') ||
                          document.querySelector('[data-admin-context]');
    
    // Only allow theme switching in admin context
    if (isAdminContext) {
      const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
      if (savedTheme) {
        return savedTheme;
      }
      
      // Check system preference for admin
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      
      return 'dark';
    }
    
    // Portfolio site always uses dark mode
    return 'dark';
  });

  const setTheme = (newTheme: Theme) => {
    // Only allow theme changes in admin context
    const isAdminContext = window.location.pathname.includes('/admin') || 
                          window.location.hash.includes('admin') ||
                          document.querySelector('[data-admin-context]');
    
    if (isAdminContext) {
      setThemeState(newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    }
    // Portfolio site remains locked to dark mode
  };

  const toggleTheme = () => {
    // Only allow theme toggle in admin context
    const isAdminContext = window.location.pathname.includes('/admin') || 
                          window.location.hash.includes('admin') ||
                          document.querySelector('[data-admin-context]');
    
    if (isAdminContext) {
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
    // Portfolio site theme toggle is disabled
  };

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('portfolio-theme')) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
