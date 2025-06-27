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
        .select(`id, name, picture, price, owner_id,
            owner_details:user_details!products_owner_id_fkey1 (name)`);

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

export const getProductById = async (id: number): Promise<(Product & ProductDetails) | undefined> => {
    const { data, error } = await supabase
        .from('products')
        .select(`*,
            details:product_details(*),
            collections:product_collections(
                collection:collections(*)
            )
        `)
        .eq('id', id)
        .single();

    if (error || !data)
        return undefined;

    console.log(data);
    return {
        ...data,
        collections: data.collections?.map((response:CollectionResponse) => response.collection) || []
    };
};