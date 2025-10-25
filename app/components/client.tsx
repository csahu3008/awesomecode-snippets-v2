'use client';
import { useSession } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

export const LoginCtaOverview = () => {
  const { status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const clonedSearchParams = new URLSearchParams(searchParams.toString());
  clonedSearchParams.set('show_login_modal', 'true');
  const loginPath = `${pathname}${clonedSearchParams ? `?${clonedSearchParams.toString()}` : ''}`;
  return (
    <Link href={status === 'authenticated' ? '/add-snippet' : `${loginPath}`}>
      <Button size="lg" className="font-medium">
        <span className="mr-2">{status === 'authenticated' ? '➕' : '📝'}</span>
        {status === 'authenticated' ? 'Add Snippet' : 'Login to Add Snippet'}
      </Button>
    </Link>
  );
};

export function LoginLink() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const clonedSearchParams = new URLSearchParams(searchParams.toString());
  clonedSearchParams.set('show_login_modal', 'true');
  const loginPath = `${pathname}?${clonedSearchParams.toString()}`;

  return (
    <Link href={loginPath}>
      <Button variant="default" size="sm" className="hidden xl:inline-flex">
        Login
      </Button>
    </Link>
  );
}

// For mobile menu
export function MobileLoginLink({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const clonedSearchParams = new URLSearchParams(searchParams.toString());
  clonedSearchParams.set('show_login_modal', 'true');
  const loginPath = `${pathname}?${clonedSearchParams.toString()}`;

  return (
    <Link href={loginPath}>
      <Button
        variant="default"
        size="sm"
        onClick={onClose}
        className="w-full justify-start"
      >
        <span className="mr-2">🔑</span>
        Login / Sign Up
      </Button>
    </Link>
  );
}