const express = require("express");
const router = express.Router();
const Controller = require("../controllers/products");
const authentication = require("../middlewares/staffAuthc")

router.get("/", Controller.getProducts);
router.post("/", authentication, Controller.addProduct);
router.get("/:productId", Controller.getProductById);
router.put("/:productId", authentication, Controller.editProduct);
router.delete("/:productId", authentication, Controller.deleteProduct);

module.exports = router;