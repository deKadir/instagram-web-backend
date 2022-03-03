import express from "express";
import { addComment, getPostComments } from "../controllers/commentController";
import { loginCheck } from "../middlewares/auth/access";
import { likeComment } from "./../controllers/likeController";
const router = express.Router();

router.post("/add", loginCheck, addComment);
router.get("/comments/:id", loginCheck, getPostComments);
router.post("/likeComment/:id", loginCheck, likeComment);
export default router;
