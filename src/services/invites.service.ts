import {supabase} from "./supabase.client.ts";

export interface Invite {
    id: number;
    code: string;
    used_by: {
        name: string;
        alias: string;
    } | null;
}

export const getInvites = async (): Promise<Invite[]> => {
    const { data, error } = await supabase
        .from("invites")
        .select(`
                id,
                code,
                used_by:user_details!invites_used_by_fkey(name, alias)
        `);

    if (error) {
        console.error(error);
        return [];
    }

    if (!data) {
        return [];
    }

    //@ts-expect-error: Типы приведутся нормально
    return data;
};

export const createInvite = async (): Promise<Invite | null> => {
    const { data, error } = await supabase
        .from("invites")
        .insert({})
        .select(`
                id,
                code,
                used_by:user_details!invites_used_by_fkey(name, alias)
        `)
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    if (!data) {
        return null;
    }

    //@ts-expect-error: Типы приведутся нормально
    return data;
};