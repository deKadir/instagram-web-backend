import express from "express";
import { accessUserDetails, loginCheck } from "./../middlewares/auth/access";
import {
  addPost,
  getPost,
  getUserPosts,
  postFeed,
} from "./../controllers/postController";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();
router.post("/upload", loginCheck, upload.array("photo", 6), addPost);
router.get("/userPosts/:userId", loginCheck, accessUserDetails, getUserPosts);
router.get("/postFeed/", loginCheck, postFeed);
router.get("/getPost/:id", loginCheck, getPost);
export default router;
