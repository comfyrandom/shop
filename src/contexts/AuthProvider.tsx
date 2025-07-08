import React, { useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../services/supabase.client.ts";
import { AuthContext } from "./AuthContext.tsx";
import type { UserEssentials } from "../types/userProfile.ts";
import { getUserEssentials } from "../services/users.service.ts";
import {broadcastService} from "../services/broadcast.service.ts";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [initialized, setInitialized] = useState(false);
    const [essentials, setEssentials] = useState<UserEssentials | null>(null);

    const hasInitialized = useRef(false); // to avoid duplicate fetch

    const fetchEssentials = async (userId: string) => {
        try {
            const data = await getUserEssentials(userId);
            setEssentials(data);
        } catch (error) {
            console.error("Failed to fetch essentials:", error);
            setEssentials(null);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setSession(session);
            setUser(currentUser);
            if (currentUser) fetchEssentials(currentUser.id);
            setInitialized(true);
            hasInitialized.current = true;
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!hasInitialized.current)
                return;

            const currentUser = session?.user ?? null;
            setSession(session);
            setUser(currentUser);

            if (currentUser)
                fetchEssentials(currentUser.id);
            else
                setEssentials(null);

            setInitialized(true);
            broadcastService.setCurrentUser(currentUser?.id ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        user,
        session,
        initialized,
        essentials,
        signOut: () => supabase.auth.signOut(),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
