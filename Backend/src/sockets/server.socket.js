import {Server} from "socket.io";

let io;
export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5176",
                "http://localhost:5177",
                "http://localhost:5178",
                "http://localhost:5179",
                "http://localhost:5180",
                "http://localhost:5181",
                "http://localhost:5182",
                "http://localhost:5183"
            ],
            credentials: true,
        }
    })

    console.log("Socket.io server is RUNNING");

    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.id);
    })

}

export function getIo() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}