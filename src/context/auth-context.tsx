"use client";

import type { User, AuthError } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signUpWithEmail, signInWithEmail, signOut, sendPasswordResetEmail as firebaseSendPasswordResetEmail } from '@/lib/firebase/auth';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  signUp: (email: string, password: string) => Promise<User | null>;
  signIn: (email: string, password: string) => Promise<User | null>;
  logOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthError = (err: AuthError, defaultMessage: string) => {
    setError(err);
    console.error(err.message);
    toast({
      variant: "destructive",
      title: "Authentication Error",
      description: err.message || defaultMessage,
    });
  }

  const signUp = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await signUpWithEmail(email, password);
      setUser(newUser);
      toast({ title: "Success", description: "Signed up successfully!" });
      return newUser;
    } catch (err) {
      handleAuthError(err as AuthError, "Failed to sign up.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const existingUser = await signInWithEmail(email, password);
      setUser(existingUser);
      toast({ title: "Success", description: "Signed in successfully!" });
      return existingUser;
    } catch (err) {
      handleAuthError(err as AuthError, "Failed to sign in. Check your credentials.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut();
      setUser(null);
      toast({ title: "Success", description: "Signed out successfully!" });
    } catch (err) {
      handleAuthError(err as AuthError, "Failed to sign out.");
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSendPasswordResetEmail(email);
      toast({ title: "Password Reset", description: "Password reset email sent. Check your inbox." });
    } catch (err) {
      handleAuthError(err as AuthError, "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, error, signUp, signIn, logOut, sendPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
