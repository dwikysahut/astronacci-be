const express = require("express");
const contentController = require("../controllers/content");
const { authentication } = require("../middleware/authMiddleware");
const { limitAccessByMembership } = require("../middleware/limitMiddleware");

const Route = express.Router();

Route.get("/", authentication, limitAccessByMembership, contentController.getContent);

module.exports = Route;
