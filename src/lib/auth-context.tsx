import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "travellog_user";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, _password: string) => {
    // Simple client-side "auth" - look up existing users or create session
    const existing = localStorage.getItem(`travellog_account_${email}`);
    if (existing) {
      const account = JSON.parse(existing);
      setUser({ id: account.id, name: account.name, email: account.email });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: account.id, name: account.name, email: account.email }));
    } else {
      throw new Error("Account not found. Please sign up first.");
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, _password: string) => {
    const id = generateId();
    const account = { id, name, email };
    localStorage.setItem(`travellog_account_${email}`, JSON.stringify(account));
    setUser(account);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateUser,
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
