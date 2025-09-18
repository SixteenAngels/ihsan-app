import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

type SessionState = {
  userId: string | null;
  email: string | null;
  loading: boolean;
};

const AuthContext = createContext<SessionState>({ userId: null, email: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>({ userId: null, email: null, loading: true });

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setState({
        userId: data.session?.user?.id || null,
        email: data.session?.user?.email || null,
        loading: false,
      });
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ userId: session?.user?.id || null, email: session?.user?.email || null, loading: false });
    });
    return () => { mounted = false; sub.subscription?.unsubscribe(); };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

