import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})


export const sendMessage = async ({ chat, message }) => {
    const response = await api.post("/api/chats/message", { chat, message });
    return response.data;
}

export const getChats = async () => {
    const response = await api.get("/api/chats")
    return response.data;
}

export const getmessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`);
    return response.data;
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/${chatId}`);
    return response.data;
}