import { StatusCodes } from "http-status-codes";

import { channelRepository } from "../repository/channelRepository.js";
import { messageRepository } from "../repository/messageRespository.js";
import ClientError from "../utils/errors/clientError.js";
import {
  isUserAdminOfWorkspace,
  isUserMemberOfWorkspace,
} from "./workspaceService.js";

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

export const updateChannelService = async (
  channelId,
  updateDetails,
  userId
) => {
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

    const userIsAdmin = isUserAdminOfWorkspace(channel.workspaceId, userId);
    if (!userIsAdmin) {
      throw new ClientError({
        message: "Not authorized",
        explanation:
          "User is not authorized to update channel details. Only admin can update channel details",
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const updatedChannel = await channelRepository.update(
      channelId,
      updateDetails
    );
    return updatedChannel;
  } catch (error) {
    console.log(
      "Error while updating channel from update channel service: ",
      error
    );
    throw error;
  }
};

export const deleteChannelService = async (channelId, userId) => {
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

    const userIsAdmin = isUserAdminOfWorkspace(channel.workspaceId, userId);
    if (!userIsAdmin) {
      throw new ClientError({
        message: "Not authorized",
        explanation:
          "User is not authorized to delete channel. Only admin can delete a channel",
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const response = await channelRepository.delete(channelId);
    return response;
  } catch (error) {
    console.log(
      "Error while deleting channel from update channel service: ",
      error
    );
    throw error;
  }
};
