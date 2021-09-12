import express from "express";
import authMiddleware from "../middleware/token.js";
import asyncHandler from "../utilities/async.js";
import * as conversationController from "../controllers/conversation.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  asyncHandler(conversationController.createConversation)
);

export default router;
