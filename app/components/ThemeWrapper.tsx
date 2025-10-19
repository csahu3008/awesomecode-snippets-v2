'use client';

import { useGlobalContext } from '../context';

export const ThemeWrapper = ({ children }) => {
  const { isDarkMode } = useGlobalContext();
  return (
    <div className={`min-h-screen bg-background text-foreground ${isDarkMode ? 'dark' : ''}`}>
      {children}
    </div>
  );
};
