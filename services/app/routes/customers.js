const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/customerAuthc");
const authorization = require("../middlewares/customerAuthz");
const Controller = require("../controllers/customers");
const transactions = require("./customerTransactions");

router.post("/register", Controller.register);
router.post("/login", Controller.login);

router.use(authentication);
router.get("/", authorization, Controller.profile);
// router.delete("/", authorization, Controller.deleteUser);
router.use("/transactions", transactions);

module.exports = router;
