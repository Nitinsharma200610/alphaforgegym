import express from "express";
import { calculateBMI } from "../controller/bmiController.js";

const router = express.Router();

router.post("/", calculateBMI);

export default router;