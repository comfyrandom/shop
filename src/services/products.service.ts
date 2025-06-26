import {supabase} from "./supabase.client.ts";
import type {Product, ProductDetails} from "../types/product.ts";
import type Collection from "../types/collection.ts";

export interface ProductCard {
    id: number;
    name: string;
    price: number;
    picture: string;
    owner: {
        id: number;
        name: string;
    };
}

export interface CollectionResponse {
    collection: Collection;
}

export const getAllProductCards = async (): Promise<ProductCard[]> => {
    const { data } = await supabase.from("product_card_view").select();

    console.log(data);

    if (data === null)
        return [];

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