import { StatusCodes } from "http-status-codes";

import {
  createWorkspaceService,
  deleteWorkspaceService,
  getAllWorkspacesUserIsMemberOfService,
} from "../services/workspaceService.js";
import {
  errorReponse,
  internalServerErrror,
  successResponse,
} from "../utils/common/responseObject.js";

export const createWorkspace = async (req, res) => {
  try {
    console.log("USER", req.user);
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
    const response = await getAllWorkspacesUserIsMemberOfService(req.user);
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
