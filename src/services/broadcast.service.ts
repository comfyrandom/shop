// services/broadcast.service.ts

import { supabase } from "./supabase.client"
import type {RealtimeChannel} from "@supabase/supabase-js";
import type {DirectMessage} from "./directMessages.service.ts";

interface BroadcastMessage {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    new: DirectMessage;
    old: DirectMessage;
    senderId?: string;
}

export class BroadcastService {
    private channelName: string
    private channel: RealtimeChannel | undefined;
    private subscribers: Map<string, (message: BroadcastMessage) => void>
    private currentUserId: string | null;

    constructor(channelName: string = 'schema-db-changes', currentUserId: string | null = null) {
        this.channelName = channelName
        this.subscribers = new Map()
        this.currentUserId = currentUserId;
        this.initializeChannel()
    }

    public setCurrentUser(userId: string | null) {
        this.currentUserId = userId;
    }

    private initializeChannel() {
        this.channel = supabase.channel(this.channelName)

        this.channel
            //@ts-expect-error: Каст пройдет нормально
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'direct_messages'
            }, async (payload: BroadcastMessage) => {
                if (payload.eventType === 'INSERT' &&
                    this.currentUserId &&
                    payload.new.receiver_id === this.currentUserId) {
                    await this.markMessageAsRead(payload.new.id);
                }

                this.notifySubscribers(payload)
            })
            .subscribe()
    }

    private async markMessageAsRead(messageId: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('direct_messages')
                .update({ is_read: true })
                .eq('id', messageId);

            if (error) throw error;

            console.log(`Message ${messageId} marked as read`);
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    }

    public subscribe(
        subscriptionId: string,
        callback: (message: BroadcastMessage) => void
    ): void {
        console.log(`Subscribing to ${subscriptionId}`)
        this.subscribers.set(subscriptionId, callback)
    }

    public unsubscribe(subscriptionId: string): void {
        this.subscribers.delete(subscriptionId)
    }

    private notifySubscribers(message: BroadcastMessage): void {
        console.log(message);
        this.subscribers.forEach((callback) => {
            callback(message)
        })
    }

    public disconnect(): void {
        if (!this.channel) {
            return;
        }

        supabase.removeChannel(this.channel)
    }
}

// Singleton instance (optional)
export const broadcastService = new BroadcastService()