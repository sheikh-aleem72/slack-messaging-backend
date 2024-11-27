import express from "express";

import {
  addChannelToWorkspaceController,
  addMembersToWorkspaceController,
  createWorkspace,
  deleteWorkspace,
  getAllWorkspacesUserIsMemberOf,
  getWorkspaceByJoinCodeController,
  getWorkspaceController,
  updateWorkspaceController,
} from "../../controllers/workspaceController.js";
import { isAuthenticate } from "../../middlewares/authMiddleware.js";
import {
  addChannelToWorkspaceSchema,
  addMemberWorkspaceSchema,
  workspaceSchema,
} from "../../validators/workspaceSchema.js";
import { validate } from "../../validators/zodValidator.js";

const router = express.Router();

router.post("/", isAuthenticate, validate(workspaceSchema), createWorkspace);

router.get("/", isAuthenticate, getAllWorkspacesUserIsMemberOf);

router.delete("/:id", isAuthenticate, deleteWorkspace);

router.put("/:id", isAuthenticate, updateWorkspaceController);

router.put(
  "/:id/members",
  isAuthenticate,
  validate(addMemberWorkspaceSchema),
  addMembersToWorkspaceController
);

router.put(
  "/:workspaceId/channels",
  isAuthenticate,
  validate(addChannelToWorkspaceSchema),
  addChannelToWorkspaceController
);

router.get("/:id", isAuthenticate, getWorkspaceController);

router.get("/join/:joincode", isAuthenticate, getWorkspaceByJoinCodeController);

export default router;
