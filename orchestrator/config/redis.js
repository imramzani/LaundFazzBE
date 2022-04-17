if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const Redis = require("ioredis");

const redis = new Redis({
  port: 15247,
  host: `redis-15247.c295.ap-southeast-1-1.ec2.cloud.redislabs.com`,

  password: process.env.REDIS || "Lzy9FbhST4Av21ioLaufARXL5f95I4JS",
});

module.exports = redis;
