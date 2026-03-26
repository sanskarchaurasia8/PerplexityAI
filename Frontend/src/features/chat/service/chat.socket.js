import { io } from "socket.io-client";


export const initilizeSocketConnection = () => {

    const socket = io("https://perplexityai-3rlb.onrender.com", {
        withCredentials: true,
    })

    socket.on("connect", () => {
        console.log("Connected to Socket.io server with ID: " + socket.id);
    })

}