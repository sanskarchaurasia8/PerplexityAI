import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
import "dotenv/config";
process.env.JWT_SECRET = process.env.JWT_SECRET || "supersecretdev";
process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/perplexity";
import app from "./src/app.js";
import http from "http";
import connectDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";
import { testAi } from "./src/services/ai.service.js";


const PORT = process.env.PORT || 8000;

const httpServer = http.createServer(app);

initSocket(httpServer);


connectDB()
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });

httpServer.listen(PORT)
    .on("listening", () => {
        console.log(`Server running on port ${PORT}`);
    })
    .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`Port ${PORT} is already in use. Please stop the running process or set PORT to another value.`);
            process.exit(1);
        }
        console.error("Server error:", err);
        process.exit(1);
    });