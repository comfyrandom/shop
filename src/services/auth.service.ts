import { supabase } from "./supabase.client.ts";
import type { User } from "@supabase/supabase-js";

export const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    window.location.reload();
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    window.location.reload();
    return { error };
};

export const isAuthenticated = async (): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user !== null;
};

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user ?? null);
    });
};