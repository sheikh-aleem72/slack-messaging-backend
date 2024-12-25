import { StatusCodes } from "http-status-codes";

import {
  signinUserService,
  signUpService,
  verifyTokenService,
} from "../services/userService.js";
import {
  errorReponse,
  internalServerErrror,
  successResponse,
} from "../utils/common/responseObject.js";

export const signUp = async (req, res) => {
  try {
    const user = await signUpService(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(user, "User created successfully"));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(errorReponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const signIn = async (req, res) => {
  try {
    const response = await signinUserService(req.body);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "User signed in successfully"));
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(errorReponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrror(error));
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const response = await verifyTokenService(req.params.token);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "Email verified successfully"));
  } catch (error) {
    console.log("verify email controller error", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
