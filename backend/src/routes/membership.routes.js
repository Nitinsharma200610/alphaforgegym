import express from "express";
import * as MembershipController from "../controller/membership.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, MembershipController.createMembership);
router.get("/", MembershipController.getAllMemberships);
router.post("/checkout", authenticate, MembershipController.checkoutMembership);
router.post(
  "/verify-session",
  authenticate,
  MembershipController.verifyCheckoutSession,
);
router.get("/:id", MembershipController.getMembershipById);
router.put("/:id", authenticate, MembershipController.updateMembership);
router.delete("/:id", authenticate, MembershipController.deleteMembership);

export default router;
