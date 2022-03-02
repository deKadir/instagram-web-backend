import express from "express";
import { loginCheck } from "./../middlewares/auth/access";
import {
  getPostLikes,
  getCommentLikes,
  likePost,
  likeComment,
} from "../controllers/likeController";
const router = express.Router();

router.get("/postLikes/:postId", loginCheck, getPostLikes);
router.get("/commentLikes/:commentId", loginCheck, getCommentLikes);
router.post("/likePost/:postId", loginCheck, likePost);
router.post("/likeComment/:commentId", loginCheck, likeComment);

export default router;
