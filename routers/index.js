import path from "path";
import express from "express";
import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import postRoute from "./postRoute.js";
import likeRoute from "./likeRoute.js";
import commentRoute from "./commentRoute.js";
import chatRoute from "./chatRoute.js";
const router = express.Router();
router.use("/api/auth", authRoute);
router.use("/api/user", userRoute);
router.use("/api/post", postRoute);
router.use("/api/comment", commentRoute);
router.use("/api/like", likeRoute);
router.use("/api/chat", chatRoute);
router.get("/api/getImage/:img", async (req, res) => {
  var __dirname = path.resolve();

  const { img } = req.params;

  res.sendFile(`./uploads/${img}`, {
    root: __dirname,
  });
});
export default router;
