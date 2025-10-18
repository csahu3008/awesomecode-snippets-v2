"use client";
import { createContext, useContext, useEffect, useState } from "react";
interface GlobalContextType {
  currentPage: Page;
  selectedSnippetId: string;
  isDarkMode: boolean;
  handleNavigate: (page: Page, snippetId?: string) => void;
  toggleDarkMode: () => void;
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

  const handleNavigate = (page: Page, snippetId?: string) => {
    setcurrentPage(page);
    if (snippetId) {
      setSelectedSnippetId(snippetId);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };
  useEffect(() => {
    setIsDarkMode(localStorage.getItem("theme") === "dark");
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        currentPage,
        selectedSnippetId,
        isDarkMode,
        handleNavigate,
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
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
export { GlobalContextProvider, useGlobalContext };
