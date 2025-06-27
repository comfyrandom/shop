import {supabase} from "./supabase.client.ts";
import type {Product, ProductDetails} from "../types/product.ts";
import type Collection from "../types/collection.ts";

export interface ProductEssentials {
    id: number;
    name: string;
    price: number;
    picture: string;
    owner_id: string;
    owner_details: {
        name: string;
    };
}

export interface CollectionResponse {
    collection: Collection;
}

export const getProductEssentials = async (): Promise<ProductEssentials[]> => {
    const { data, error } = await supabase
        .from("products")
        .select(`
                id,
                name,
                picture,
                owner_id,
                owner_details:user_details!products_owner_id_fkey1 (name),
                price:latest_product_price (
                    price,
                    created_at
                )
        `)
        .eq("status", "FOR_SALE");

    if (error) {
        console.error(error);
        return [];
    }

    if (!data) {
        return [];
    }

    // @ts-expect-error: Конвертация типов будет правильной
    return data.map((product) => ({
        ...product,
        price: product.price?.[0]?.price ?? 0
    }));
};


export const getProductById = async (id: number): Promise<(Product & ProductDetails) | undefined> => {
    const { data, error } = await supabase
        .from('products')
        .select(`*,
            details:product_details(*),
            collections:product_collections(
                collection:collections(*)
            ),
            owner_details:user_details!owner_id(name, picture, about),
            price:latest_product_price (
                    price,
                    created_at
            )
        `)
        .eq('id', id)
        .single();

    if (error || !data)
        return undefined;

    return {
        ...data,
        collections: data.collections?.map((response:CollectionResponse) => response.collection) || [],
        price: data.price?.[0]?.price ?? 0
    };
};