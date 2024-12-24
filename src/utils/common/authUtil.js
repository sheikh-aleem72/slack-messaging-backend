import jwt from "jsonwebtoken";

import { JWT_SECRET_KEY } from "../../config/serverConfig.js";

export const generateJwtToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: 30000,
  });
  return token;
};

export const verifyJWT = (token) => {
  try {
    // console.log("Token received for decoding:", token);
    // console.log("JWT_SECRET_KEY:", JWT_SECRET_KEY);

    // // Decode the token (structure verification, no signature validation)
    // const decoded = jwt.decode(token, { complete: true });
    // console.log("Decoded token:", decoded);

    // if (!decoded) {
    //   throw new Error("Failed to decode token. Token might be malformed.");
    // }

    // Verify the token (signature validation)
    const response = jwt.verify(token.trim(), JWT_SECRET_KEY.trim());
    console.log("Token successfully verified:", response);

    return response;
  } catch (error) {
    console.error("JWT verification error:", error.message);
    throw error; // Re-throw the error for the middleware to handle
  }
};
