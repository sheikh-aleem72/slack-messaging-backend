import express from "express";

import channelRouter from "./channel.js";
import usersRouter from "./users.js";
import workspaceRouter from "./workspace.js";

const router = express.Router();

router.use("/users", usersRouter);

router.use("/workspace", workspaceRouter);

router.use("/channels", channelRouter);

export default router;
