import { StatusCodes } from "http-status-codes";

import { checkIfUserExist } from "../services/userService.js";
import { errorReponse } from "../utils/common/responseObject.js";
import { verifyJWT } from "../utils/jwt.js";

export const isAuthenticate = async (req, res, next) => {
  // Check if jwt token is passed in header
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      errorReponse({
        message: "Token is required",
        explanation: "",
      })
    );
  }

  // verify token
  try {
    const response = verifyJWT(token);

    // Check if user still exists or not
    const user = await checkIfUserExist(req.body.email);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json(
        errorReponse({
          message: "User not found",
          explanation: "",
        })
      );
    }

    // add user property to the request which will contains email, username, and password
    req.user = response;

    // call the next middleware
    next();
  } catch (error) {
    return res.status(error.status).json(errorReponse(error));
  }
};
