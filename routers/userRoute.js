import express from "express";

import {
  getCurrentUser,
  getUserInfo,
  getFollowers,
  follow,
  getFollowings,
  updateUserInfo,
} from "../controllers/UserController";
import { accessUserDetails, loginCheck } from "../middlewares/auth/access";
const router = express.Router();
router.get("/getUserInfo/:username", getUserInfo);
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

export default router;
