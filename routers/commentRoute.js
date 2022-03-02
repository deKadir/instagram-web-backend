import express from "express";
import { addComment, getPostComments } from "../controllers/commentController";
import { loginCheck } from "../middlewares/auth/access";
const router = express.Router();

router.post("/add", loginCheck, addComment);
router.get("/comments/:id", loginCheck, getPostComments);

export default router;
