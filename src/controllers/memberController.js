import { StatusCodes } from "http-status-codes";

import { isMemberPartOfWorkspaceService } from "../services/memberService.js";
import {
  errorReponse,
  internalServerErrror,
  successResponse,
} from "../utils/common/responseObject.js";

export const isMemberPartOfWorkspaceController = async (req, res) => {
  try {
    const response = await isMemberPartOfWorkspaceService(
      req.params.workspaceId,
      req.user._id
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "User is part of workspace"));
  } catch (error) {
    console.log("Error from isMemberPartOfWorkspaceController", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};
