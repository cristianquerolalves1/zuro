const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { initSignaling } = require("./signaling");
const { initMatchmaking } = require("./matchmaking");
const { logInfo, logError } = require("./utils/logger");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "*", 
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000, 
  maxHttpBufferSize: 1e6, 
});

app.use(express.static("client"));
app.use("/assets", express.static("public/assets"));

initMatchmaking(io);
initSignaling(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => logInfo(`Server running on http://localhost:${PORT}`));
process.on("uncaughtException", (err) => {
  logError("Uncaught exception:", err);
});

process.on("unhandledRejection", (err) => {
  logError("Unhandled promise rejection:", err);
});
