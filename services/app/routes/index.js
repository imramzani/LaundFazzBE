const express = require("express");
const router = express.Router();
const customers = require("./customers");
const staffs = require("./staffs");
const products = require("./products");
const transactionProducts = require("./transactionProducts");
const axios = require("axios");

router.use("/customers", customers);
router.use("/staffs", staffs);
router.use("/products", products);
router.use("/transactionProducts", transactionProducts);
// router.get("/xendit-get", async (req, res, next) => {
//   try {
//     const { data } = await axios.post(
//       "https://api.xendit.co/v2/invoices",
//       {
//         external_id: "xendit-id-123",
//         amount: 1800000,
//         payer_email: "customer@domain.com",
//         description: "Invoice Demo #123",
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization:
//             "Basic eG5kX2RldmVsb3BtZW50XzFGRlNzdUF2QXFCaDAwWnJrdWc3ZGJHczY2VllZdjliYmhMb3VESjdYVmR4UWFTNndlYkoyME5iOFppVFZ6Szo=",
//         },
//       }
//     );
//     res.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//   }
// });
router.post("/xenditCallback", async (req, res, next) => {
  try {
    res.status(200).send("mantap");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
