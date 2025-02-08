import Message from "../schema/message.js";
import PrivateChat from "../schema/privateChat.js";
import {
  JOIN_PRIVATE_CHAT,
  NEW_PRIVATE_MESSAGE_RECEIVED,
  SEND_PRIVATE_MESSAGE,
} from "../utils/common/eventConstant";

export async function privateChatHandler(socket, io) {
  socket.on(JOIN_PRIVATE_CHAT, async ({ userId, otherUserId }) => {
    let privateChat = await PrivateChat.findOne({
      participants: { $all: [userId, otherUserId] },
      isDirectMessage: true,
    });

    if (!privateChat) {
      privateChat = new PrivateChat({ participants: [userId, otherUserId] });
      await privateChat.save();
    }

    socket.join(privateChat._id.toString());
  });

  socket.on(SEND_PRIVATE_MESSAGE, async ({ senderId, receiverId, message }) => {
    let privateChat = await PrivateChat.findOne({
      participants: { $all: [senderId, receiverId] },
      isDirectMessage: true,
    });

    if (!privateChat) {
      privateChat = new PrivateChat({ participants: [senderId, receiverId] });
      await privateChat.save();
    }

    const newMessage = new Message({
      senderId,
      body: message,
      privateChatId: privateChat._id,
    });

    await newMessage.save();

    // Emit message to both the member
    io.to(privateChat._id).emit(NEW_PRIVATE_MESSAGE_RECEIVED, newMessage);
  });
}
