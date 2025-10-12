'use client';
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { useGlobalContext } from "../context";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose}: AuthModalProps) {
  const { handleLogin }=useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleAuthLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock successful login
      const mockUser: User = {
        id: '1',
        name: loginForm.email.split('@')[0],
        email: loginForm.email
      };
      
      handleLogin(mockUser);
      toast.success('Successfully logged in!');
      setIsLoading(false);
      
      // Reset form
      setLoginForm({ email: '', password: '' });
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock successful signup
      const mockUser: User = {
        id: '1',
        name: signupForm.name,
        email: signupForm.email
      };
      
      handleLogin(mockUser);
      toast.success('Account created successfully!');
      setIsLoading(false);
      
      // Reset form
      setSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
    }, 1000);
  };

  const handleOAuthLogin = (provider: string) => {
    toast.info(`${provider} login will be available soon!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            Welcome to AwesomeCodeSnippets
          </DialogTitle>
          <DialogDescription>
            Join our community to share and discover amazing code snippets
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={handleAuthLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="text-center">
              <button className="text-sm text-muted-foreground hover:text-primary">
                Forgot your password?
              </button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  placeholder="Confirm your password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground px-2">OR</span>
            <Separator className="flex-1" />
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleOAuthLogin('Google')}
            >
              <span className="mr-2">🔍</span>
              Continue with Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleOAuthLogin('GitHub')}
            >
              <span className="mr-2">🐙</span>
              Continue with GitHub
            </Button>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
}



