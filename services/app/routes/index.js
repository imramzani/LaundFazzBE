const express = require("express");
const router = express.Router();
const customers = require("./customers");
const staffs = require("./staffs");
const products = require("./products");
// const axios = require("axios");
const xendit = require('./xendit')

router.use("/customers", customers);
router.use("/staffs", staffs);
router.use("/products", products);
router.use('/xendit', xendit)

module.exports = router;
