const express = require("express");
const router = express.Router();
const Controller = require("../controllers/staffs");
const authentication = require("../middlewares/staffAuthc");
const transactions = require("./staffTransactions");

router.post("/register", Controller.register);
router.post("/login", Controller.login);

router.patch("/", authentication, Controller.patchStaff);
router.use("/transactions",authentication, transactions);
router.get("/:staffId", Controller.profile);


module.exports = router;