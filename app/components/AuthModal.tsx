'use client';
import { signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import handleAuthError from '../utils';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export function AuthModal() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isOpen = searchParams?.get('show_login_modal') === 'true' || false;
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });
  const [signupForm, setSignupForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  const handleAuthLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    const response = await signIn('login', {
      username: loginForm.username,
      password: loginForm.password,
      redirect: false,
    });

    if (response && (response as any).error) {
      const msg = handleAuthError((response as any).error);
      setLoginError(msg);
      setIsLoading(false);
      return;
    } else {
      toast.success('Successfully logged in!');
      setLoginForm({ username: '', password: '' });
      onClose();
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    setIsLoading(true);
    setSignupError(null);
    e.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupError('The passwords you entered don’t match.');
      return;
    }
    const response = await signIn('signup', {
      username: signupForm.username,
      password: signupForm.password,
      password2: signupForm.confirmPassword,
      email: signupForm.email,
      redirect: false,
    });

    if (response && (response as any).error) {
      const msg = handleAuthError((response as any).error);
      setSignupError(msg);
      return;
    }

    toast.success('Account created successfully!');
    setSignupForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setIsLoading(false);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleOAuthLogin = (provider: string) => {
    toast.info(`${provider} login will be available soon!`);
  };
  const onClose = (showModal = false) => {
    const _searchParams = new URLSearchParams(searchParams.toString());
    if (showModal) {
      // show login popup
      _searchParams.set('show_login_modal', 'true');
    } else {
      // donot show login popup
      _searchParams.delete('show_login_modal');
    }
    router.replace(`${pathname}${_searchParams ? `?${_searchParams.toString()}` : ''}`);
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
                <Label htmlFor="login-username">username</Label>
                <Input
                  id="login-username"
                  type="text"
                  placeholder="Enter your username"
                  value={loginForm.username}
                  onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
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
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            {loginError && (
              <p className="text-sm text-destructive mt-2 whitespace-pre-wrap">{loginError}</p>
            )}

            <div className="text-center">
              <button className="text-sm text-muted-foreground hover:text-primary">
                Forgot your password?
              </button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="Enter Username"
                  value={signupForm.username}
                  onChange={e => setSignupForm({ ...signupForm, username: e.target.value })}
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
                  onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
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
                  onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
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
                  onChange={e =>
                    setSignupForm({
                      ...signupForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            {signupError && (
              <p className="text-sm text-destructive mt-2 whitespace-pre-wrap">{signupError}</p>
            )}
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
            <Button variant="outline" className="w-full" onClick={() => handleOAuthLogin('Google')}>
              <span className="mr-2">🔍</span>
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleOAuthLogin('GitHub')}>
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
