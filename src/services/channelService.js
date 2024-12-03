import { StatusCodes } from "http-status-codes";

import { channelRepository } from "../repository/channelRepository.js";
import { messageRepository } from "../repository/messageRespository.js";
import ClientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getChannelByIdService = async (channelId, userId) => {
  try {
    const channel =
      await channelRepository.getChannelWithWorkspaceDetails(channelId);
    if (!channel) {
      throw new ClientError({
        message: "No channel found",
        explanation:
          "Invalid details send by user. No channel found with given details",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const userPartOfWorkspace = isUserMemberOfWorkspace(
      channel.workspaceId,
      userId
    );

    if (!userPartOfWorkspace) {
      throw new ClientError({
        message: "Not part of workspace",
        explanation:
          "User is not part of workspace and hence not cannot access channel",
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const messages = await messageRepository.getPaginatedMessages({
      channelId,
      page: 1,
      limit: 20,
    });

    return {
      messages,
      _id: channel._id,
      name: channel.name,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
      workspaceId: channel.workspaceId,
    };
  } catch (error) {
    console.log("Error from getChannelByIdService", error);
    throw error;
  }
};
