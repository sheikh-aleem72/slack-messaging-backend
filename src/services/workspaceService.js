import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

import { addMailToMailQueue } from "../producers/mailQueueProducer.js";
import { channelRepository } from "../repository/channelRepository.js";
import userRepository from "../repository/userRepository.js";
import workspaceRepository from "../repository/workspaceRepository.js";
import { workspaceJoinMail } from "../utils/common/mailObject.js";
import ClientError from "../utils/errors/clientError.js";
import ValidationError from "../utils/errors/validationError.js";

export const isUserAdminOfWorkspace = (workspace, userId) => {
  return workspace.members.find(
    (member) =>
      (member.memberId.toString() === userId ||
        member.memberId._id.toString() === userId) &&
      member.role === "admin"
  );
};

export const isUserMemberOfWorkspace = (workspace, userId) => {
  return workspace.members.find(
    (member) =>
      member.memberId.toString() === userId ||
      member.memberId._id.toString() === userId
  );
};

const isChannelAlreadyPartOfWorkspace = (workspace, channelName) => {
  return workspace.channels.find(
    (channel) => channel.name.toLowerCase() === channelName.toLowerCase()
  );
};

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
    console.log("Error from getAllWorkspacesUserIsMemberOfService:", error);
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

    const isAllowed = isUserAdminOfWorkspace(workspace, userId);

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

export const getWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: "No workspace is found with given details",
        message: "No workspace found",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        explanation: "User is not member of the workspace",
        message: "Unauthorized user",
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    return workspace;
  } catch (error) {
    console.log("Error from get workspace service: ", error);
    throw error;
  }
};

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceByJoinCode(joinCode);

    if (!workspace) {
      throw new ClientError({
        explanation: "No workspace is found with given details",
        message: "No workspace found",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        explanation: "User is not member of the workspace",
        message: "Unauthorized user",
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    return workspace;
  } catch (error) {
    console.log("Error from get workspace by join code service: ", error);
    throw error;
  }
};

export const updateWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: "No workspace is found with given details",
        message: "No workspace found",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: "User is not authorized to make changes",
        message: "Unauthorized User",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const response = await workspaceRepository.update(
      workspaceId,
      workspaceData
    );
    return response;
  } catch (error) {
    console.log("Error from update workspace service: ", error);
    throw error;
  }
};

export const resetWorkspaceJoinCode = async (workspaceId, userId) => {
  try {
    const newJoinCode = uuidv4().substring(0, 6).toUpperCase();
    const updatedWorkspace = await updateWorkspaceService(
      workspaceId,
      {
        joinCode: newJoinCode,
      },
      userId
    );

    return updatedWorkspace;
  } catch (error) {
    console.log("Error from reset workspace join code service: ", error);
    throw error;
  }
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  role,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: "No workspace is found with given details",
        message: "No workspace found",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: "User is not authorized to make changes",
        message: "Unauthorized User",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const isValidUser = await userRepository.getById(memberId);
    if (!isValidUser) {
      throw new ClientError({
        explanation: "Invalid data sent from the client",
        message: "User not found",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, memberId);
    if (isMember) {
      throw new ClientError({
        explanation: "User with this details already exists",
        message: "User already exists",
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const response = await workspaceRepository.addMembersToWorkspace(
      workspaceId,
      memberId,
      role
    );

    // addMailToMailQueue({
    //   ...workspaceJoinMail(workspace),
    //   to: isValidUser.email,
    // });

    return response;
  } catch (error) {
    console.log("Error from add member to workspace service", error);
    throw error;
  }
};

export const addChannelToWorkspaceService = async (
  workspaceId,
  channelName,
  userId
) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: "No workspace is found with given details",
        message: "No workspace found",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: "User is not authorized to make changes",
        message: "Unauthorized User",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const isChannelPartOfWorkspace = isChannelAlreadyPartOfWorkspace(
      workspace,
      channelName
    );

    if (isChannelPartOfWorkspace) {
      throw new ClientError({
        explanation: "Invalid data sent from the client",
        message: "Channel already part of workspace",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const response = await workspaceRepository.addChannelToWorkspace(
      workspaceId,
      channelName
    );
    return response;
  } catch (error) {
    console.log("Error from add channel to workspace service:", error);
    throw error;
  }
};

export const joinWorkspaceService = async (joinCode, workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: "No workspace is found with given details",
        message: "No workspace found",
        status: StatusCodes.NOT_FOUND,
      });
    }

    if (workspace.joinCode !== joinCode) {
      throw new ClientError({
        explanation: "Invalid data sent from the client",
        message: "Invalid join code",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (isMember) {
      throw new ClientError({
        explanation: "Invalid data sent from the client",
        message: "User is already part of the workspace",
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }
    const response = await workspaceRepository.addMembersToWorkspace(
      workspaceId,
      userId,
      "member"
    );

    return response;
  } catch (error) {
    console.log("Error from join workspace service", error);
    throw error;
  }
};

export const addMemberToWorkspaceUsingMailService = async (
  workspaceId,
  email,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: "No workspace is found with given details",
        message: "No workspace found",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: "User is not authorized to make changes",
        message: "Unauthorized User",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const isValidUser = await userRepository.getUserByEmail(email);
    if (!isValidUser) {
      throw new ClientError({
        explanation: "Invalid data sent from the client",
        message: "No user found with given email",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isMember = isUserMemberOfWorkspace(
      workspace,
      isValidUser._id.toString()
    );
    console.log("Is member part", isMember);
    if (isMember) {
      throw new ClientError({
        explanation: "User with this details already exists",
        message: "User already exists",
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const response = await workspaceRepository.addMemberToWorkspaceUsingMail(
      workspaceId,
      email,
      "member"
    );

    // addMailToMailQueue({
    //   ...workspaceJoinMail(workspace),
    //   to: isValidUser.email,
    // });

    return response;
  } catch (error) {
    console.log("Error from add member to workspace using mail service", error);
    throw error;
  }
};
