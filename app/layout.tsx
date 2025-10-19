import { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ProviderWrapper from './client';
import { Header } from './components/Header';
import { ThemeWrapper } from './components/ThemeWrapper';
import { Toaster } from './components/ui/sonner';
import { GlobalContextProvider } from './context';
import './globals.css';
import { AuthModal } from './components/AuthModal';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AwesomeCodeSnippets',
  description: 'AwesomeCodeSnippets',
};

export default function RootLayout({
  children,
  session,
  ...pageProps
}: Readonly<{
  children: React.ReactNode;
  session: Session | null;
}>) {
  return (
    <html lang="en" className="dark">
      <ProviderWrapper session={session}>
        <GlobalContextProvider>
          <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
            <ThemeWrapper>
              <Header />
              <main className="w-full">{children}</main>
              <Toaster />
              <AuthModal />
            </ThemeWrapper>
          </body>
        </GlobalContextProvider>
      </ProviderWrapper>
    </html>
  );
}
