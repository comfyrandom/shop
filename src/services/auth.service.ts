import {supabase} from "./supabase.client.ts";
import type {User} from "@supabase/supabase-js";

export const signInWithEmail = async (email:string, password:string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

export const getName = async (userId:string) => {
    const { data } = await supabase.from("profiles").select('name').eq('user_id', userId).single();

    if (data === null)
        return;

    return data.name;
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user ?? null);
    });
};