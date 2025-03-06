import PrivateChat from "../../schema/privateChat.js";
import {
  ACTIVE_USERS,
  DISCONNECTED,
  STOP_TYPING,
  TYPING,
  USER_CONNECTED,
  USER_STOPPED_TYPING,
  USER_TYPING,
} from "./eventConstant.js";

const activeUsers = new Map();

export const socketEvents = (socket, io) => {
  socket.on(USER_CONNECTED, (userId) => {
    activeUsers.set(userId, socket.id); // Store user as active
    io.emit(ACTIVE_USERS, Array.from(activeUsers.keys())); // Send updated list to all
  });

  socket.on(DISCONNECTED, () => {
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        io.emit(ACTIVE_USERS, Array.from(activeUsers.keys())); // Update clients
        break;
      }
    }
  });

  socket.on(TYPING, async ({ user, channelId, memberId }) => {
    if (channelId) {
      socket.to(channelId).emit(USER_TYPING, { user, channelId });
    } else if (memberId) {
      let privateChat = await PrivateChat.findOne({
        participants: { $all: [user, memberId] },
        isDirectMessage: true,
      });

      socket
        .to(privateChat._id.toString())
        .emit(USER_TYPING, { user, privateChatId: privateChat._id.toString() });
    }
  });

  socket.on(STOP_TYPING, async ({ user, channelId, memberId }) => {
    if (channelId) {
      socket.to(channelId).emit(USER_STOPPED_TYPING, { user, channelId });
    } else if (memberId) {
      let privateChat = await PrivateChat.findOne({
        participants: { $all: [user, memberId] },
        isDirectMessage: true,
      });

      socket.to(privateChat._id.toString()).emit(USER_STOPPED_TYPING, {
        user,
        privateChatId: privateChat._id.toString(),
      });
    }
  });
};
