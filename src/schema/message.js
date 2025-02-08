import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Message body is required"],
    },
    image: {
      type: String,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Senders id is required"],
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      default: null, // only used for channel messages
    },
    privateChatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PrivateChat",
      default: null, // only used for direct messages
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "workspace id is required"],
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
