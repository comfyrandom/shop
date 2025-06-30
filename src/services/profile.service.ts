import {supabase} from "./supabase.client.ts";
import type {UserProfile} from "../types/userProfile.ts";

export const updateWearing = async (user_id: string, product_id?: number): Promise<boolean> => {
    const { error } = await supabase
        .from("user_details")
        .update({
            wearing_id: product_id ?? null,
        })
        .eq('id', user_id);

    if (error)
        console.error(error);

    return !error;
};

export async function updatePinned(user_id: string, product_id: number, isPinned: boolean) {

    if (isPinned) {
        const { error } = await supabase
            .from("user_pinned_products")
            .insert({
                user_id: user_id,
                product_id: product_id,
            });

        if (error)
            console.error(error);

        return !error;
    }
    else {
        const { error } = await supabase
            .from("user_pinned_products")
            .delete()
            .eq('user_id', user_id)
            .eq('product_id', product_id);

        if (error)
            console.error(error);

        return !error;
    }
}

export async function updateProfile(profile: UserProfile) {
    const { data, error } = await supabase
        .rpc('update_user_profile', {
            p_user_data: {
                id: profile.id,
                name: profile.name,
                alias: profile.alias,
                about: profile.about,
                location: profile.location,
                picture: profile.picture,
            },
            p_socials_data: {
                email: profile.socials.email,
                github: profile.socials.github,
                discord: profile.socials.discord,
                twitter: profile.socials.twitter,
                website: profile.socials.website,
                telegram: profile.socials.telegram,
                deviantart: profile.socials.deviantart,
            }
        });

    if (error) {
        return { success: false, error: error };
    }

    return data;
}