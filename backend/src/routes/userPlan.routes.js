import express from "express";
import * as UserPlanController from "../controller/userPlan.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, UserPlanController.getUserPlans);
router.delete("/cleanup", authenticate, UserPlanController.cleanupDuplicatePlans);

export default router;
