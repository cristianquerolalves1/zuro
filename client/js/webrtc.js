import { iceServers } from "./config.js";
import { setStatus, toggleButtons, showAlert } from "./ui.js";

let localStream;
let peerConnection;
let roomId;
let socket;

export async function initLocalStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById("localVideo").srcObject = localStream;
    setStatus("Camera and microphone ready.");
  } catch (err) {
    showAlert("Could not access camera/microphone.", "error");
    console.error(err);
  }
}

export function startWebRTC(socketInstance, assignedRoomId) {
  socket = socketInstance;
  roomId = assignedRoomId;

  peerConnection = new RTCPeerConnection({ iceServers });

  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  peerConnection.ontrack = (event) => {
    document.getElementById("remoteVideo").srcObject = event.streams[0];
    setStatus("Connected with partner");
    toggleButtons(true);
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("signal", { roomId, data: { type: "ice", candidate: event.candidate } });
    }
  };

  peerConnection.onconnectionstatechange = () => {
    const state = peerConnection.connectionState;
    if (state === "disconnected" || state === "failed") {
      showAlert("Connection lost. Attempting to reconnect...", "warn");
    } else if (state === "connected") {
      showAlert("Connection established successfully", "info");
    }
  };
}

export async function createOffer() {
  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("signal", { roomId, data: offer });
  } catch (err) {
    showAlert("Error creating offer", "error");
    console.error(err);
  }
}

export async function handleSignal(from, data) {
  try {
    if (!peerConnection) startWebRTC(socket, roomId);

    switch (data.type) {
      case "offer":
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("signal", { roomId, data: answer });
        break;
      case "answer":
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
        break;
      case "ice":
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        break;
      default:
        console.warn("Unknown signal type:", data.type);
    }
  } catch (err) {
    showAlert("Error handling signal", "error");
    console.error(err);
  }
}

export function disconnect() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  toggleButtons(false);
  setStatus("Offline");
}
