import { createMessageService } from "../services/messageService.js";
import {
  NEW_MESSAGE_EVENT,
  NEW_MESSAGE_RECEIVED_EVENT,
} from "../utils/common/eventConstant.js";

export default function messageSocketHandlers(io, socket) {
  socket.on("NewMessage", async function createMessageHandler(data, cb) {
    console.log(data, typeof data);
    const messageResponse = await createMessageService(data);
    socket.broadcast.emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);
    cb({
      success: true,
      message: "Successfully created the message",
      data: messageResponse,
    });
  });
}
