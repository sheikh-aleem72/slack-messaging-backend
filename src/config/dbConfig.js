import mongoose from "mongoose";

import { DEV_DB_URL, NODE_DEV, PROD_DB_URL } from "./serverConfig.js";

export default async function connectDB() {
  try {
    if (NODE_DEV === "development") {
      await mongoose.connect(DEV_DB_URL);
    } else if (NODE_DEV === "production") {
      await mongoose.connect(PROD_DB_URL);
    }
    console.log(`Connected to ${NODE_DEV} database successfully!`);
  } catch (error) {
    console.log("Error while connecting to Database", error);
  }
}
