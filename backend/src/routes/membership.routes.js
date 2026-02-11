import express from "express";
import * as MembershipController from "../controller/membership.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", MembershipController.createMembership);
router.get("/", MembershipController.getAllMemberships);
router.post("/checkout", MembershipController.checkoutMembership);
router.post(
  "/verify-session",
  authenticate,
  MembershipController.verifyCheckoutSession,
);
router.get("/:id", MembershipController.getMembershipById);
router.put("/:id", MembershipController.updateMembership);
router.delete("/:id", MembershipController.deleteMembership);

export default router;
