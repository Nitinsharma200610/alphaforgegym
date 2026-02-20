import express from "express";
import { handleStripeWebhook } from "../controller/webhook.controller.js";

const router = express.Router();

// Stripe webhook - This must be raw body, not JSON parsed
router.post("/stripe", handleStripeWebhook);

export default router;
