import { StatusCodes } from "http-status-codes";

import {
  addChannelToWorkspaceService,
  addMemberToWorkspaceService,
  createWorkspaceService,
  deleteWorkspaceService,
  getAllWorkspacesUserIsMemberOfService,
  getWorkspaceByJoinCodeService,
  getWorkspaceService,
  joinWorkspaceService,
  resetWorkspaceJoinCode,
  updateWorkspaceService,
} from "../services/workspaceService.js";
import {
  errorReponse,
  internalServerErrror,
  successResponse,
} from "../utils/common/responseObject.js";

export const createWorkspace = async (req, res) => {
  try {
    const response = await createWorkspaceService({
      name: req.body.name,
      description: req.body.description,
      userId: req.user._id,
    });

    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(response, "Workspace created succesfully"));
  } catch (error) {
    console.log("Error from workspace controller", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const getAllWorkspacesUserIsMemberOf = async (req, res) => {
  try {
    const response = await getAllWorkspacesUserIsMemberOfService(req.user._id);
    console.log("workspaces:", response);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "All workspaces fetched successfully"));
  } catch (error) {
    console.log("Error from workspace controller", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const deleteWorkspace = async (req, res) => {
  try {
    const response = await deleteWorkspaceService(req.params.id, req.user._id);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Workspace deleted successfully"));
  } catch (error) {
    console.log("Error from workspace controller", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const getWorkspaceController = async (req, res) => {
  try {
    const response = await getWorkspaceService(req.params.id, req.user._id);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Workspace fetched successfully"));
  } catch (error) {
    console.log("Error from workspace controller", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const getWorkspaceByJoinCodeController = async (req, res) => {
  try {
    const response = await getWorkspaceByJoinCodeService(
      req.params.joincode,
      req.user._id
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Workspace fetched successfully"));
  } catch (error) {
    console.log("Error from workspace controller", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const updateWorkspaceController = async (req, res) => {
  try {
    const response = await updateWorkspaceService(
      req.params.id,
      req.body,
      req.user._id
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Workspace updated successfully"));
  } catch (error) {
    console.log("Error from update workspace controller", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const addMembersToWorkspaceController = async (req, res) => {
  try {
    const response = await addMemberToWorkspaceService(
      req.params.id,
      req.body.memberId,
      req.body.role,
      req.user._id
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Member added successfully"));
  } catch (error) {
    console.log("Error from add member to workspace controller", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const addChannelToWorkspaceController = async (req, res) => {
  try {
    const response = await addChannelToWorkspaceService(
      req.params.workspaceId,
      req.body.channelName,
      req.user._id
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Channel added successfully"));
  } catch (error) {
    console.log("Error from add channel to workspace controller", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const resetWorkspaceJoinCodeController = async (req, res) => {
  try {
    const response = await resetWorkspaceJoinCode(
      req.params.workspaceId,
      req.user._id
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Workspace updated successfully"));
  } catch (error) {
    console.log("Error from update workspace joinCode controller", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const joinWorkspaceController = async (req, res) => {
  try {
    const response = await joinWorkspaceService(
      req.body.joinCode,
      req.params.workspaceId,
      req.user._id
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "You have been joined successfully"));
  } catch (error) {
    console.log("Error from join workspace controller", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};
