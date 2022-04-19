const express = require("express");
const router = express.Router();
const Controller = require("../controllers/transaction");

router.get("/", Controller.getCustTransactions);
router.post("/", Controller.addTransaction);
router.get("/:transactionId", Controller.getTransactionById);

module.exports = router;
