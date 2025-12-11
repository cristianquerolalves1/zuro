    // ANSI colors
    const colors = {
    Reset: "\x1b[0m",
    Blue: "\x1b[34m",
    Yellow: "\x1b[33m",
    Red: "\x1b[31m"
    };

    /**
     * @param  {...any} args
     */
    function logInfo(...args) {
    console.log(`${colors.Blue}[INFO ${new Date().toISOString()}]${colors.Reset}`, ...args);
    }

    /**
     * @param  {...any} args
     */
    function logWarn(...args) {
    console.warn(`${colors.Yellow}[WARN ${new Date().toISOString()}]${colors.Reset}`, ...args);
    }

    /**
     * @param  {...any} args
     */
    function logError(...args) {
    console.error(`${colors.Red}[ERROR ${new Date().toISOString()}]${colors.Reset}`, ...args);
    }

    module.exports = { logInfo, logWarn, logError };
