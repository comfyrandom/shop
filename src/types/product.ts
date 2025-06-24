export interface Product {
    id: number;
    name: string;
    price: number;
    picture: string;
    owner: string;
}

export interface ProductDetails {
    product_details: unknown;
}