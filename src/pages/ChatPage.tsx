import {useAuth} from "../hooks/useAuth.ts";
import {useEffect} from "react";
import {receiveMessages, sendMessages} from "../services/chat.service.ts";

const ConversationPage = () => {
    const { user } = useAuth();

    useEffect(() => {
        const fetch = async () => {
            if (user !== null) {
                sendMessages(user.id);
            }

            receiveMessages();
        }

        fetch();
    }, [user?.id]);

    return <>
        Hello, world!
    </>
};

export default ConversationPage;