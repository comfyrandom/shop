import {supabase} from "./supabase.client.ts";
import type UserProfile from "../types/userProfile.ts";
import type { UserEssentials } from "../types/userProfile.ts";

export const getUserEssentials = async (userId: string): Promise<UserEssentials | null> => {
    const { data, error } = await supabase
        .from('user_details')
        .select(`*`)
        .eq('id', userId)
        .single();

    if (error) {
        console.error(error);
        return null;
    }
    if (!data) {
        return null;
    }

    return data;
}

export const getUserBalance = async (userId: string): Promise<number | null> => {
    const { data, error } = await supabase
        .from('user_balance')
        .select(`*`)
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error(error);
        return null;
    }
    if (!data) {
        return null;
    }

    return data.balance;
}

export const getProfile = async (userId: string): Promise<UserProfile | undefined> => {
    const { data, error } = await supabase
        .rpc('get_user_profile', { p_user_id: userId })
        .single();

    if (error)
        console.error(error);

    if (data === null) {
        return undefined;
    }

    console.log(data);
    
    // @ts-expect-error: Ожидается, что вернется правильный тип
    return data;
}