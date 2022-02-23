import express from "express";
const router = express.Router();
import authRoute from "./authRoute.js";

router.use("/api", authRoute);

export default router;
