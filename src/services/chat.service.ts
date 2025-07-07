import {supabase} from "./supabase.client.ts";

export function receiveMessages() {
    const myChannel = supabase.channel('test-channel')

    function messageReceived(payload: unknown) {
        console.log(payload)
    }

    myChannel
        .on(
            'broadcast',
            { event: 'shout' }, // Listen for "shout". Can be "*" to listen to all events
            (payload) => messageReceived(payload)
        )
        .subscribe()
}

export function sendMessages(username: string) {
    const myChannel = supabase.channel('test-channel')

    myChannel
        .send({
            type: 'broadcast',
            event: 'shout',
            payload: { message: `Hi, my name is ${username}` },
        })
        .then((resp) => console.log(resp))


    myChannel.subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
            return null
        }

        myChannel.send({
            type: 'broadcast',
            event: 'shout',
            payload: { message: 'Hi' },
        })
    })
}