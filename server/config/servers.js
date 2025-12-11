const TURN_USERNAME = process.env.TURN_USERNAME || "user";
const TURN_CREDENTIAL = process.env.TURN_CREDENTIAL || "password";

const iceServers = {
  iceServers: [

    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },

    {
      urls: "turn:turn.yourdomain.com:3478", 
      username: TURN_USERNAME,
      credential: TURN_CREDENTIAL,
    },
  ],
  iceCandidatePoolSize: 10, 
};

module.exports = { iceServers };
