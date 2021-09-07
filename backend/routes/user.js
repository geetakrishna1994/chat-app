import express from "express";
import tokenMiddleware from "../middleware/token.js";
import * as userController from "../controllers/user.js";
import asyncHandler from "../utilities/async.js";

const router = express.Router();

router.get("/", tokenMiddleware, asyncHandler(userController.getUserDetails));

router.get("/:phoneNumber", asyncHandler(userController.getUserByPhoneNumber));

router.get("/conversations", asyncHandler(userController.getAllConversations));

export default router;
