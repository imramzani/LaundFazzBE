if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const Redis = require("ioredis");

const redis = new Redis({
  port: 15571,
  host: "redis-15571.c1.ap-southeast-1-1.ec2.cloud.redislabs.com",
  password: process.env.REDIS || "y49TehEYyyKNEeDORAxVZ2q6Gezf36Yi",
});

module.exports = redis;
