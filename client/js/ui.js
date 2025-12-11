function setStatus(message) {
  const statusEl = document.getElementById("status");
  statusEl.textContent = message;
}

function toggleButtons(connected) {
  document.getElementById("startBtn").disabled = connected;
  document.getElementById("disconnectBtn").disabled = !connected;
}

function showAlert(message, type = "info") {
  const statusEl = document.getElementById("status");
  const alertDiv = document.createElement("div");
  alertDiv.textContent = message;
  alertDiv.className = type;
  statusEl.appendChild(alertDiv);
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

export { setStatus, toggleButtons, showAlert };
