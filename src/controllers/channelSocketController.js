import { JOIN_CHANNEL } from "../utils/common/eventConstant.js";

export default function messageHandler(io, socket) {
  socket.on(JOIN_CHANNEL, async function joinChannelHandler(data, cb) {
    const roomId = data.channelId;
    socket.join(roomId);
    console.log(`User ${socket.id} joined the channel: ${roomId}`);
    cb({
      success: true,
      message: "User has joined channel successfully",
      data: roomId,
    });
  });
}
