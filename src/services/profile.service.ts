import {supabase} from "./supabase.client.ts";

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