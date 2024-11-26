import { v4 as uuidv4 } from "uuid";

import workspaceRepository from "../repository/workspaceRepository.js";
import ValidationError from "../utils/errors/validationError.js";
import ClientError from "../utils/errors/clientError.js";
import { channelRepository } from "../repository/channelRepository.js";
import { StatusCodes } from "http-status-codes";

export const createWorkspaceService = async (workspaceDetails) => {
  try {
    const joinCode = uuidv4().substring(0, 6).toUpperCase();
    const response = await workspaceRepository.create({
      ...workspaceDetails,
      joinCode,
    });
    await workspaceRepository.addMembersToWorkspace(
      response._id,
      workspaceDetails.userId,
      "admin"
    );

    const newWorkspace = await workspaceRepository.addChannelToWorkspace(
      response._id.toHexString(),
      "General"
    );
    console.log("Workspace: ", newWorkspace);
    return newWorkspace;
  } catch (error) {
    console.log("Error from workspace service", error);
    if (error.name === "ValidationError") {
      throw new ValidationError(
        {
          error: error.errors,
        },
        error.message
      );
    }
    if (error.name === "MongoServerError" && error.code === 11000) {
      throw new ValidationError(
        {
          error: ["A workspace with same details already exists"],
        },
        "A workspace with same details already exists"
      );
    }
  }
};

export const getAllWorkspacesUserIsMemberOfService = async (userId) => {
  try {
    const workspaces =
      await workspaceRepository.fetchAllWorkspaceByMemberId(userId);
    return workspaces;
  } catch (error) {
    console.log("Error from workspace service", error);
    throw error;
  }
};

export const deleteWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: "No workspace is found with given details",
        message: "No workspace found",
        status: StatusCodes.NOT_FOUND,
      });
    }

    console.log(workspace.members);
    const isAllowed = workspace.members.find(
      (member) =>
        member.memberId.toString() === userId && member.role === "admin"
    );

    if (isAllowed) {
      await channelRepository.deleteMany(workspace.channels);

      const response = await workspaceRepository.delete(workspaceId);
      return response;
    }

    throw new ClientError({
      explanation: "User is either not a member or an admin of the workspace",
      message: "User is not allowed to delete this workspace",
      status: StatusCodes.UNAUTHORIZED,
    });
  } catch (error) {
    console.log("Error from workspace service: ", error);
    throw error;
  }
};
