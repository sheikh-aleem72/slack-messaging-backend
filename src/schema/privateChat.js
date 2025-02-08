import mongoose from "mongoose";

const privateChatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  ],
  isDirectMessage: {
    type: Boolean,
    default: true,
  },
});

const PrivateChat = mongoose.model("PrivateChat", privateChatSchema);

export default PrivateChat;
