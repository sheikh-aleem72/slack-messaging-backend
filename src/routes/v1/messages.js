import express from "express";

import {
  deleteImageController,
  deleteMessageController,
  getMessage,
  getPresignedUrlFromCloudinary,
  getPrivateMessages,
  // getPresignedUrlFromAWS,
} from "../../controllers/messageController.js";
import { isAuthenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/pre-signed-url", isAuthenticate, getPresignedUrlFromCloudinary); // For presigned url

router.get("/:channelId", isAuthenticate, getMessage);

router.get("/privateMessages/:memberId", isAuthenticate, getPrivateMessages);

router.delete("/delete-image", isAuthenticate, deleteImageController); // For presigned url

router.delete("/:messageId", isAuthenticate, deleteMessageController);

export default router;
