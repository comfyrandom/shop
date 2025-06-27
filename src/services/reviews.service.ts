import { supabase } from "./supabase.client.ts";

export const addReview = async (
    user_id: string,
    reviewer_id: string,
    rating: number,
    comment: string
): Promise<boolean> => {
    const { error } = await supabase.from("user_reviews").insert([
        {
            user_id,
            reviewer_id,
            rating,
            comment,
        },
    ]);

    return !error;
};

export const updateReview = async (
    user_id: string,
    reviewer_id: string,
    rating: number,
    comment: string
): Promise<boolean> => {
    const { error } = await supabase
        .from("user_reviews")
        .update({
            rating,
            comment
        })
        .eq('user_id', user_id)
        .eq('reviewer_id', reviewer_id);

    return !error;
};

export const deleteReview = async (
    user_id: string,
    reviewer_id: string
): Promise<boolean> => {
    const { error } = await supabase
        .from("user_reviews")
        .delete()
        .eq('user_id', user_id)
        .eq('reviewer_id', reviewer_id);

    return !error;
};