const express = require("express");
const authController = require("../controllers/auth");
const { authentication } = require("../middleware/authMiddleware");

const Route = express.Router();

Route.post("/login", authController.login)
  .post("/register", authController.register)
  .get("/me", authController.fetchMe)

  .post("/login-google", authController.loginGoogle)
  .post("/login-facebook", authController.loginFacebook)

  .post("/logout", authController.logout);

module.exports = Route;
