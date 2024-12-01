import express from "express";

import { isMemberPartOfWorkspaceController } from "../../controllers/memberController.js";
import { isAuthenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/workspace/:workspaceId",
  isAuthenticate,
  isMemberPartOfWorkspaceController
);

export default router;
