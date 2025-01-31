import express from "express";

import {
  addChannelToWorkspaceController,
  addMembersToWorkspaceController,
  addMemberToWorkspaceUsingMailController,
  createWorkspace,
  deleteWorkspace,
  getAllWorkspacesUserIsMemberOf,
  getWorkspaceByJoinCodeController,
  getWorkspaceController,
  joinWorkspaceController,
  resetWorkspaceJoinCodeController,
  updateWorkspaceController,
} from "../../controllers/workspaceController.js";
import { isAuthenticate } from "../../middlewares/authMiddleware.js";
import {
  addChannelToWorkspaceSchema,
  addMemberUsingMailSchema,
  addMemberWorkspaceSchema,
  workspaceSchema,
} from "../../validators/workspaceSchema.js";
import { validate } from "../../validators/zodValidator.js";

const router = express.Router();

router.post("/", isAuthenticate, validate(workspaceSchema), createWorkspace);

router.get("/", isAuthenticate, getAllWorkspacesUserIsMemberOf);

router.delete("/:id", isAuthenticate, deleteWorkspace);

router.put("/:workspaceId/join", isAuthenticate, joinWorkspaceController);

router.put("/:id", isAuthenticate, updateWorkspaceController);

router.put(
  "/:id/members",
  isAuthenticate,
  validate(addMemberWorkspaceSchema),
  addMembersToWorkspaceController
);

router.put(
  "/:id/addMembers",
  isAuthenticate,
  validate(addMemberUsingMailSchema),
  addMemberToWorkspaceUsingMailController
);

router.put(
  "/:workspaceId/channels",
  isAuthenticate,
  validate(addChannelToWorkspaceSchema),
  addChannelToWorkspaceController
);

router.put(
  "/:workspaceId/joinCode/reset",
  isAuthenticate,
  resetWorkspaceJoinCodeController
);

router.get("/:id", isAuthenticate, getWorkspaceController);

router.get("/join/:joincode", isAuthenticate, getWorkspaceByJoinCodeController);

export default router;
