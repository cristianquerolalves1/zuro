    const TURN_USERNAME = process.env.TURN_USERNAME || "user";
    const TURN_CREDENTIAL = process.env.TURN_CREDENTIAL || "password";

    const iceServers = [
    // STUN público de Google
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },


    {
        urls: "turn:turn.yourdomain.com:3478", // Cambia por tu servidor TURN
        username: TURN_USERNAME,
        credential: TURN_CREDENTIAL
    }
    ];

    module.exports = { iceServers };
