const express = require("express");
const router = express.Router();
const Controller = require("../controllers/transaction");

router.get("/", Controller.getTransactions);
router.get("/:transactionId", Controller.getTransactionById);
router.put("/:transactionId", Controller.completeTransaction);

module.exports = router;
