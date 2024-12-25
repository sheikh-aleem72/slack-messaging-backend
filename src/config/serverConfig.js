import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const NODE_DEV = process.env.NODE_DEV || "development";

export const DEV_DB_URL = process.env.DEV_DB_URL;

export const PROD_DB_URL = process.env.PROD_DB_URL;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const EXPIRY = process.env.EXPIRY;

export const MAIL_PASS = process.env.MAIL_PASS;

export const MAIL_ADD = process.env.MAIL_ADD;

export const REDIS_HOST = process.env.REDIS_HOST || "localhost";

export const REDIS_PORT = process.env.REDIS_PORT || 6379;

export const ENABLE_EMAIL_VERIFICATION =
  process.env.ENABLE_EMAIL_VERIFICATION || false;

export const APP_LINK = process.env.APP_LINK || "http://localhost:3000";
