import type Collection from "./collection.ts";

export interface Product {
    id: number;
    name: string;
    alias: string;
    price: number;
    picture: string;
    description: string;
    collections?: Collection[];
    owner_id: string;
    status: 'FOR_SALE' | 'NOT_FOR_SALE';
}

export interface PassportData {
    last_name: string;
    first_name: string;
    middle_name: string;
    gender: string;
    date_of_birth: string;
    place_of_birth: string;
    passport_number: string;
    issue_date: string;
    issued_by: string;
    registration: string;
    biometric_id: string;
}

export interface ProductDetails {
    owner_details: {
        name: string;
        picture: string;
        about: string;
    },
    passport_data: PassportData;
    price_history: Array<{
        price: number;
        created_at: string;
    }>,
    details: {
        age: number;
        ethnicity?: string;
        biometry: string;
        max_wear: string;
        condition : string;
        background: string;
        height: number;
        weight: number;
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