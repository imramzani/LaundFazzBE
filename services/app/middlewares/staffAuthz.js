// const { Staff } = require("../models");

// const authorization = async (req, res, next) => {
//   try {
//     const { StaffId } = req.store;

//     const auth = await Staff.findByPk(StaffId);
//     if (!auth) {
//       throw { name: "staffAuthz Failed" };
//     }

//     if (auth.id !== StaffId) {
//       throw { name: "staffAuthz Failed" }
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = authorization;
