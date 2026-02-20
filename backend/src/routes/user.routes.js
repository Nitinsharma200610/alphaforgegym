import express from "express";
import * as UserController from "../controller/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/profile", authenticate, UserController.getProfile);
router.get("/me", authenticate, UserController.getCurrentUser);
router.get("/", UserController.getAllUsers);
router.get("/stats", authenticate, UserController.getAdminStats); // New route
router.put("/:userId/subscription", UserController.updateUserSubscription);

export default router;
