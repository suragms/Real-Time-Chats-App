"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { insforge, isInsForgeConfigured } from "@/services/insforge";
import { User } from "@/types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(isInsForgeConfigured);

  const refreshUser = useCallback(async () => {
    try {
      const { data, error } = await insforge.auth.getCurrentSession();
      if (error || !data?.session) {
        setUser(null);
      } else {
        setUser(data.session.user as User);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isInsForgeConfigured) {
      setLoading(false);
      return;
    }

    refreshUser();

    // Many SDKs allow subscribing to auth changes
    // If TokenManager exposes onTokenChange, we can listen there
    const tm = (insforge as any).tokenManager;
    if (tm) {
      const originalOnChange = tm.onTokenChange;
      tm.onTokenChange = () => {
        if (originalOnChange) originalOnChange();
        refreshUser();
      };
    }
  }, [refreshUser]);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      name?: string
    ): Promise<{ error: string | null }> => {
      if (!isInsForgeConfigured) {
        return { error: "InsForge is not configured. Set NEXT_PUBLIC_INSFORGE_BASE_URL and NEXT_PUBLIC_INSFORGE_ANON_KEY in .env.local" };
      }
      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        name: name ?? undefined,
      });
      if (error) {
        return { error: error.message ?? "Sign up failed" };
      }
      if (data?.requireEmailVerification) {
        return { error: "Please check your email to verify your account." };
      }
      if (data?.user) {
        setUser(data.user as User);
        return { error: null };
      }
      return { error: "Sign up failed" };
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      if (!isInsForgeConfigured) {
        return { error: "InsForge is not configured. Set NEXT_PUBLIC_INSFORGE_BASE_URL and NEXT_PUBLIC_INSFORGE_ANON_KEY in .env.local" };
      }
      const { data, error } = await insforge.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { error: error.message ?? "Invalid credentials" };
      }
      if (data?.user) {
        setUser(data.user as User);
        return { error: null };
      }
      return { error: "Sign in failed" };
    },
    []
  );

  const signOut = useCallback(async () => {
    if (isInsForgeConfigured) await insforge.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isInsForgeConfigured,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
