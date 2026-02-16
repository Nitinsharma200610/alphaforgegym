import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import errorHandler from "./middlewares/error-handler.middleware.js";
import http from "http";
import userRoutes from "./routes/user.routes.js";
import membershipRoutes from "./routes/membership.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import userPlanRoutes from "./routes/userPlan.routes.js";
import contactRoutes from "./routes/contact.routes.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const initApp = async () => {
  await connectDB();

  app.use(errorHandler);

  app.use("/api/users", userRoutes);
  app.use("/api/memberships", membershipRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/user-plans", userPlanRoutes);
  app.use("/api/contacts", contactRoutes);

  app.get("/", (req, res) => {
    res.json({ message: "Welcome to the AlphaForge Gym API!" });
  });
  http.createServer(app).listen(port, () => {
    console.log("Server is running on port", port);
  });
};
void initApp();
