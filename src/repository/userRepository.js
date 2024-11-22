import User from "../schema/user.js";

export const createUser = async (username, email, password) => {
  try {
    const user = await User.create({ username, email, password });
    return user;
  } catch (error) {
    console.log("Error while creating user:", error);
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findOne({ _id: id });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.log(error);
  }
};
