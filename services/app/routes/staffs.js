const express = require("express");
const router = express.Router();
const Controller = require("../controllers/staffs");
const authorization = require("../middlewares/staffAuthz");
const authentication = require("../middlewares/staffAuthc");
const transactions = require("./staffTransactions");

router.post("/register", Controller.register);
router.post("/login", Controller.login);
router.get("/:staffId", Controller.profile);

router.use(authentication);
// router.delete("/", authorization, Controller.deleteStore);
router.patch("/", Controller.patchStaff);
router.use("/transactions", transactions);

module.exports = router;