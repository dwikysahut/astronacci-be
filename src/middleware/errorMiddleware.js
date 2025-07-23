const helpers = require("../helpers");
const { CustomErrorAPI } = require("../helpers/CustomError");
const connection = require("../config/db.config");

module.exports = {
  errorMiddleware: async (error, req, res, _) => {
    if (error instanceof CustomErrorAPI) {
      return helpers.response(res, error.statusCode, error.message);
    }
    console.log(error);
    return helpers.response(res, 500, `Internal Server Error,${error.message}`);
  },
};
