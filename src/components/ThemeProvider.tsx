'use client';

import { useEffect, createContext, useContext, ReactNode } from 'react';
import type { ThemeConfig } from '../lib/theme-schema';
import { applyThemeToDocument } from '../lib/theme-parser';

interface ThemeProviderProps {
  theme: ThemeConfig;
  children: ReactNode;
}

const ThemeContext = createContext<ThemeConfig | null>(null);

/**
 * ThemeProvider - Applies theme configuration to the document
 * Converts theme JSON to CSS variables at runtime
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useEffect(() => {
    // Apply theme to document root
    applyThemeToDocument(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme configuration
 */
export function useTheme(): ThemeConfig | null {
  return useContext(ThemeContext);
}

