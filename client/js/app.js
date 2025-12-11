import { initLocalStream, startWebRTC, createOffer, handleSignal, disconnect } from "./webrtc.js";
import { setStatus, toggleButtons, showAlert } from "./ui.js";

const socket = io();
const startBtn = document.getElementById("startBtn");
const disconnectBtn = document.getElementById("disconnectBtn");

let currentRoomId = null;

async function initApp() {
  await initLocalStream();
  toggleButtons(false);

  startBtn.onclick = () => {
    setStatus("Searching for partner...");
    socket.emit("joinQueue");
    toggleButtons(true);
  };

  disconnectBtn.onclick = () => {
    if (currentRoomId) {
      socket.emit("disconnectRoom", currentRoomId);
    }
    disconnect();
  };
}

socket.on("matched", ({ roomId, partnerId }) => {
  currentRoomId = roomId;
  setStatus(`Connected with ${partnerId}`);
  startWebRTC(socket, roomId);
  createOffer();
});

socket.on("signal", async ({ from, data }) => {
  await handleSignal(from, data);
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
  console.error(err);
});

socket.on("disconnect", () => {
  showAlert("Server connection lost", "warn");
  disconnect();
  currentRoomId = null;
});

window.onload = initApp;
