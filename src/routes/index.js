const express = require("express");
const authRoutes = require("./auth");
const contentRoutes = require("./content");

const Routes = express.Router();

Routes.use("/auth", authRoutes);
Routes.use("/content", contentRoutes);

module.exports = Routes;
