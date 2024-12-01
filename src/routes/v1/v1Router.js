import express from "express";

import channelRouter from "./channel.js";
import memberRouter from "./members.js";
import messageRouter from "./messages.js";
import usersRouter from "./users.js";
import workspaceRouter from "./workspace.js";

const router = express.Router();

router.use("/users", usersRouter);

router.use("/workspace", workspaceRouter);

router.use("/channels", channelRouter);

router.use("/members", memberRouter);

router.use("/messages", messageRouter);

export default router;
