import crudRepository from "../repository/crudRepository.js";
import Message from "../schema/message.js";

export const messageRepository = {
  ...crudRepository(Message),
  getPaginatedMessages: async function (messageParams) {
    const messages = await Message.find({ channelId: messageParams.channelId })
      .sort({ createdAt: 1 })
      .skip((messageParams.page - 1) * messageParams.limit)
      .limit(messageParams.limit)
      .populate("senderId", "username email avatar");
    return messages;
  },
  getMessageDetails: async function (messageId) {
    const message = await Message.findById(messageId).populate(
      "senderId",
      "username email avatar"
    );
    return message;
  },
};
