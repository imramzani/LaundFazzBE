const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/customerAuthc");
const Controller = require("../controllers/customers");
const transactions = require("./customerTransactions");

router.post("/register", Controller.register);
router.post("/login", Controller.login);

router.use(authentication);

router.get("/", Controller.profile);;
router.use("/transactions", transactions);

module.exports = router;
