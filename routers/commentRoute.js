import express from "express";
import {
  addComment,
  getPostComments,
} from "../controllers/commentController.js";
import { loginCheck } from "../middlewares/auth/access.js";
import { likeComment } from "./../controllers/likeController.js";
const router = express.Router();

router.post("/add", loginCheck, addComment);
router.get("/comments/:id", loginCheck, getPostComments);
router.post("/likeComment/:id", loginCheck, likeComment);
export default router;
