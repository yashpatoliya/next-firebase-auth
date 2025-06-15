import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <main className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold font-headline mb-6 text-primary animate-in fade-in slide-in-from-top-4 duration-700">
          Welcome to Firebase Flow
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-6 duration-700 delay-150">
          Simplify your React & Firestore authentication boilerplate. Get started quickly with robust security and developer-friendly hooks.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12 animate-in fade-in-0 slide-in-from-bottom-10 duration-500 delay-300">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-2xl font-headline">
                <Zap className="mr-2 h-7 w-7 text-accent" />
                Fast Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Integrate Firebase authentication into your React app in minutes, not hours.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-2xl font-headline">
                <ShieldCheck className="mr-2 h-7 w-7 text-accent" />
                Secure by Default
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Leverage Firebase's robust security with pre-configured route guards and auth hooks.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-2xl font-headline">
                <CheckCircle className="mr-2 h-7 w-7 text-accent" />
                Developer Friendly
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Simplified custom React hooks for all your Firebase auth needs. TypeScript ready.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="animate-in fade-in-0 slide-in-from-bottom-10 duration-500 delay-450">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-shadow transform hover:scale-105">
            <Link href="/auth">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="ml-4 shadow-md hover:shadow-lg transition-shadow transform hover:scale-105">
            <Link href="/folder-structure">Suggest Folder Structure</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
