import {supabase} from "./supabase.client.ts";
import type {ProductEssentials} from "./products.service.ts";

export interface RevelationPost {
    id: number;
    author?: ProductEssentials | undefined;
    content: string;
    isLiked: boolean;
    likes: number;
    location: string;
    created_at: string;
    comments: Array<{
        id: number;
        content: string;
        created_at: string;
        user_id: number;
        user: {
            alias: string;
            name: string;
            picture: string;
        }
    }>
    media?: string;
}

export const addRevelationComment = async (postId: number, productId: number, content: string): Promise<boolean> => {
    const { error } = await supabase
        .from("revelations_comments")
        .insert({
            post_id: postId,
            user_id: productId, // The product acting as author
            content: content
        });

    if (error)
    {
        console.error(error);
        return false;
    }

    return true;
}

export const createRevelationPost = async (userId:number, content:string, location?: string, media?: string): Promise<RevelationPost | undefined> => {
    const { data, error } = await supabase
        .from("revelations")
        .insert({
            author: userId,
            content: content,
            location: location,
            media: media
        })
        .select(`*,author:products(id, name, picture, alias)`)
        .single();

    if (error)
    {
        console.error(error);
        return undefined;
    }

    return data;
}

export const getRevelationPosts = async (userId?: string): Promise<RevelationPost[]> => {
    const { data, error } = await supabase
        .from("revelations")
        .select(`
        *,
        author:products(id, name, picture, alias),
        likes:revelations_likes(count),
        user_like:revelations_likes!left(user_id),
        comments:revelations_comments!left(
            user_id,
            id,
            content,
            created_at,
            user:products!inner(alias, name, picture)
        )
    `)
    .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return [];
    }

    if (!data) {
        return [];
    }

    return data.map(revelation => {
        const likesCount = revelation.likes?.[0]?.count || 0;
        const userLikes = revelation.user_like || [];
        const isLiked = userId ? userLikes.some((like: { user_id: string; }) => like.user_id === userId) : false;

        const sortedComments = revelation.comments ?
            [...revelation.comments].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            ) : [];

        return {
            id: revelation.id,
            author: revelation.author,
            content: revelation.content,
            comments: sortedComments,
            location: revelation.location,
            isLiked,
            likes: likesCount,
            created_at: revelation.created_at,
            media: revelation.media
        };
    });
};

export const deleteRevelationPosts = async (postId?: number): Promise<boolean> => {
    const { data, error } = await supabase
        .from("revelations")
        .delete()
        .eq('id', postId)
        .select()
        .single();

    if (error) {
        console.error(error);
        return false;
    }

    return data && !error;
};

export const deleteRevelationComment = async (commentId?: number): Promise<boolean> => {
    const { data, error } = await supabase
        .from("revelations_comments")
        .delete()
        .eq('id', commentId)
        .select()
        .single();

    if (error) {
        console.error(error);
        return false;
    }

    return data && !error;
};


export const toggleRevelationLike = async (
    revelationId: number,
    userId: string,
    currentlyLiked: boolean
): Promise<{ success: boolean; error?: string }> => {
    try {
        if (currentlyLiked) {
            const { error } = await supabase
                .from("revelations_likes")
                .delete()
                .eq("revelation_id", revelationId)
                .eq("user_id", userId);

            if (error) throw error;
        } else {
            const { error } = await supabase
                .from("revelations_likes")
                .insert({
                    revelation_id: revelationId,
                    user_id: userId,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error toggling like:", error);
        return {
            success: false,
            error: error.message || "Failed to toggle like"
        };
    }
};