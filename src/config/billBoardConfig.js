import { createBullBoard } from "@bull-board/api";
import { bullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";

import mailQueue from "../queues/mailQueue.js";

const bullServerAdapter = new ExpressAdapter();
bullServerAdapter.setBasePath("/ui");

createBullBoard({
  queues: [new bullAdapter(mailQueue)],
  serverAdapter: bullServerAdapter,
});

export default bullServerAdapter;
