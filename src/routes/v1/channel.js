import express from "express";

import {
  getChannelByIdController,
  updateChannelController,
} from "../../controllers/channelController.js";
import { isAuthenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:channelId", isAuthenticate, getChannelByIdController);

router.put("/:channelId", isAuthenticate, updateChannelController);

export default router;
