import express from "express";
import * as ContactController from "../controller/contact.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route - anyone can submit a contact message
router.post("/", ContactController.createContact);

// SuperAdmin routes
router.get("/", authenticate, ContactController.getAllContacts);
router.put("/:id/read", authenticate, ContactController.markAsRead);
router.delete("/:id", authenticate, ContactController.deleteContact);

export default router;
