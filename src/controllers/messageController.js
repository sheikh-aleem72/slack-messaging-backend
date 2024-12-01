import { StatusCodes } from "http-status-codes";

import { getMessageService } from "../services/messageService.js";
import {
  errorReponse,
  internalServerErrror,
  successResponse,
} from "../utils/common/responseObject.js";

export const getMessage = async (req, res) => {
  try {
    const messages = await getMessageService(
      {
        channelId: req.params.channelId,
        page: req.body.page,
        limit: req.body.limit,
      },
      req.user._id
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(messages, "Messages fetched successfully"));
  } catch (error) {
    console.log("Error from getMessageController", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};
