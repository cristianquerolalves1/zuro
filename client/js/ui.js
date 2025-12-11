function setStatus(message) {
  const statusEl = document.getElementById("status");
  if (!statusEl) {
    console.warn("Status element not found");
    return;
  }
  statusEl.textContent = message;
}

function toggleButtons(connected) {
  const startBtn = document.getElementById("startBtn");
  const disconnectBtn = document.getElementById("disconnectBtn");

  if (!startBtn || !disconnectBtn) {
    console.warn("Button elements not found");
    return;
  }

  startBtn.disabled = connected;
  disconnectBtn.disabled = !connected;
}

function showAlert(message, type = "info") {
  const statusEl = document.getElementById("status");
  if (!statusEl) {
    console.warn("Status element not found");
    return;
  }

  const alertDiv = document.createElement("div");
  alertDiv.textContent = message;
  alertDiv.className = `alert ${type}`; 
  statusEl.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

export { setStatus, toggleButtons, showAlert };