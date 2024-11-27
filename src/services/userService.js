import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";

import userRepository from "../repository/userRepository.js";
import { generateJwtToken } from "../utils/common/authUtil.js";
import ClientError from "../utils/errors/clientError.js";
import ValidationError from "../utils/errors/validationError.js";

export const signUpService = async (user) => {
  try {
    const newUser = await userRepository.create(user);
    return newUser;
  } catch (error) {
    console.log("singUp error", error);
    if (error.name === "ValidationError") {
      throw new ValidationError(
        {
          error: error.errors,
        },
        error.message
      );
    }
    if (error.name === "MongoServerError" && error.code === 11000) {
      throw new ValidationError(
        {
          error: ["A user with same username or email already exists"],
        },
        "A user with same username or email already exists"
      );
    }
  }
};

export const signinUserService = async (userDetails) => {
  // Check if user exists
  const user = await userRepository.getUserByEmail(userDetails.email);

  if (!user) {
    throw new ClientError({
      explanation: "Invalid details send from the client",
      message: "No registered user found with this email",
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  // Check if password is valid
  const isValidPassword = bcrypt.compareSync(
    userDetails.password,
    user.password
  );
  if (!isValidPassword) {
    throw new ClientError({
      explanation: "Invalid details send from the client",
      message: "Password does not match",
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  // Generate JWT token
  const token = generateJwtToken({
    email: user.email,
    username: user.username,
    _id: user._id,
  });

  // Return token
  return {
    username: user.username,
    email: user.email,
    id: user._id,
    avatar: user.avatar,
    token: token,
  };
};

export const checkIfUserExist = async (id) => {
  const user = await userRepository.getById(id);
  return user;
};
