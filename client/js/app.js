import { initLocalStream, startWebRTC, createOffer, handleSignal, disconnect } from "./webrtc.js";
import { setStatus, toggleButtons, showAlert } from "./ui.js";

const socket = io();
const startBtn = document.getElementById("startBtn");
const disconnectBtn = document.getElementById("disconnectBtn");

let currentRoomId = null;

async function initApp() {
  try {
    await initLocalStream();
    toggleButtons(false);
    attachEventHandlers();
  } catch (error) {
    showAlert("Failed to initialize local media", "error");
    console.error("initApp error:", error);
  }
}

function attachEventHandlers() {
  startBtn.addEventListener("click", async () => {
    setStatus("Searching for partner...");
    toggleButtons(true);
    socket.emit("joinQueue");
  });

  disconnectBtn.addEventListener("click", () => {
    if (currentRoomId) {
      socket.emit("disconnectRoom", currentRoomId);
    }
    disconnect();
    currentRoomId = null;
    toggleButtons(false);
    setStatus("Disconnected");
  });
}

// Eventos de socket
socket.on("matched", ({ roomId, partnerId }) => {
  currentRoomId = roomId;
  setStatus(`Connected with ${partnerId}`);
  startWebRTC(socket, roomId);
  createOffer();
});

socket.on("signal", async ({ from, data }) => {
  try {
    await handleSignal(from, data);
  } catch (err) {
    console.error("Signal handling error:", err);
  }
});

socket.on("partnerDisconnected", () => {
  showAlert("Your partner disconnected.", "warn");
  disconnect();
  currentRoomId = null;
  toggleButtons(false);
  setStatus("Searching for new partner...");
  socket.emit("joinQueue");
});

socket.on("connect_error", (err) => {
  showAlert("Connection error with server", "error");
  console.error("Socket connection error:", err);
});

socket.on("disconnect", () => {
  showAlert("Server connection lost", "warn");
  disconnect();
  currentRoomId = null;
  toggleButtons(false);
});

window.addEventListener("load", initApp);
