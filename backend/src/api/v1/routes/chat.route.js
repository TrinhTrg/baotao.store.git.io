const express = require("express");
const router = express.Router();

const controller = require("../controllers/chat.controller.js");
const userMiddleware = require("../middlewares/user.middleware.js");

router.get(
    "/conversations",
    userMiddleware.requireAuth,
    controller.getConversations
);

router.get(
    "/history/:otherUserId",
    userMiddleware.requireAuth,
    controller.getHistory
);

module.exports = router;
