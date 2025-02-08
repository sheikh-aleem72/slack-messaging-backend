const activeUsers = new Map();

export const socketEvents = (socket, io) => {
  socket.on("userConnected", (userId) => {
    activeUsers.set(userId, socket.id); // Store user as active
    io.emit("activeUsers", Array.from(activeUsers.keys())); // Send updated list to all
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        io.emit("activeUsers", Array.from(activeUsers.keys())); // Update clients
        break;
      }
    }
  });

  socket.on("typing", ({ user, channelId }) => {
    socket.to(channelId).emit("userTyping", { user, channelId });
  });

  socket.on("stopTyping", ({ user, channelId }) => {
    socket.to(channelId).emit("userStoppedTyping", { user, channelId });
  });
};
