const { logInfo, logWarn, logError } = require("./utils/logger");

function initSignaling(io) {
  io.on("connection", (socket) => {
    logInfo(`Socket connected: ${socket.id}`);
    socket.on("signal", ({ roomId, data }) => {
      if (!roomId) {
        logWarn(`Signal received without roomId from ${socket.id}`);
        return;
      }

      try {
        socket.to(roomId).emit("signal", { from: socket.id, data });
        logInfo(`Signal from ${socket.id} forwarded in room ${roomId} (type: ${data.type})`);
      } catch (err) {
        logError(`Error forwarding signal from ${socket.id} in room ${roomId}: ${err.message}`);
      }
    });

    socket.on("reconnectRoom", (roomId) => {
      if (!roomId) {
        logWarn(`reconnectRoom called without roomId by ${socket.id}`);
        return;
      }
      socket.join(roomId);
      logInfo(`Socket ${socket.id} reconnected to room ${roomId}`);
    });

    socket.on("disconnect", (reason) => {
      logWarn(`Socket disconnected: ${socket.id} (${reason})`);
    });

    socket.on("error", (err) => {
      logError(`Socket error on ${socket.id}: ${err.message}`);
    });
  });
}

module.exports = { initSignaling };
