import { StatusCodes } from "http-status-codes";

import {
  getChannelByIdService,
  updateChannelService,
} from "../services/channelService.js";
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

export const updateChannelController = async (req, res) => {
  try {
    const response = await updateChannelService(
      req.params.channelId,
      req.body,
      req.user._id
    );
    res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Channel updated successfully"));
    return;
  } catch (error) {
    console.log("Error from update channel controller", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};
