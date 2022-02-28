import path from "path";
import express from "express";
const router = express.Router();
import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import postRoute from "./postRoute.js";
router.use("/api/auth", authRoute);
router.use("/api/user", userRoute);
router.use("/api/post", postRoute);
router.get("/api/getImage/:img", (req, res) => {
  var __dirname = path.resolve();
  const { img } = req.params;
  res.sendFile(`./uploads/${img}`, {
    root: __dirname,
  });
});
export default router;
