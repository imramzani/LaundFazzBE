const express = require("express");
const router = express.Router();
const Controller = require("../controllers/transactionProducts");

router.get("/", Controller.getTransactionProducts);
router.post("/", Controller.addTransactionProduct);
router.get("/:TPId", Controller.getTransactionProductById);
router.delete("/:TPId", Controller.deleteTransactionProduct);

module.exports = router;