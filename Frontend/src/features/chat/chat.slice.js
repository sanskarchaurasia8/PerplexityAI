import { createSlice } from "@reduxjs/toolkit";


const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chat: {},
        currentChatId: null,
        isLoading: false,
        error: null, 
    },
    reducers: {
        createNewChat(state, action) {
            const {chatId,title} = action.payload;
            state.chat[chatId] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            }
        },
        addNewMessage(state, action) {
            const { chatId, content, role } = action.payload;
            if (!state.chat[chatId]) {
                state.chat[chatId] = { id: chatId, title: "New Chat", messages: [] };
            }
            state.chat[chatId].messages.push({ content, role });
        },
        addMessages(state, action) {
            const { chatId, messages } = action.payload;
            if (!state.chat[chatId]) {
                state.chat[chatId] = { id: chatId, title: "New Chat", messages: [] };
            }
            state.chat[chatId].messages.push(...messages);
        },
        setChat(state, action) {
            state.chat = action.payload;
        },
        setChats(state, action) {
            state.chat = action.payload;
        },
        setCurrentChatId(state, action) {
            state.currentChatId = action.payload;
        },
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        }
    }
})

export const { setChat, setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages } = chatSlice.actions;
export default chatSlice.reducer;

// chats = {
//     "docker and AWS": {
//         messages: [
//             {
//                 role: "user",
//                 content: "what is docker?"
//             },
//             {
//                 role: "ai",
//                 content: "Docker is a platform that allows developers to automate the deployment of applications inside lightweight, portable containers. It enables you to package an application with all of its dependencies into a standardized unit for software development. This makes it easier to develop, ship, and run applications across different environments, ensuring consistency and efficiency."
//             }
//         ],
//         id: "docker and aws",
//         lastUpdated: "2024-06-20T12:00:00Z",
//     }  
//  }
