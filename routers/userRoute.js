import express from "express";
import {
  getCurrentUser,
  getUserInfo,
  getFollowers,
  follow,
  getFollowings,
} from "../controllers/UserController";
import { loginCheck } from "../middlewares/auth/access";
import { updateUserInfo } from "./../controllers/userController";

const router = express.Router();

router.get("/getUserInfo/:id", getUserInfo);
router.get("/getCurrentUser", loginCheck, getCurrentUser);
router.post("/follow", loginCheck, follow);
router.post("/edit", loginCheck, updateUserInfo);
router.get("/getFollowers/:id", loginCheck, getFollowers);
router.get("/getFollowings/:id", loginCheck, getFollowings);

export default router;
