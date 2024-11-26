import Channel from "../schema/channel.js";
import crudRepository from "./crudRepository.js";

export const channelRepository = {
  ...crudRepository(Channel),
};
