import express from "express";

import usersRouter from "./users.js";
import workspaceRouter from "./workspace.js";

const router = express.Router();

router.use("/users", usersRouter);

router.use("/workspace", workspaceRouter);

export default router;
