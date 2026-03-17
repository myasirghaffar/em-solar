import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'energymart-auth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.user?.email) setUser(parsed.user);
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const trySupabase = async (): Promise<boolean> => {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!url || !key) return false;
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(url, key);
      const { data } = await supabase.rpc('auth_login', { user_email: email, user_password: password });
      if (data && data.length > 0) {
        const user = { id: data[0].id, email: data[0].email };
        setUser(user);
        localStorage.setItem(AUTH_KEY, JSON.stringify({ user }));
        return true;
      }
      return false;
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem(AUTH_KEY, JSON.stringify({ user: data.user }));
          return true;
        }
      }
    } catch {}
    return trySupabase();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
