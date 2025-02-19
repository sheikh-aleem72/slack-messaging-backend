import express from "express";

import {
  deleteMessageController,
  getMessage,
  getPrivateMessages,
  // getPresignedUrlFromAWS,
} from "../../controllers/messageController.js";
import { isAuthenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:channelId", isAuthenticate, getMessage);

router.get("/:privateChatId", isAuthenticate, getPrivateMessages);

// router.get('/pre-signed-url', isAuthenticate, getPresignedUrlFromAWS); // For presigned url

router.delete("/:messageId", isAuthenticate, deleteMessageController);

export default router;
