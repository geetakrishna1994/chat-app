import express from "express";
import asyncHandler from "../utilities/async.js";
import * as authController from "../controllers/auth.js";
import verifyTokenMiddleware from "../middleware/token.js";
const router = express.Router();

router.post("/login", asyncHandler(authController.login));

router.post("/verify-otp", asyncHandler(authController.verifyOTP));

router.get("/new-token", authController.getNewToken);

export default router;
