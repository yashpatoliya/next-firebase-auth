"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/context/auth-context';
import AppHeader from './app-header';
import { Toaster } from "@/components/ui/toaster";

interface MainLayoutProps {
  children: ReactNode;
}

const PUBLIC_ROUTES = ['/', '/auth', '/folder-structure']; // Routes accessible by anyone
const AUTH_ROUTE = '/auth'; // The dedicated authentication page
const DEFAULT_AUTHENTICATED_ROUTE = '/dashboard'; // Redirect here after login if accessing /auth
const DEFAULT_UNAUTHENTICATED_ROUTE = '/auth'; // Redirect here if unauthenticated and accessing protected route

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; 
    }

    const isAuthRoute = pathname === AUTH_ROUTE;
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (user && isAuthRoute) {
      // User is authenticated and trying to access the auth page
      router.replace(DEFAULT_AUTHENTICATED_ROUTE);
    } else if (!user && !isPublicRoute) {
      // User is not authenticated and trying to access a protected page
      router.replace(DEFAULT_UNAUTHENTICATED_ROUTE);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }
  
  // Prevent rendering children if redirection is determined
  const isAuthRoute = pathname === AUTH_ROUTE;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  if ((user && isAuthRoute) || (!user && !isPublicRoute)) {
     return (
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
     );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Firebase Flow. All rights reserved.
      </footer>
      <Toaster />
    </div>
  );
}
