import {supabase} from "./supabase.client.ts";

export interface BlogPreviewRecord {
    id: number;
    title: string;
    author_id: string;
    author_details: {
        name: string;
        picture: string;
        alias: string;
    };
    excerpt: string;
    created_at: string;
    tags: string[];
}

export interface BlogContent {
    content: string;
}

export const createBlogPost = async (title: string, content: string, excerpt: string, tags: string[]) : Promise<number | boolean> => {
    const { data, error } = await supabase
        .from('blog_posts')
        .insert({
            title,
            content,
            excerpt,
            tags
        })
        .select()
        .single();

    if (!data || error)
        return false;

    return data.id;
}

export const updateBlogPost = async (id: number, title: string, content: string, excerpt: string, tags: string[]) : Promise<number | boolean> => {
    const { data, error } = await supabase
        .from('blog_posts')
        .update({
            title,
            content,
            excerpt,
            tags
        })
        .eq('id', id)
        .select()
        .single();

    if (!data || error)
        return false;

    return data.id;
}


export const deleteBlogPost = async (id: number) : Promise<boolean> => {
    const { data, error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)
        .select()
        .single();

    return data && !error;
}

export const getBlogsPreview = async (): Promise<BlogPreviewRecord[]> => {
    const { data, error } = await supabase
        .from("blog_posts")
        .select(`id, title, excerpt, tags, author_id, created_at,
        author_details:user_details(name, alias, picture)`)
        .order('id', { ascending: false }); // or set ascending: false for descending order

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
            author_details:user_details(name, picture, alias)`)
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