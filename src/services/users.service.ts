import {supabase} from "./supabase.client.ts";
import type {UserEssentials, UserProfile} from "../types/userProfile.ts";

const userEssentialsCache = new Map<string, UserEssentials | null>();
const userEssentialsPromiseCache = new Map<string, Promise<UserEssentials | null>>();

export const getUserEssentials = (userId: string): Promise<UserEssentials | null> => {

    if (userEssentialsCache.has(userId)) {
        return Promise.resolve(userEssentialsCache.get(userId) ?? null);
    }

    if (userEssentialsPromiseCache.has(userId)) {
        return userEssentialsPromiseCache.get(userId)!;
    }

    const fetchPromise = (async () => {
        try {
            const { data, error } = await supabase
                .from('user_details')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error(error);
                userEssentialsCache.set(userId, null);
                return null;
            }

            userEssentialsCache.set(userId, data);
            return data;
        } catch (err) {
            console.error(err);
            userEssentialsCache.set(userId, null);
            return null;
        } finally {
            userEssentialsPromiseCache.delete(userId);
        }
    })();

    userEssentialsPromiseCache.set(userId, fetchPromise);
    return fetchPromise;
};



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

export const getUserProfile = async (alias: string): Promise<UserProfile | undefined> => {

    const {data, error} = await supabase
        .rpc('get_user_profile', {p_alias: alias})
        .single();

    if (error)
        console.error(error);

    if (data === null) {
        return undefined;
    }

    // @ts-expect-error: Ожидается, что вернется правильный тип
    return data;
}

export const getUserId = async (alias: string): Promise<string | null> => {
    const { data, error } = await supabase
        .from('user_details')
        .select(`id`)
        .eq('alias', alias)
        .single();

    if (error) {
        console.error(error);
        return null;
    }
    if (!data) {
        return null;
    }

    return data.id;
}

export const createUser = async (name: string, email: string, password: string, alias: string, invite_code: string): Promise<{status: boolean, error?: Error}> => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: name,
                alias: alias,
                invite_code: invite_code
            }
        }
    });

    if (error) {
        return {status: false, error: error};
    }

    return { status: data !== undefined }
}