"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from '@/context/auth-context';
import { Mail, LockKeyhole, UserCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function AuthForm() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);

  const { signIn, signUp, sendPasswordReset, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();

  const currentSchema = authMode === 'login' ? loginSchema : signUpSchema;
  type CurrentFormData = typeof authMode extends 'login' ? LoginFormData : SignUpFormData;
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CurrentFormData>({
    resolver: zodResolver(currentSchema),
  });

  const onSubmit: SubmitHandler<CurrentFormData> = async (data) => {
    let success = false;
    if (authMode === 'login') {
      const result = await signIn(data.email, (data as LoginFormData).password);
      if (result) success = true;
    } else {
      const result = await signUp(data.email, (data as SignUpFormData).password);
      if (result) success = true;
    }

    if (success) {
      reset();
      router.push('/dashboard');
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast({ variant: "destructive", title: "Error", description: "Please enter your email address." });
      return;
    }
    const emailValidation = z.string().email().safeParse(resetEmail);
    if (!emailValidation.success) {
      toast({ variant: "destructive", title: "Error", description: "Invalid email address." });
      return;
    }

    setIsSubmittingReset(true);
    await sendPasswordReset(resetEmail);
    setIsSubmittingReset(false);
    // Toast is handled by AuthContext for success/failure
  };
  

  return (
    <Card className="w-full max-w-md shadow-2xl animate-in fade-in duration-500">
      <Tabs defaultValue="login" onValueChange={(value) => setAuthMode(value as 'login' | 'signup')} value={authMode}>
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-4">
                 <UserCircle className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="text-3xl font-headline">
            {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {authMode === 'login' ? 'Sign in to continue to Firebase Flow.' : 'Join us and simplify your Firebase auth.'}
          </CardDescription>
          <TabsList className="grid w-full grid-cols-2 mt-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className="pl-10"
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive flex items-center"><AlertTriangle className="h-4 w-4 mr-1" />{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="pl-10"
                  aria-invalid={errors.password ? "true" : "false"}
                />
              </div>
              {errors.password && <p className="text-sm text-destructive flex items-center"><AlertTriangle className="h-4 w-4 mr-1" />{errors.password.message}</p>}
            </div>
            {authMode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    className="pl-10"
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                  />
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive flex items-center"><AlertTriangle className="h-4 w-4 mr-1" />{errors.confirmPassword.message}</p>}
              </div>
            )}
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-base py-6" disabled={authLoading}>
              {authLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (authMode === 'login' ? 'Login' : 'Sign Up')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
                  Forgot Password?
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Password</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter your email address below and we'll send you a link to reset your password.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-2 py-4">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input 
                    id="reset-email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)} 
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePasswordReset} disabled={isSubmittingReset || authLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    {isSubmittingReset || authLoading ? (
                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                    ) : "Send Reset Link"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </CardFooter>
      </Tabs>
    </Card>
  );
}
