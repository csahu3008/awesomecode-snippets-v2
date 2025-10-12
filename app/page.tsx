'use client';
import { useEffect, useState } from "react";
import { AddSnippetPage } from './components/AddSnippetPage';
import { ContributorsPage } from './components/ContributorsPage';
import { EditSnippetPage } from './components/EditSnippetPage';
import { Header } from './components/Header';
import { LanguagesPage } from './components/LanguagesPage';
import { OverviewPage } from './components/OverviewPage';
import { SnippetDetailPage } from './components/SnippetDetailPage';
import { SnippetsPage } from './components/SnippetsPage';
import { Toaster } from './components/ui/sonner';

// type Page = 'overview' | 'snippets' | 'contributors' | 'languages' | 'snippet-detail' | 'add-snippet' | 'edit-snippet';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatar?: string;
// }

export default function App() {
  // const [currentPage, setcurrentPage] = useState<Page>('overview');
  // const [selectedSnippetId, setSelectedSnippetId] = useState<string>('');
  // const [isDarkMode, setIsDarkMode] = useState(false);
  // const [user, setUser] = useState<User | null>(null);

  // // Load user from localStorage on app start
  // useEffect(() => {
  //   const savedUser = localStorage.getItem('awesomecodesnippets_user');
  //   if (savedUser) {
  //     try {
  //       setUser(JSON.parse(savedUser));
  //     } catch (error) {
  //       localStorage.removeItem('awesomecodesnippets_user');
  //     }
  //   }
  // }, []);

  // // Save user to localStorage when user state changes
  // useEffect(() => {
  //   if (user) {
  //     localStorage.setItem('awesomecodesnippets_user', JSON.stringify(user));
  //   } else {
  //     localStorage.removeItem('awesomecodesnippets_user');
  //   }
  // }, [user]);

  // const handleNavigate = (page: Page, snippetId?: string) => {
  //   setcurrentPage(page);
  //   if (snippetId) {
  //     setSelectedSnippetId(snippetId);
  //   }
  // };

  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode);
  //   document.documentElement.classList.toggle('dark');
  // };

  // const handleLogin = (userData: User) => {
  //   setUser(userData);
  // };

  // const handleLogout = () => {
  //   setUser(null);
  // };

  // const renderPage = () => {
  //   switch (currentPage) {
  //     case 'overview':
  //       return <OverviewPage handleNavigate={handleNavigate} user={user} />;
  //     case 'snippets':
  //       return <SnippetsPage handleNavigate={handleNavigate} />;
  //     case 'contributors':
  //       return <ContributorsPage handleNavigate={handleNavigate} />;
  //     case 'languages':
  //       return <LanguagesPage handleNavigate={handleNavigate} />;
  //     case 'snippet-detail':
  //       return <SnippetDetailPage snippetId={selectedSnippetId} handleNavigate={handleNavigate} user={user} />;
  //     case 'add-snippet':
  //       return <AddSnippetPage handleNavigate={handleNavigate} user={user} />;
  //     case 'edit-snippet':
  //       return <EditSnippetPage snippetId={selectedSnippetId} handleNavigate={handleNavigate} user={user} />;
  //     default:
  //       return <OverviewPage handleNavigate={handleNavigate} user={user} />;
  //   }
  // };

  return (
        <OverviewPage />
  );
}



