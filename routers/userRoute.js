import express from "express";

import {
  getCurrentUser,
  getUserInfo,
  getFollowers,
  follow,
  getFollowings,
  updateUserInfo,
  updateProfileImg,
} from "../controllers/userController.js";
import { accessUserDetails, loginCheck } from "../middlewares/auth/access.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();
router.get("/getUserInfo/:username", loginCheck, getUserInfo);
router.get("/getCurrentUser", loginCheck, getCurrentUser);
router.post("/follow/:userId", loginCheck, follow);
router.post("/edit", loginCheck, updateUserInfo);
router.get(
  "/getFollowers/:userId",
  loginCheck,
  accessUserDetails,
  getFollowers
);
router.get(
  "/getFollowings/:userId",
  loginCheck,
  accessUserDetails,
  getFollowings
);
router.post(
  "/updateProfileImg",
  loginCheck,
  upload.single("profileImg"),
  updateProfileImg
);

export default router;
