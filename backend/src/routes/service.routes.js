import express from "express";
import * as ServiceController from "../controller/service.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, ServiceController.createService);
router.get("/", ServiceController.getAllServices);
router.get("/:id", ServiceController.getServiceById);
router.put("/:id", authenticate, ServiceController.updateService);
router.delete("/:id", authenticate, ServiceController.deleteService);

export default router;
