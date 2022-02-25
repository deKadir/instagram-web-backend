import express from "express";
import { accessUserDetails, loginCheck } from "./../middlewares/auth/access";
import { addPost, getUserPosts } from "./../controllers/postController";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();
router.post("/upload", loginCheck, upload.array("photos", 6), addPost);
router.get("/userPosts/:userId", loginCheck, accessUserDetails, getUserPosts);

export default router;
