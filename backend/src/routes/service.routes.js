import express from "express";
import * as ServiceController from "../controller/service.controller.js";

const router = express.Router();

router.post("/", ServiceController.createService);
router.get("/", ServiceController.getAllServices);
router.get("/:id", ServiceController.getServiceById);
router.put("/:id", ServiceController.updateService);
router.delete("/:id", ServiceController.deleteService);

export default router;
