const express = require("express");
const router = express.Router();
const Controller = require("../controllers/xendit");

router.post("/", Controller.postXendit);

module.exports = router;