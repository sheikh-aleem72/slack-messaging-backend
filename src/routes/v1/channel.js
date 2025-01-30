import express from "express";

import {
  getChannelByIdController,
  updateChannelController,
  deleteChannelController,
} from "../../controllers/channelController.js";
import { isAuthenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:channelId", isAuthenticate, getChannelByIdController);

router.put("/:channelId", isAuthenticate, updateChannelController);

router.delete("/:channelId", isAuthenticate, deleteChannelController);

export default router;
