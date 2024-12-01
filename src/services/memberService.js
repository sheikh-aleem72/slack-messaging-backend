import { StatusCodes } from "http-status-codes";

import userRepository from "../repository/userRepository.js";
import workspaceRepository from "../repository/workspaceRepository.js";
import ClientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const isMemberPartOfWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        message: "No workspace found",
        explanation: "No workspace found with given details",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const isUserAMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isUserAMember) {
      throw new ClientError({
        message: "User is not part of workspace",
        explanation: "User is not a part of workspace",
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const user = await userRepository.getById(userId);
    return user;
  } catch (error) {
    console.log("Error from isMemberPartOfWorkspaceService");
    throw error;
  }
};
