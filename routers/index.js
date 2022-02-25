import express from "express";
const router = express.Router();
import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import postRoute from "./postRoute.js";
router.use("/api/auth", authRoute);
router.use("/api/user", userRoute);
router.use("/api/post", postRoute);
export default router;
