const express = require("express");
const router = express.Router();
const Controller = require("../controllers/products");

router.get("/", Controller.getProducts);
router.post("/", Controller.addProduct);
router.get("/:productId", Controller.getProductById);
router.put("/:productId", Controller.editProduct);
router.delete("/:productId", Controller.deleteProduct);

module.exports = router;