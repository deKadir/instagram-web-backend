import express from "express";
import {
  sendMessage,
  getMessages,
  getRooms,
  getRoom,
} from "../controllers/chatController.js";
import { loginCheck, accessMessages } from "../middlewares/auth/access.js";
const router = express.Router();

router.post("/sendMessage", loginCheck, sendMessage);
router.get("/getMessages", loginCheck, accessMessages, getMessages);
router.get("/rooms", loginCheck, getRooms);
router.get("/getRoom", loginCheck, getRoom);
export default router;
