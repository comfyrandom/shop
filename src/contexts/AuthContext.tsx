import { createContext } from 'react';
import {type Session, type User, AuthError } from '@supabase/supabase-js';

type AuthContextType = {
    user: User | null;
    session: Session | null;
    initialized: boolean;
    signOut: () => Promise<{ error: AuthError | null }>;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    initialized: false,
    signOut: () => Promise.resolve({ error: null }),
});