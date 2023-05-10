import { Server, Socket } from "socket.io";
import { Message } from "../models/message.model";
import { Chat } from "../models/chat.model";

export default function handlerEventSocket(io: Server, socket: Socket) {
  //
  const disconnect = () => {
    console.log(`User ${socket.id} disconnected`);
  };
  socket.on("disconnect", disconnect);

  //
  const newMessage = (message: Message) => {
    socket.broadcast.to(message.chat_id).emit("new_message", message);
  };
  socket.on("new_message", newMessage);

  //

}
