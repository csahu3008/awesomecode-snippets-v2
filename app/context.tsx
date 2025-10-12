'use client';
import { createContext, useContext, useEffect, useState } from "react";
// const [currentPage, setcurrentPage] = useState<Page>('overview');
//     const [selectedSnippetId, setSelectedSnippetId] = useState<string>('');
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [user, setUser] = useState<User | null>(null);
interface GlobalContextType {
  currentPage: Page;
  selectedSnippetId: string;
  isDarkMode: boolean;
  user: User | null;
  handleNavigate: (page: Page, snippetId?: string) => void;
  toggleDarkMode: () => void;
  handleLogin: (userData: User) => void;
  handleLogout: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
type Page =
  | "overview"
  | "snippets"
  | "contributors"
  | "languages"
  | "snippet-detail"
  | "add-snippet"
  | "edit-snippet";

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
  const [currentPage, setcurrentPage] = useState<Page>("overview");
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("awesomecodesnippets_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("awesomecodesnippets_user");
      }
    }
  }, []);

  // Save user to localStorage when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("awesomecodesnippets_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("awesomecodesnippets_user");
    }
  }, [user]);

  const handleNavigate = (page: Page, snippetId?: string) => {
    setcurrentPage(page);
    if (snippetId) {
      setSelectedSnippetId(snippetId);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };
  return (
    <GlobalContext.Provider
      value={{
        currentPage,
        selectedSnippetId,
        isDarkMode,
        user,
        handleNavigate,
        toggleDarkMode,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalContextProvider");
  }
  return context;
};
export { GlobalContextProvider, useGlobalContext };