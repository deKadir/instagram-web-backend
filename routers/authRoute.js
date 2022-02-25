import express from "express";
import { login, register } from "../controllers/Auth";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/login", (req, res, next) => {
  res.status(200).json({
    message: "hello world",
  });
});
export default router;
