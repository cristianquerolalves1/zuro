const { logInfo, logWarn, logError } = require("./utils/logger");

const waitingUsers = new Map();
const activeRooms = new Map();

function initMatchmaking(io) {
  io.on("connection", (socket) => {
    logInfo(`User connected: ${socket.id}`);
    socket.on("joinQueue", () => {
      if (!waitingUsers.has(socket.id)) {
        waitingUsers.set(socket.id, socket);
        logInfo(`User ${socket.id} added to queue.`);
        tryMatch(io);
      }
    });

    socket.on("reconnectRoom", (roomId) => {
      if (activeRooms.has(roomId)) {
        const room = activeRooms.get(roomId);
        if (!room.users.includes(socket.id)) {
          room.users.push(socket.id);
          socket.join(roomId);
          logInfo(`User ${socket.id} reconnected to room ${roomId}`);
        }
      }
    });

    socket.on("disconnect", () => {
      logWarn(`User disconnected: ${socket.id}`);
      waitingUsers.delete(socket.id);

      for (const [roomId, room] of activeRooms.entries()) {
        if (room.users.includes(socket.id)) {
          socket.to(roomId).emit("partnerDisconnected");
          activeRooms.delete(roomId);
          logInfo(`Room ${roomId} deleted after disconnection.`);
          break;
        }
      }
    });

    socket.on("error", (err) => {
      logError(`Socket error (${socket.id}):`, err);
    });
  });
}

function tryMatch(io) {
  const users = Array.from(waitingUsers.values());

  while (users.length >= 2) {
    const userA = users.shift();
    const userB = users.shift();

    const roomId = `room-${userA.id}-${userB.id}`;

    userA.join(roomId);
    userB.join(roomId);

    activeRooms.set(roomId, { users: [userA.id, userB.id] });

    userA.emit("matched", { roomId, partnerId: userB.id });
    userB.emit("matched", { roomId, partnerId: userA.id });

    waitingUsers.delete(userA.id);
    waitingUsers.delete(userB.id);

    logInfo(`Room created: ${roomId} (${userA.id} <-> ${userB.id})`);
  }
}

module.exports = { initMatchmaking };
