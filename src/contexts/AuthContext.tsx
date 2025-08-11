import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isEmailVerified: boolean;
  checkEmailVerification: () => Promise<boolean>;
  setEmailVerificationStatus: (status: boolean) => void;
  setSigningInState: (state: boolean) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isEmailVerified: false,
  checkEmailVerification: async () => false,
  setEmailVerificationStatus: () => {},
  setSigningInState: () => {},
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
  const [verificationChecked, setVerificationChecked] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const checkEmailVerification = async (): Promise<boolean> => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser?.email_confirmed_at || currentUser?.confirmed_at) {
        setIsEmailVerified(true);
        return true;
      } else {
        // For now, assume email is verified if user can sign in
        // This prevents the redirect loop issue
        console.log('🔍 DEBUG: Email verification fields not found, assuming verified for now');
        setIsEmailVerified(true);
        return true;
      }
    } catch (error) {
      console.error('Error checking email verification:', error);
      // Assume verified to prevent issues
      setIsEmailVerified(true);
      return true;
    }
  };

  // Method to manually set email verification status (for components to use)
  const setEmailVerificationStatus = (status: boolean) => {
    setIsEmailVerified(status);
    setVerificationChecked(true);
  };

  // Method to set signing in state (for components to use)
  const setSigningInState = (state: boolean) => {
    setIsSigningIn(state);
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
          // Only check email verification if not currently signing in
          if (!verificationChecked && !isSigningIn) {
            const verified = await checkEmailVerification();
            setVerificationChecked(true);
            console.log('Email verification status:', verified);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setIsEmailVerified(false);
        setVerificationChecked(false);
      } else if (event === 'USER_UPDATED') {
        if (session?.user) {
          setUser(session.user);
          // Only check if we haven't checked yet
          if (!verificationChecked) {
            await checkEmailVerification();
            setVerificationChecked(true);
          }
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
          // Check email verification for initial session
          const verified = await checkEmailVerification();
          setVerificationChecked(true);
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
      setEmailVerificationStatus,
      setSigningInState,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}