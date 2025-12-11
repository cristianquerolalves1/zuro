// ANSI colors
const colors = {
  Reset: "\x1b[0m",
  Blue: "\x1b[34m",
  Yellow: "\x1b[33m",
  Red: "\x1b[31m"
};

const useColors = process.stdout.isTTY;

/**
 * @param {string} color 
 * @param {string} label 
 * @param  {...any} args 
 */
function formatLog(color, label, ...args) {
  const timestamp = new Date().toISOString();
  if (useColors) {
    return [`${color}[${label} ${timestamp}]${colors.Reset}`, ...args];
  }
  return [`[${label} ${timestamp}]`, ...args];
}

function logInfo(...args) {
  console.log(...formatLog(colors.Blue, "INFO", ...args));
}

function logWarn(...args) {
  console.warn(...formatLog(colors.Yellow, "WARN", ...args));
}

function logError(...args) {
  console.error(...formatLog(colors.Red, "ERROR", ...args));
}

module.exports = { logInfo, logWarn, logError };
