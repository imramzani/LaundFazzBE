const { verifyToken } = require("../helpers/jwt");
const { Staff } = require("../models");

let authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    const payload = verifyToken(access_token);

    const staff = await Staff.findByPk(payload.StaffId);
    // console.log(`MASUK AUTHC`);
    if (!staff) {
      throw {
        name: `staffAuthc Failed`,
      };
    }

    req.staff = {
      StaffId: staff.id,
      email: staff.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
