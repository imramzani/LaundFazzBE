const express = require("express");
const router = express.Router();
const customers = require("./customers");
const stores = require("./stores");

router.use("/customers", customers);
router.use("/stores", stores);

module.exports = router;