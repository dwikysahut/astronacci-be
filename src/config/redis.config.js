const Redis = require("ioredis");

const redis = new Redis({
  host: "127.0.0.1", // or your Redis server address
  port: 6379, // default Redis port
  password: "", // add password if needed
});

redis.on("connect", () => console.log("Redis connected!"));
redis.on("error", (err) => console.error("Redis error:", err));

module.exports = redis;
