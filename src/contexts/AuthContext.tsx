import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface AuthUser {
  $id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
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

const STORAGE_KEY = 'portfolio_admin_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<{ $id: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setSession({ $id: parsed.$id });
        setIsAdmin(true);
      }
    } catch (e) {
      console.warn('Auth session parse error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password.');
      }

      const adminUser: AuthUser = {
        $id: 'admin-suhas',
        name: 'Suhas Nidgundi',
        email,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
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
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
