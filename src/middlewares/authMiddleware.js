import { StatusCodes } from "http-status-codes";

import { checkIfUserExist } from "../services/userService.js";
import { verifyJWT } from "../utils/common/authUtil.js";
import { errorReponse } from "../utils/common/responseObject.js";

export const isAuthenticate = async (req, res, next) => {
  // Check if jwt token is passed in header
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      errorReponse({
        message: "No token provided",
        explanation: "Token is required",
      })
    );
  }

  // verify token
  try {
    const response = verifyJWT(token);
    if (!response) {
      return res.status(StatusCodes.FORBIDDEN).json(
        errorReponse({
          explanation: "The provided token is invalid",
          message: "Invalid token",
        })
      );
    }
    // Check if user still exists or not

    const user = await checkIfUserExist(response.email);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json(
        errorReponse({
          message: "User not found",
          explanation: `No user found with ${req.body.email} email`,
        })
      );
    }

    // add user property to the request which will contains email, username, and password
    req.user = response;

    // call the next middleware
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(StatusCodes.FORBIDDEN).json(
        errorReponse({
          message: "User not found",
          explanation: `No user found with ${req.body.email} email`,
        })
      );
    }
    return res.status(error.status).json(errorReponse(error));
  }
};
