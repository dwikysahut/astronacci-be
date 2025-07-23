const connection = require("../config/db.config");

module.exports = {
  promiseHandler:
    (fn, transaction = false) =>
    async (req, res, next) => {
      if (transaction) {
        try {
          await fn(req, res, next);
        } catch (error) {
          console.log(error);
          next(error);
        }
      } else {
        try {
          await fn(req, res, next);
        } catch (error) {
          next(error);
        }
      }
    },
};
