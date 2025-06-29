import React, { useEffect, useState} from "react";
import type {Session, User} from "@supabase/supabase-js";
import {supabase} from "../services/supabase.client.ts";
import {AuthContext} from "./AuthContext.tsx";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setInitialized(true);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setInitialized(true);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        user,
        session,
        initialized,
        signOut: () => supabase.auth.signOut(),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}