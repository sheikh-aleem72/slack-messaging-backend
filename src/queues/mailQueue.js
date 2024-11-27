import Queue from "bull";

import { REDIS_HOST, REDIS_PORT } from "../config/serverConfig.js";
import redisConfig from "../config/redisConfig.js";

export default new Queue("mailQueue", {
  redis: redisConfig,
});
