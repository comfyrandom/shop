import {supabase} from "./supabase.client.ts";

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

export const getAllProductCards = async (): Promise<ProductCard[]> => {
    const { data } = await supabase.from("product_card_view").select();

    console.log(data);

    if (data === null)
        return [];

    return data;
}