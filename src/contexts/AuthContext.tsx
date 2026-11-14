import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface AuthUser {
  $id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  session: { $id: string } | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const USER_STORAGE_KEY = 'portfolio_admin_user';
export const TOKEN_STORAGE_KEY = 'portfolio_admin_token';

export function getAdminAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [session, setSession] = useState<{ $id: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        // Validate token against /api/auth
        const res = await fetch('/api/auth', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            setToken(storedToken);
            setSession({ $id: data.user.$id });
            setIsAdmin(true);
          } else {
            // Invalid session
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
          }
        } else if (storedUser) {
          // If offline or initial fallback with stored user
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setToken(storedToken);
          setSession({ $id: parsed.$id });
          setIsAdmin(true);
        }
      } catch (e) {
        console.warn('Auth session verification error:', e);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password.');
      }

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      const adminUser: AuthUser = data.user || {
        $id: 'admin-suhas',
        name: 'Suhas Nidgundi',
        email: email.trim(),
      };

      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(adminUser));

      setToken(data.token);
      setUser(adminUser);
      setSession({ $id: adminUser.$id });
      setIsAdmin(true);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error: Error | null }> => {
    return signIn(email, password);
  };

  const signOut = async () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    setToken(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, session, isAdmin, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
