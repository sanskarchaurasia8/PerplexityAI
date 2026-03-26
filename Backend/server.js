import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import "dotenv/config";

import app from "./src/app.js";
import http from "http";
import connectDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";

// ✅ ENV CHECK (CHANGE)
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET missing");
  process.exit(1);
}

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
      console.error(`Port ${PORT} is already in use.`);
      process.exit(1);
    }
    console.error("Server error:", err);
    process.exit(1);
  });