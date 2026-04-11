import { createContext, useContext, useState, useEffect } from "react";
import { validateLogin, DUMMY_ADMIN_EMAIL, type AuthUser, type UserRole } from "../data/dummyAuth";

export type { AuthUser, UserRole };

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "energymart-auth";

function coerceStoredUser(u: Record<string, unknown>): AuthUser {
  const email = String(u.email || "");
  const id = typeof u.id === "number" ? u.id : Number(u.id) || 0;
  let role = u.role as UserRole | undefined;
  if (role !== "admin" && role !== "user") {
    role = email.trim().toLowerCase() === DUMMY_ADMIN_EMAIL.toLowerCase() ? "admin" : "user";
  }
  const name =
    typeof u.name === "string" ? u.name : role === "admin" ? "Administrator" : "Customer";
  const phone = typeof u.phone === "string" ? u.phone : undefined;
  const city = typeof u.city === "string" ? u.city : undefined;
  return { id, email, role, name, phone, city };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.user?.email) {
          setUser(coerceStoredUser(parsed.user as Record<string, unknown>));
        }
      } catch {
        /* ignore */
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser | null> => {
    const result = validateLogin(email, password);
    if (!result.ok || !result.user) return null;
    setUser(result.user);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user: result.user }));
    return result.user;
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
        isAdmin: user?.role === "admin",
        isLoading,
        login,
        logout,
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
