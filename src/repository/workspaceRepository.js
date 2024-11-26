import { StatusCodes } from "http-status-codes";

import User from "../schema/user.js";
import Workspace from "../schema/workspace.js";
import ClientError from "../utils/errors/clientError.js";
import { channelRepository } from "./channelRepository.js";
import crudRepository from "./crudRepository.js";

const workspaceRepository = {
  ...crudRepository(Workspace),

  getWorkspaceByName: async function (workspaceName) {
    const workspace = await Workspace.findOne({ name: workspaceName });
    if (!workspace) {
      throw new ClientError({
        explanation: "Invalid data send from the client",
        message: "Workspace not found",
        status: StatusCodes.NOT_FOUND,
      });
    }
    return workspace;
  },

  getWorkspaceByJoinCode: async function (joinCode) {
    const workspace = await Workspace.findOne({ joinCode });
    if (!workspace) {
      throw new ClientError({
        explanation: "Invalid data send from the client",
        message: "Workspace not found",
        status: StatusCodes.NOT_FOUND,
      });
    }
    return workspace;
  },

  addMembersToWorkspace: async function (workspaceId, memberId, role) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: "Invalid data send from the client",
        message: "Workspace not found",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const isValidMember = await User.findById(memberId);
    if (!isValidMember) {
      throw new ClientError({
        explanation: "Invalid data send from the client",
        message: "User not found",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const isMemberAlreadyPartOfWorkspace = workspace.members.find(
      (member) => member.memberId === memberId
    );
    if (isMemberAlreadyPartOfWorkspace) {
      throw new ClientError({
        explanation: "Invalid data send from the client",
        message: "User is already member of workspace",
        status: StatusCodes.FORBIDDEN,
      });
    }

    workspace.members.push({
      memberId,
      role,
    });
    await workspace.save();
  },

  addChannelToWorkspace: async function (workspaceId, channelName) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: "Invalid data send from the client",
        message: "Workspace not found",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const isChannelAlreadyPartOfWorkspace = workspace.channels.find(
      (channel) => channel.name === channelName
    );
    if (isChannelAlreadyPartOfWorkspace) {
      throw new ClientError({
        explanation: "Invalid data send from the client",
        message: "Channel is already member of workspace",
        status: StatusCodes.FORBIDDEN,
      });
    }

    const channel = await channelRepository.create({
      name: channelName,
      workspaceId: workspaceId,
    });

    workspace.channels.push(channel);
    await workspace.save();

    return workspace;
  },

  fetchAllWorkspaceByMemberId: async function (memberId) {
    const workspaces = await Workspace.find({
      "members.memberId": memberId,
    }).populate("members.memberId", "username email avatar");

    if (!workspaces) {
      throw new ClientError({
        explanation: "Invalid data send from the client",
        message: "No workspaces found",
        status: StatusCodes.NOT_FOUND,
      });
    }

    return workspaces;
  },
};

export default workspaceRepository;
