const { logInfo, logWarn, logError } = require("./utils/logger");

function initSignaling(io) {
  io.on("connection", (socket) => {

    logInfo(`Socket connected to signaling: ${socket.id}`);

    socket.on("signal", ({ roomId, data }) => {
      if (!roomId) {
        logWarn(`signal received without roomId from ${socket.id}`);
        return;
      }

      socket.to(roomId).emit("signal", { from: socket.id, data });
      logInfo(`Signal of ${socket.id} forwarded on ${roomId} (type: ${data.type})`);
    });

    socket.on("reconnectRoom", (roomId) => {
      socket.join(roomId);
      logInfo(`Socket ${socket.id} reconnected to the room. ${roomId}`);
    });

    socket.on("disconnect", () => {
      logWarn(`Socket disconnected from signaling: ${socket.id}`);
    });
  });
}

module.exports = { initSignaling };
