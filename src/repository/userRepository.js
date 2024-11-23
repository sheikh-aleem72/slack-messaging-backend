import User from "../schema/user.js";
import crudRepository from "./crudRepository.js";

const userRepository = {
  ...crudRepository,
  getUserByEmail: async function (email) {
    const user = User.findOne({ email });
    return user;
  },
  getByName: async function (username) {
    const user = User.findOne({ username });
    return user;
  },
};

export default userRepository;
