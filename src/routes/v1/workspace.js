import express from "express";

import {
  createWorkspace,
  deleteWorkspace,
  getAllWorkspacesUserIsMemberOf,
} from "../../controllers/workspaceController.js";
import { isAuthenticate } from "../../middlewares/authMiddleware.js";
import { workspaceSchema } from "../../validators/workspaceSchema.js";
import { validate } from "../../validators/zodValidator.js";

const router = express.Router();

router.post("/", isAuthenticate, validate(workspaceSchema), createWorkspace);

router.get("/", isAuthenticate, getAllWorkspacesUserIsMemberOf);

router.delete("/:id", isAuthenticate, deleteWorkspace);

export default router;
