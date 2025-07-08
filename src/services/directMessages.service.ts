import {supabase} from "./supabase.client.ts";

export interface DirectMessage {
    id: string;
    sender_id: string;
    receiver_id: string;
    text: string;
    is_read: boolean;
    created_at: string;
}

export interface Contact {
    contact_id: string;
    contact_alias: string;
    contact_name: string;
    contact_picture: string;
    last_message_text: string;
    last_message_created_at: string; // or Date if you plan to parse it
    is_last_message_read: boolean;
    is_current_user_sender: boolean;
    unread_messages_count: number;
}

export const sendMessage = async (receiverAlias: string, messageText: string): Promise<DirectMessage | undefined> => {
    const { data, error } = await supabase
        .rpc('send_direct_message', {
            p_receiver_alias: receiverAlias,
            p_message_text: messageText
        })
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
    return data;
};

export const fetchMessages = async (alias: string): Promise<DirectMessage[] | undefined> => {
    const { data, error } = await supabase
        .rpc('fetch_direct_messages_by_alias', {
            p_other_user_alias: alias
        })
        .select('*');

    console.log(data);

    if (error) {
        console.error('Error creating product:', error);
        return undefined;
    }

    if (data === undefined) {
        return undefined;
    }

    return data;
}


export const fetchContacts = async (): Promise<Contact[] | undefined> => {
    const { data, error } = await supabase
        .rpc('fetch_user_contacts')
        .select('*');

    console.log(data);

    if (error) {
        console.error('Error creating product:', error);
        return undefined;
    }

    if (data === undefined) {
        return undefined;
    }

    return data;
}