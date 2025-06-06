import { createMessageService } from "../services/messageService.js";
import {
  NEW_MESSAGE_EVENT,
  NEW_MESSAGE_RECEIVED_EVENT,
} from "../utils/common/eventConstant.js";

export default function messageSocketHandlers(io, socket) {
  socket.on(NEW_MESSAGE_EVENT, async function createMessageHandler(data, cb) {
    const { channelId } = data;
    const messageResponse = await createMessageService(data);
    // socket.broadcast.emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);
    console.log("channel id is: ", channelId);
    io.to(channelId).emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);
    cb({
      success: true,
      message: "Successfully created the message",
      data: messageResponse,
    });
  });
}
