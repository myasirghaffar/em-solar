import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  AuthApiError,
  authFetchMe,
  authLogin,
  authLogout,
  authRefresh,
  authRegister,
} from "../lib/authApi";
import type { AuthUser } from "../types/auth";

export type { AuthUser, UserRole } from "../types/auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  signup: (input: { name: string; email: string; password: string }) => Promise<{
    email: string;
    devVerificationUrl?: string;
  } | null>;
  /** After email verification API returns tokens, sync React state + localStorage. */
  importSession: (data: { user: AuthUser; accessToken: string; refreshToken: string }) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "energymart-auth";

type StoredAuth = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

function readStored(): StoredAuth | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredAuth>;
    if (
      parsed?.user?.email &&
      typeof parsed.accessToken === "string" &&
      typeof parsed.refreshToken === "string"
    ) {
      return parsed as StoredAuth;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function writeStored(data: StoredAuth | null): void {
  if (!data) {
    localStorage.removeItem(AUTH_KEY);
    return;
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((s: StoredAuth) => {
    setUser(s.user);
    setAccessToken(s.accessToken);
    writeStored(s);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    writeStored(null);
  }, []);

  const refreshSession = useCallback(async () => {
    const stored = readStored();
    if (!stored?.refreshToken) {
      clearSession();
      return;
    }
    try {
      const next = await authRefresh(stored.refreshToken);
      applySession({
        user: next.user,
        accessToken: next.accessToken,
        refreshToken: next.refreshToken,
      });
    } catch {
      clearSession();
    }
  }, [applySession, clearSession]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = readStored();
      if (!stored?.refreshToken || !stored.accessToken) {
        if (!cancelled) setIsLoading(false);
        return;
      }
      try {
        const me = await authFetchMe(stored.accessToken);
        if (!cancelled) {
          setUser(me);
          setAccessToken(stored.accessToken);
        }
      } catch {
        try {
          const next = await authRefresh(stored.refreshToken);
          if (!cancelled) {
            applySession({
              user: next.user,
              accessToken: next.accessToken,
              refreshToken: next.refreshToken,
            });
          }
        } catch {
          if (!cancelled) clearSession();
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applySession, clearSession]);

  const login = async (email: string, password: string): Promise<AuthUser | null> => {
    const result = await authLogin(email, password);
    applySession({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    return result.user;
  };

  const signup = async (input: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ email: string; devVerificationUrl?: string } | null> => {
    return authRegister(input);
  };

  const importSession = useCallback(
    (data: { user: AuthUser; accessToken: string; refreshToken: string }) => {
      applySession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    },
    [applySession],
  );

  const logout = async (): Promise<void> => {
    const token = accessToken ?? readStored()?.accessToken;
    if (token) {
      try {
        await authLogout(token);
      } catch {
        /* still clear locally */
      }
    }
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isLoading,
        accessToken,
        login,
        signup,
        importSession,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export function isAuthApiError(e: unknown): e is AuthApiError {
  return e instanceof AuthApiError;
}
