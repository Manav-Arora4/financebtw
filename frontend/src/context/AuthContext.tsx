import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User, Provider } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, reconfigureSupabase } from '../lib/supabase';
import apiClient from '../api/client';

interface AuthConfigResponse {
  auth_provider: string;
  supabase_url: string;
  supabase_publishable_key: string;
  supabase_anon_key: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: Provider) => Promise<{ error: Error | null }>;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [configured, setConfigured] = useState<boolean>(isSupabaseConfigured());

  const syncWithBackend = async () => {
    try {
      if (session?.access_token) {
        await apiClient.post('/api/v1/auth/sync', {});
      }
    } catch {
      // Background sync notice
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupAuth = async () => {
      let client = supabase;

      // If not configured from Vite frontend env, fetch from FastAPI backend config
      if (!isSupabaseConfigured()) {
        try {
          const res = await apiClient.get<AuthConfigResponse>('/api/v1/auth/config');
          const url = res.data.supabase_url;
          const key = res.data.supabase_publishable_key || res.data.supabase_anon_key;

          if (url && key && url !== 'https://placeholder.supabase.co') {
            client = reconfigureSupabase(url, key);
            setConfigured(true);
          }
        } catch {
          // Backend offline or config unavailable
        }
      } else {
        setConfigured(true);
      }

      try {
        // Check initial session
        const { data } = await client.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch {
        // Session check failed
      } finally {
        setLoading(false);
      }

      // Listen for auth changes
      const { data: authListener } = client.auth.onAuthStateChange(async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
        if (newSession?.access_token) {
          localStorage.setItem('access_token', newSession.access_token);
          await syncWithBackend();
        } else {
          localStorage.removeItem('access_token');
        }
      });

      unsubscribe = () => {
        authListener.subscription.unsubscribe();
      };
    };

    setupAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName || email.split('@')[0] },
        },
      });
      return { error: error ? new Error(error.message) : null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error('Signup failed') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? new Error(error.message) : null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error('Sign in failed') };
    }
  };

  const signInWithOAuth = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      return { error: error ? new Error(error.message) : null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error('OAuth failed') };
    }
  };

  const signInWithOtp = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      return { error: error ? new Error(error.message) : null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error('Magic link failed') };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('access_token');
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: configured,
        signUp,
        signIn,
        signInWithOAuth,
        signInWithOtp,
        signOut,
        syncWithBackend,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
