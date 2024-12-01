import express from "express";

import { getMessage } from "../../controllers/messageController.js";
import { isAuthenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:channelId", isAuthenticate, getMessage);

export default router;
