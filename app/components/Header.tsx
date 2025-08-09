import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet';
import { AuthModal } from './AuthModal';

type Page = 'overview' | 'snippets' | 'contributors' | 'languages' | 'snippet-detail' | 'add-snippet' | 'edit-snippet';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

export function Header({ currentPage, onNavigate, isDarkMode, onToggleDarkMode, user, onLogin, onLogout }: HeaderProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navItems = [
    { id: 'overview' as Page, label: 'Overview', emoji: '🏠' },
    { id: 'snippets' as Page, label: 'Snippets', emoji: '📄' },
    { id: 'contributors' as Page, label: 'Top Contributors', emoji: '🌟' },
    { id: 'languages' as Page, label: 'Top Languages', emoji: '🧠' },
  ];

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setIsSheetOpen(false);
  };

  const handleLoginSuccess = (userData: User) => {
    onLogin(userData);
    setIsAuthModalOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsSheetOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavClick('overview')}
          >
            <span className="text-2xl">📄</span>
            <span className="font-mono tracking-tight hidden sm:inline text-lg">AwesomeCodeSnippets</span>
            <span className="font-mono tracking-tight sm:hidden text-lg">ACS</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm transition-colors hover:text-primary px-3 py-2 rounded-md ${
                  currentPage === item.id
                    ? 'text-primary font-medium bg-primary/10'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <span className="mr-2">{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            {/* Add Snippet Button for logged-in users (Desktop only) */}
            {user && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleNavClick('add-snippet')}
                className="hidden md:inline-flex"
              >
                <span className="mr-2">➕</span>
                <span className="hidden lg:inline">Add Snippet</span>
                <span className="lg:hidden">Add</span>
              </Button>
            )}

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleDarkMode}
              className="h-9 w-9 px-0 text-lg"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </Button>

            {/* Desktop Auth Section */}
            {user ? (
              <div className="hidden xl:flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-24 truncate">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden xl:inline-flex"
              >
                Login
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="xl:hidden h-9 w-9 px-0 text-lg"
                  title="Open menu"
                >
                  ☰
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <SheetHeader className="p-6 pb-4 border-b">
                    <SheetTitle className="flex items-center gap-2 text-left">
                      <span className="text-2xl">📄</span>
                      <span className="font-mono">AwesomeCodeSnippets</span>
                    </SheetTitle>
                  </SheetHeader>

                  {/* User Section */}
                  <div className="p-6 pb-4 border-b">
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLogoutClick}
                          className="w-full justify-start"
                        >
                          <span className="mr-2">👋</span>
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Login to access all features
                        </p>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setIsAuthModalOpen(true);
                            setIsSheetOpen(false);
                          }}
                          className="w-full justify-start"
                        >
                          <span className="mr-2">🔑</span>
                          Login / Sign Up
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 p-6 pt-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground mb-3 px-3">
                        NAVIGATION
                      </p>
                      {navItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                            currentPage === item.id
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'text-foreground hover:bg-muted'
                          }`}
                        >
                          <span className="text-lg">{item.emoji}</span>
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Add Snippet for logged-in users */}
                    {user && (
                      <div className="mt-6 pt-6 border-t">
                        <p className="text-xs font-medium text-muted-foreground mb-3 px-3">
                          ACTIONS
                        </p>
                        <button
                          onClick={() => handleNavClick('add-snippet')}
                          className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors text-foreground hover:bg-muted"
                        >
                          <span className="text-lg">➕</span>
                          <span className="text-sm">Add New Snippet</span>
                        </button>
                      </div>
                    )}
                  </nav>

                  {/* Footer */}
                  <div className="p-6 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Theme</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleDarkMode}
                        className="h-8 px-2 text-lg"
                      >
                        {isDarkMode ? '☀️' : '🌙'}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLoginSuccess}
      />
    </>
  );
}



