import {supabase} from "./supabase.client.ts";

export interface BlogPreviewRecord {
    id: number;
    title: string;
    author_id: number;
    author_details: {
        name: string;
        picture: string;
    };
    excerpt: string;
    created_at: string;
    tags: string[];
}

export interface BlogContent {
    content: string;
}

export const getBlogsPreview = async (): Promise<BlogPreviewRecord[]> => {
    const { data, error } = await supabase
        .from("blog_posts")
        .select(`id, title, excerpt, tags, author_id, created_at,
            author_details:user_details(name, picture)`);

    if (error) {
        console.error(error);
        return [];
    }

    if (data === null) {
        return [];
    }

    // @ts-expect-error: Конвертация типов пройдет нормально, в таблице owner_details только одна запись
    return data;
}

export const getBlogRecord = async (id: number): Promise<(BlogPreviewRecord & BlogContent) | null> => {
    const { data, error } = await supabase
        .from("blog_posts")
        .select(`id, title, excerpt, tags, author_id, content, created_at,
            author_details:user_details(name, picture)`)
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    if (data === null) {
        return null;
    }

    // @ts-expect-error: Конвертация типов пройдет нормально, в таблице owner_details только одна запись
    return data;
}