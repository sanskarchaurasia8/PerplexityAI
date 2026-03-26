import { initilizeSocketConnection } from "../service/chat.socket";
import { getChats, getmessages, sendMessage } from "../service/chat.api";
import { setCurrentChatId, setError, setLoading, setChats, createNewChat, addNewMessage, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {
    const dispatch = useDispatch();

    async function handleSendMessage({ chatId, message }) {
        dispatch(setLoading(true));
        try {
            const data = await sendMessage({ chatId, message });
            const activeChat = data.chat;
            const aiText = data.AIMessage || data.aiMessage?.content || "";

            dispatch(createNewChat({
                chatId: activeChat._id,
                title: activeChat.title || "New Chat",
            }));
            dispatch(setCurrentChatId(activeChat._id));
            dispatch(addNewMessage({ chatId: activeChat._id, content: message, role: "user" }));
            dispatch(addNewMessage({ chatId: activeChat._id, content: aiText, role: "ai" }));

            return { ...data, aiText };
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message || "Error sending message"));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetChats() {
        dispatch(setLoading(true));
        const data = await getChats();
        const {chats} = data;
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                id: chat._id,
                title: chat.title || "New Chat",
                messages:  [],
                lastUpdated: chat.updatedAt,
            };
            return acc;
        }, {})));
        dispatch(setLoading(false));
    }

    async function handleOpenChat(chatId) {
        const data = await getmessages({ chatId });
        const { messages } = data;

        const formattedMessages = messages.map((msg) => ({
            content: msg.content,
            role: msg.role,
        }))

        dispatch(addMessages({
            chatId,
            messages: formattedMessages,
        }))

        dispatch(setCurrentChatId(chatId));
        
    }

    return {
        initilizeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    };
};
