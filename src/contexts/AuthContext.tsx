import { createContext } from 'react';
import {type Session, type User, AuthError } from '@supabase/supabase-js';
import type {UserEssentials} from "../types/userProfile.ts";

type AuthContextType = {
    user: User | null;
    session: Session | null;
    initialized: boolean;
    essentials: UserEssentials | null;
    signOut: () => Promise<{ error: AuthError | null }>;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    initialized: false,
    essentials: null,
    signOut: () => Promise.resolve({ error: null }),
});