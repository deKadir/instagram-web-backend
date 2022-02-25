import express from "express";
const router = express.Router();
import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
router.use("/api/auth", authRoute);
router.use("/api/user", userRoute);
export default router;
