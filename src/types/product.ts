import type Collection from "./collection.ts";

export interface Product {
    id: number;
    name: string;
    price: number;
    picture: string;
    description: string;
    collections?: Collection[];
    owner: string;
}

export interface ProductDetails {
    details: {
        age: number;
        ethnicity?: string;
        biometry: string;
        max_wear: string;
        condition : string;
        background: string;
        height: { inches: number; meters: number };
        weight: { pounds: number; kilograms: number };
        measurements: { inches: string; cm: string };
        pussy: string;
        sexual_preference: string;
        kinks?: Array<{
            text: string;
            color?: string;
        }>;
        extras?: Array<{
            name: string,
            description: string,
            value: string,
            exclusive: boolean
        }>;
        appearance?: string[];
        personality?: string[];
        scenarios?: Array<{
            title: string;
            description: string;
        }>;
        history?: Array<{
            date: string;
            title: string;
            description: string;
        }>;
        relationships?: Array<{
            name: string;
            relation: string;
            status?: string;
        }>;
        badges?: Array<{
            text: string;
            color: string;
        }>;
        features?: Array<{
            title: string;
            description: string;
        }>;
        accessories?: Array<{
            name: string;
            type: string;
            description: string;
            price: string;
            included: boolean;
        }>;
    }
}