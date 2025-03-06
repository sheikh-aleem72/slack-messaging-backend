import Message from "../schema/message.js";
import PrivateChat from "../schema/privateChat.js";
import { createMessageService } from "../services/messageService.js";
import {
  JOIN_PRIVATE_CHAT,
  LEAVE_PRIVATE_CHAT,
  NEW_PRIVATE_MESSAGE_RECEIVED,
  SEND_PRIVATE_MESSAGE,
} from "../utils/common/eventConstant.js";

export async function privateChatHandler(socket, io) {
  socket.on(JOIN_PRIVATE_CHAT, async ({ userId, otherUserId }, cb) => {
    let privateChat = await PrivateChat.findOne({
      participants: { $all: [userId, otherUserId] },
      isDirectMessage: true,
    });

    if (!privateChat) {
      privateChat = new PrivateChat({ participants: [userId, otherUserId] });
      await privateChat.save();
    }

    socket.join(privateChat._id.toString());

    console.log(
      `User ${socket.id} joined the private chat: ${privateChat._id}`
    );
    cb({
      success: true,
      message: "User has joined private chat successfully",
      data: privateChat._id,
    });
  });

  socket.on(
    SEND_PRIVATE_MESSAGE,
    async ({ senderId, receiverId, body }, cb) => {
      let privateChat = await PrivateChat.findOne({
        participants: { $all: [senderId, receiverId] },
        isDirectMessage: true,
      });

      if (!privateChat) {
        privateChat = new PrivateChat({ participants: [senderId, receiverId] });
        await privateChat.save();
      }

      const newMessage = await createMessageService({
        senderId,
        body,
        privateChatId: privateChat?._id,
      });

      await newMessage.save();

      // Emit message to both the member
      io.to(privateChat._id.toString()).emit(
        NEW_PRIVATE_MESSAGE_RECEIVED,
        newMessage
      );
      cb({
        success: true,
        message: "Successfully created the message",
        data: newMessage,
      });
    }
  );

  socket.on(
    LEAVE_PRIVATE_CHAT,
    async function leaveChannelHandler({ userId, otherUserId }) {
      let privateChat = await PrivateChat.findOne({
        participants: { $all: [userId, otherUserId] },
        isDirectMessage: true,
      });

      socket.leave(privateChat?._id);
      console.log(
        `User ${socket.id} have leaved the private chat: ${privateChat?._id}`
      );
    }
  );
}
