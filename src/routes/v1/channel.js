import express from "express";

import { getChannelByIdController } from "../../controllers/channelController.js";
import { isAuthenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:channelId", isAuthenticate, getChannelByIdController);

export default router;
