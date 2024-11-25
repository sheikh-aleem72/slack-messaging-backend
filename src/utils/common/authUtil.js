import jwt from "jsonwebtoken";

import { JWT_SECRET_KEY } from "../../config/serverConfig.js";

export const generateJwtToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET_KEY);
  return token;
};

export const verifyJWT = (token) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};
