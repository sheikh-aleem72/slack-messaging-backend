import { StatusCodes } from "http-status-codes";

import { getChannelByIdService } from "../services/channelService.js";
import {
  errorReponse,
  internalServerErrror,
  successResponse,
} from "../utils/common/responseObject.js";

export const getChannelByIdController = async (req, res) => {
  try {
    const response = await getChannelByIdService(
      req.params.channelId,
      req.user._id
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Channel fetched successfully"));
  } catch (error) {
    console.log("Error from getChannelByIdController", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};
