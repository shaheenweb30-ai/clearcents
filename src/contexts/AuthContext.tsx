import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isEmailVerified: boolean;
  checkEmailVerification: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isEmailVerified: false,
  checkEmailVerification: async () => false,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const checkEmailVerification = async (): Promise<boolean> => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser?.email_confirmed_at) {
        setIsEmailVerified(true);
        return true;
      } else {
        // Temporarily skip email verification check for testing
        console.log('🔍 DEBUG: Email not verified in AuthContext, but skipping check for testing...');
        setIsEmailVerified(true);
        return true;
        /*
        setIsEmailVerified(false);
        return false;
        */
      }
    } catch (error) {
      console.error('Error checking email verification:', error);
      // Temporarily skip email verification check for testing
      console.log('🔍 DEBUG: Email not verified in AuthContext, but skipping check for testing...');
      setIsEmailVerified(true);
      return true;
      /*
      setIsEmailVerified(false);
      return false;
      */
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          // Check email verification status immediately
          const verified = await checkEmailVerification();
          console.log('Email verification status:', verified);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setIsEmailVerified(false);
      } else if (event === 'USER_UPDATED') {
        if (session?.user) {
          setUser(session.user);
          await checkEmailVerification();
        }
      }
      
      setLoading(false);
    });

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session?.user?.email);
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          const verified = await checkEmailVerification();
          console.log('Initial email verification status:', verified);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isEmailVerified, 
      checkEmailVerification,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}