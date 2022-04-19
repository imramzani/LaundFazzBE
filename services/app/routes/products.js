const express = require("express");
const router = express.Router();
const Controller = require("../controllers/products");

router.get("/", Controller.getProducts);

module.exports = router;