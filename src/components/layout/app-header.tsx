"use client";

import Link from 'next/link';
import { useAuthContext } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Fingerprint, FolderGit2, HomeIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function AppHeader() {
  const { user, logOut, loading } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await logOut();
    router.push('/auth');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6 text-primary"><rect width="256" height="256" fill="none"></rect><path d="M56,72V200a8,8,0,0,0,8,8H192a8,8,0,0,0,8-8V152" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><path d="M194.2,40.6A64.1,64.1,0,0,0,120,40a64,64,0,0,0-5.7,39.6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><path d="M152,80a24,24,0,1,1,21.9-36.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
          <span className="font-bold font-headline">Firebase Flow</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
            <HomeIcon className="h-4 w-4 inline-block mr-1 mb-0.5" /> Home
          </Link>
          {user && (
            <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
              <LayoutDashboard className="h-4 w-4 inline-block mr-1 mb-0.5" /> Dashboard
            </Link>
          )}
          <Link href="/folder-structure" className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/folder-structure' ? 'text-primary' : 'text-muted-foreground'}`}>
             <FolderGit2 className="h-4 w-4 inline-block mr-1 mb-0.5" /> Folder AI
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          {!loading && (
            user ? (
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            ) : (
              pathname !== '/auth' && (
                <Button asChild size="sm" variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/auth">
                    <Fingerprint className="mr-2 h-4 w-4" /> Login / Sign Up
                  </Link>
                </Button>
              )
            )
          )}
        </div>
      </div>
    </header>
  );
}
