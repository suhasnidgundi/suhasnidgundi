import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Models, Query } from 'appwrite';
import { account, databases, DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/client';
import type { UserRole } from '@/integrations/appwrite/types';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  session: Models.Session | null;
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [session, setSession] = useState<Models.Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminRole = async (userId: string) => {
    try {
      const response = await databases.listDocuments<UserRole>(
        DATABASE_ID,
        COLLECTIONS.USER_ROLES,
        [Query.equal('user_id', userId), Query.equal('role', 'admin')]
      );
      setIsAdmin(response.documents.length > 0);
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        
        const currentSession = await account.getSession('current');
        setSession(currentSession);
        
        await checkAdminRole(currentUser.$id);
      } catch {
        // No active session
        setUser(null);
        setSession(null);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const newSession = await account.createEmailPasswordSession(email, password);
      setSession(newSession);
      
      const currentUser = await account.get();
      setUser(currentUser);
      
      await checkAdminRole(currentUser.$id);
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error: Error | null }> => {
    try {
      await account.create('unique()', email, password, fullName);
      // Auto sign in after signup
      const result = await signIn(email, password);
      return result;
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
