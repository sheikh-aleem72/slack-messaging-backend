import express from "express";

import {
  getMessage,
  getPresignedUrlFromAWS,
} from "../../controllers/messageController.js";
import { isAuthenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:channelId", isAuthenticate, getMessage);

// router.get('/pre-signed-url', isAuthenticate, getPresignedUrlFromAWS); // For presigned url

export default router;
