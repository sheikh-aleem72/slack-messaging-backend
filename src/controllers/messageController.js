import { StatusCodes } from "http-status-codes";

import { s3 } from "../config/awsConfig.js";
import cloudinary from "../config/cloudinaryConfig.js";
import {
  AWS_BUCKET_NAME,
  CLOUDINARY_CLOUD_NAME,
} from "../config/serverConfig.js";
import {
  deleteMessageService,
  getMessageService,
  getPrivateMessageService,
} from "../services/messageService.js";
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

export const getPresignedUrlFromAWS = async (req, res) => {
  try {
    const url = await s3.getSignedUrlPromise("putObject", {
      Bucket: AWS_BUCKET_NAME,
      Key: `${Date.now()}`,
      Expires: 60, // 1 minute
    });
    return res
      .status(StatusCodes.OK)
      .json(successResponse(url, "Presigned URL generated successfully"));
  } catch (error) {
    console.log("Error in getPresignedUrlFromAWS", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const deleteMessageController = async (req, res) => {
  try {
    const response = await deleteMessageService(req.params.messageId);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Message Deleted Successfully"));
  } catch (error) {
    console.log("Error in delete message controller", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const getPrivateMessages = async (req, res) => {
  try {
    const messages = await getPrivateMessageService(
      {
        otherUserId: req.params.memberId,
        page: req.body.page,
        limit: req.body.limit,
      },
      req.user._id
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(messages, "Messages fetched successfully"));
  } catch (error) {
    console.log("Error in get private message controller", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const getPresignedUrlFromCloudinary = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const params = {
      timestamp,
      folder: "chat_images", // Optional: Store images in a folder
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    return res.json({
      uploadUrl,
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: params.folder,
    });
  } catch (error) {
    console.log("Error generating presigned URL:", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const deleteImageController = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // extract public ID from the URL
    const publicId = imageUrl.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(publicId);

    return res
      .status(StatusCodes.OK)
      .json(successResponse("Image deleted successfully"));
  } catch (error) {
    console.log("Error deleting image:", error);
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};
