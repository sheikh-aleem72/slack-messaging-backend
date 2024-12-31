import { StatusCodes } from "http-status-codes";

import { channelRepository } from "../repository/channelRepository.js";
import { messageRepository } from "../repository/messageRespository.js";
import { isUserMemberOfWorkspace } from "../services/workspaceService.js";
import ClientError from "../utils/errors/clientError.js";

export const getMessageService = async (messageParams, userId) => {
  try {
    const channelDetails =
      await channelRepository.getChannelWithWorkspaceDetails(
        messageParams.channelId
      );

    if (!channelDetails) {
      throw new ClientError({
        message: "Channel not found",
        explanation: "Invalid details sent from the client",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const workspace = channelDetails.workspaceId;

    const isMember = isUserMemberOfWorkspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        message: "User is not member of workspace",
        explanation: "User is not member of workspace",
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const messages =
      await messageRepository.getPaginatedMessages(messageParams);
    return messages;
  } catch (error) {
    console.log("Error from getMessageService:", error);
    throw error;
  }
};

export const createMessageService = async (data) => {
  const newMessage = await messageRepository.create(data);

  const message = await messageRepository.getMessageDetails(newMessage._id);
  return message;
};
