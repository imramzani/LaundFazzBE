const express = require("express");
const router = express.Router();
const Controller = require("../controllers/transaction");
// const authorization = require("../middlewares/custTransactionAuthz");

router.get("/", Controller.getCustTransactions);
router.post("/", Controller.addTransaction);
router.get("/:transactionId", 
// authorization, 
Controller.getTransactionById);

module.exports = router;
