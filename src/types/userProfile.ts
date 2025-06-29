import type {Product} from "./product.ts";
import type {BlogPreviewRecord} from "../services/blog.service.ts";

export interface Certificate {
    user_id: string;
    certificate_id: number;
    certificate_name: string;
    certificate_level: string;
    year: number;
}

export interface Testimonial {
    created_at: string,
    reviewer_id: string,
    reviewer_name: string,
    rating: number,
    comment: string
}

export interface Socials {
    email: string,
    github: string,
    discord: string,
    twitter: string,
    website: string,
    telegram: string,
    deviantart: string,
}

export interface UserEssentials {
    id: string;
    location: string;
    name: string;
    picture: string;
}

export default interface UserProfile {
    id: string;
    name: string;
    picture?: string;
    about: string,
    wearing_id?: number;
    location?: string;
    join_date: string;
    wearing_item?: Product;
    pinned_items?: Product[];
    blog_posts?: BlogPreviewRecord[];
    owned_items?: Product[];
    certificates?: Certificate[];
    reviews?: Testimonial[];
    socials: Socials;
}