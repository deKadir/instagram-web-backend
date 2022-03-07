import express from "express";
import {
  sendMessage,
  getMessages,
  getRooms,
} from "../controllers/chatController.js";
import { loginCheck } from "../middlewares/auth/access.js";
const router = express.Router();

router.post("/sendMessage", loginCheck, sendMessage);
router.get("/getMessages", loginCheck, getMessages);
router.get("/rooms", loginCheck, getRooms);
export default router;
