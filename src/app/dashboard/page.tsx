"use client";

import { useAuthContext } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { BarChart, FolderKanban, Settings, UserCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, logOut } = useAuthContext();
  const router = useRouter();

  if (!user) {
    // This should ideally be handled by MainLayout, but as a fallback:
    // router.replace('/auth'); // This might cause infinite loop if MainLayout isn't effective first
    return null; // Render nothing while redirecting
  }

  const handleLogout = async () => {
    await logOut();
    router.push('/auth');
  };

  return (
    <div className="container mx-auto py-10 animate-in fade-in duration-500">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader className="text-center">
        <UserCircle2 className="mx-auto h-20 w-20 text-primary mb-4" />
          <CardTitle className="text-4xl font-headline">Welcome to Your Dashboard</CardTitle>
          <CardDescription className="text-lg">
            Hello, {user.email || 'User'}! This is your secure area.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Here you can manage your account, view your projects, or access other protected features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <Button variant="outline" className="py-8 text-base flex flex-col h-auto">
              <FolderKanban className="h-8 w-8 mb-2 text-primary" />
              My Projects
            </Button>
            <Button variant="outline" className="py-8 text-base flex flex-col h-auto">
              <BarChart className="h-8 w-8 mb-2 text-primary" />
              Analytics
            </Button>
            <Button variant="outline" className="py-8 text-base flex flex-col h-auto">
              <Settings className="h-8 w-8 mb-2 text-primary" />
              Settings
            </Button>
          </div>
          
          <div className="text-center mt-8">
            <Button onClick={handleLogout} variant="destructive" size="lg">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
