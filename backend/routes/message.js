import express from "express";
import asyncHandler from "../utilities/async.js";
import authMiddleware from "../middleware/token.js";
const router = express.Router();
import * as messageController from "../controllers/message.js";

router.post("/", authMiddleware, asyncHandler(messageController.createMessage));

export default router;
