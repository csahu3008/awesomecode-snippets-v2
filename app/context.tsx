'use client';
import { createContext, useContext, useEffect, useState } from 'react';
interface GlobalContextType {
  currentPage: Page;
  selectedSnippetId: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
type Page =
  | 'overview'
  | 'snippets'
  | 'contributors'
  | 'languages'
  | 'snippet-detail'
  | 'add-snippet'
  | 'edit-snippet';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
interface GlobalContextProviderProps {
  children: React.ReactNode;
}

const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const [currentPage, setcurrentPage] = useState<Page>('overview');
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      } catch (e) {
        // localStorage or document may be unavailable in some environments; ignore safely
      }
      return next;
    });
  };
  useEffect(() => {
    // initialize theme from localStorage (safe access)
    try {
      const _theme = localStorage.getItem('theme');
      if (_theme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else if (_theme === 'light') {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
      // if no preference set, do nothing and let CSS/OS preference take over
    } catch (e) {
      // ignore - localStorage not available
    }
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        currentPage,
        selectedSnippetId,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalContextProvider');
  }
  return context;
};
export { GlobalContextProvider, useGlobalContext };
