function errorHandler(err, req, res, next) {
  console.log(err.name, err, "ERROR HANDLER");

  let errors = [];
  switch (err.name) {
    case "SequelizeValidationError":
      err.errors.forEach((e) => {
        errors.push(e.message);
      });
      res.status(400).json({ Error: errors });
      errors = [];
      break;
    case "SequelizeUniqueConstraintError":
      err.errors.forEach((e) => {
        errors.push(e.message);
      });
      res.status(400).json({ Error: errors });
      errors = [];
      break;
    case "JsonWebTokenError":
      res.status(401).json({ Error: "Invalid token" });
      break;
    case "TokenExpiredError":
      res.status(401).json({ Error: "Token expired" });
      break;
    case "customerAuthc Failed":
      res.status(401).json({ Error: "Invalid token or customer" });
      break;
    case "staffAuthc Failed":
      res.status(401).json({ Error: "Invalid token or staff" });
      break;
    case "staffAuthz Failed":
      res.status(403).json({ Error: "Forbidden to modify or read item" });
      break;
    case "customerAuthz Failed":
      res.status(403).json({ Error: "Forbidden to modify or read item" });
      break;
    case "custTransactionAuthz Failed":
      res.status(403).json({ Error: "Forbidden to modify or read item" });
      break;
    case "customerNotFound":
      res.status(404).json({ Error: "Customer not found" });
      break;
    case "staffNotFound":
      res.status(404).json({ Error: "Staff not found" });
      break;
    case "transactionProductNotFound":
      res.status(404).json({ Error: "Transaction Product not found" });
      break;
    case "productNotFound":
      res.status(404).json({ Error: "Product not found" });
      break;
    case "transactionNotFound":
      res.status(404).json({ Error: "Transaction not found" });
      break;
    case "custLogin Failed":
      res.status(401).json({ Error: "Wrong customer email or password" });
      break;
    case "custLogin noInput":
      res.status(401).json({ Error: "Email and Password is required" });
      break;
    case "staffLogin Failed":
      res.status(401).json({ Error: "Wrong staff email or password" });
      break;
    case "staffLogin noInput":
      res.status(401).json({ Error: "Email and Password is required" });
      break;
    default:
      res.status(500).json({ Error: "Internal server error" });
      break;
  }
}

module.exports = errorHandler;
