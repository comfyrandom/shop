import {supabase} from "./supabase.client.ts";
import type {Product, ProductDetails} from "../types/product.ts";
import type Collection from "../types/collection.ts";

export interface ProductEssentials {
    id: number;
    name: string;
    alias: string;
    price: number;
    price_history: Array<{
        price: number;
        created_at: string;
    }>
    picture: string;
    owner_id: string;
    owner_details: {
        alias: string;
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
                alias,
                owner_id,
                owner_details:user_details!products_owner_id_fkey1 (name, alias),
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
            owner_details:user_details!owner_id(name, picture, about, alias),
            price:product_price (
                    price,
                    created_at
            ),
            passport_data(*)
        `)
        .eq('id', id)
        .single();

    if (error || !data)
        return undefined;

    return {
        ...data,
        collections: data.collections?.map((response: CollectionResponse) => response.collection) || [],
        price_history: data.price,
        price: data.price?.length
            ? [...data.price].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0].price
            : 0
    };
};

export const getProductByAlias = async (alias: string): Promise<(Product & ProductDetails) | undefined> => {
    const { data, error } = await supabase
        .from('products')
        .select(`*,
            details:product_details(*),
            collections:product_collections(
                collection:collections(*)
            ),
            owner_details:user_details!owner_id(name, picture, about, alias),
            price:product_price (
                    price,
                    created_at
            ),
            passport_data(*)
        `)
        .eq('alias', alias)
        .single();

    if (error || !data)
        return undefined;

    return {
        ...data,
        collections: data.collections?.map((response: CollectionResponse) => response.collection) || [],
        price_history: data.price,
        price: data.price?.length
            ? [...data.price].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0].price
            : 0
    };
};

export async function updateSaleStatus(productId: number, isOnSale: boolean, price?: number) {
    if (isOnSale) {
        if (!price) {
            throw new Error("Price is required");
        }

        const { error } = await supabase
            .rpc('place_item_on_sale', {
                product_id: productId,
                price: price
        });

        if (error) {
            console.error('Error calling function:', error);
            return false;
        } else {
            return true;
        }
    } else {
        const { data, error } = await supabase
            .from('products')
            .update({
                status: 'NOT_FOR_SALE'
            })
            .eq('id', productId)
            .select();

        if (error) {
            console.error('Error calling function:', error);
            return false;
        }

        console.log(data);
        return data !== null && data.length > 0;
    }
}

export interface ProductCreation {
    alias: string;
    picture: string;
    name: string;
    description: string;
    details: {
        sexual_preference: string;
        ethnicity: string;
        max_wear: string;
        background: string;
        biometry: string;
        condition: string;
        pussy: string;
        age: number;
        height: number;
        weight: number;
        appearance: string[];
        personality: string[];
        kinks: Array<{
            text: string;
            color?: string;
        }>;
        scenarios: Array<{
            title: string;
            description: string;
        }>;
        extras: Array<{
            name: string;
            description: string;
            value: string;
            exclusive: boolean;
        }>;
        history: Array<{
            date: string;
            title: string;
            description: string;
        }>;
        relationships: Array<{
            name: string;
            relation: string;
            status?: string;
        }>;
        badges: Array<{
            text: string;
            color: string;
        }>;
        features: Array<{
            title: string;
            description: string;
        }>;
        accessories: Array<{
            name: string;
            type: string;
            description: string;
            price: string;
            included: boolean;
        }>;
    };
}

export async function createProduct(product: ProductCreation) : Promise<number | undefined> {
    const { data, error } = await supabase
        .rpc('create_product', { product_data: product })
        .single();

    if (error) {
        console.error('Error creating product:', error);
        return undefined;
    }

    // @ts-expect-error: Приведение типов пройдет нормально
    if (data === undefined || data.product == undefined) {
        return undefined;
    }

    // @ts-expect-error: Приведение типов пройдет нормально
    return data.product.id as number;
}

export async function updateProduct(product: Product & ProductDetails) {
    const { data, error } = await supabase
        .rpc('update_product', { product_data: product })
        .single();

    console.log(data);

    if (error) {
        console.error('Error updating product:', error);
        return false;
    }

    return data;
}

export interface PurchaseResult {
    success?: boolean;
    error?: string;
    message?: string;
    transaction_id?: string;
}

export async function purchaseProduct(product_id: number, price: number) : Promise<PurchaseResult> {
    const { data, error } = await supabase
        .rpc('purchase_product', {
            p_product_id: product_id,
            p_price: price
        });

    if (error) {
        return {
            success: false,
            error: error.message
        }
    } else {
        return data;
    }
}

