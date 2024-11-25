import { StatusCodes } from "http-status-codes";

import { signinUserService, signUpService } from "../services/userService.js";
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
